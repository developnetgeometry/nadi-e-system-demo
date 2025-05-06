import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableRowNumber } from "@/components/ui/TableRowNumber";
import { FilePlus, Loader2, Edit, Trash2, Settings, CheckCircle, XCircle, Clock, Eye, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SiteClosureForm from "./SiteClosure";
import SiteClosureDetailDialog from "./SiteClosureDetailDialog";
import { useSiteId } from "@/hooks/use-site-id";
import { useQuery } from "@tanstack/react-query";
import { fetchlListClosureData } from "../hook/use-siteclosure";
import { useFormatDate } from "@/hooks/use-format-date";
import { useFormatDuration } from "@/hooks/use-format-duration";
import { useDraftClosure, useDeleteDraftClosure } from "../hook/submit-siteclosure-data";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface ClosurePageProps {
  siteId: string;
}

interface ColumnConfig {
  id: string;
  header: string;
  cell: (item: any, index?: number) => React.ReactNode;
  hidden?: boolean;
  responsive?: boolean;
  alwaysVisible?: boolean;
}

// Interface for approval actions
interface ApprovalAction {
  closureId: number;
  statusId: number;
  remark: string;
}

const ClosurePage: React.FC<ClosurePageProps> = ({ siteId }) => {
  const [isSiteClosureOpen, setSiteClosureOpen] = useState(false);
  const [selectedClosureId, setSelectedClosureId] = useState<number | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editDraftData, setEditDraftData] = useState<any>(null);
  const [deleteDraftId, setDeleteDraftId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // New state for pending request deletion
  const [deletePendingId, setDeletePendingId] = useState<number | null>(null);
  const [showDeletePendingConfirm, setShowDeletePendingConfirm] = useState(false);

  // State for approval functionality
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedForAction, setSelectedForAction] = useState<number | null>(null);
  const [actionRemark, setActionRemark] = useState("");
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    siteInfo: true,
    state: true,
    region: true,
    organization: true,
    closurePeriod: true,
    duration: true,
    category: true,
    status: true,
    requestor: true,
    action: true,
  });

  // Add state to track screen size
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { formatDuration } = useFormatDuration();
  const { formatDate } = useFormatDate();
  const { fetchDraftData, loading: loadingDraft } = useDraftClosure();
  const { deleteDraft, loading: deletingDraft } = useDeleteDraftClosure();
  const { toast } = useToast();
  const { user } = useAuth();

  const staffSiteId = useSiteId();

  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPUser = parsedMetadata?.user_group_name === "TP" && !!parsedMetadata?.organization_id;
  const isDUSPUser = parsedMetadata?.user_group_name === "DUSP" && !!parsedMetadata?.organization_id;
  const isMCMCUser = parsedMetadata?.user_group_name === "MCMC"; // MCMC users don't require organization_id
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff" || 
                      parsedMetadata?.user_type === "staff_manager" ||
                      parsedMetadata?.user_type === "staff_assistant_manager";

  const organizationId = 
    parsedMetadata?.user_type !== "super_admin" && 
    (isTPUser || isDUSPUser) && 
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id 
      : null;

  const effectiveSiteId = siteId || (isStaffUser ? staffSiteId : null);

  if (!effectiveSiteId && isStaffUser) {
    console.log('Staff user has no assigned site');
  }

  const { data: closurelistdata, isLoading, error, refetch } = useQuery({
    queryKey: ['siteClosureList', organizationId, effectiveSiteId, isMCMCUser],
    queryFn: () => fetchlListClosureData(organizationId, isDUSPUser, effectiveSiteId, isMCMCUser),
    enabled: (isSuperAdmin || !!organizationId || !!effectiveSiteId || isMCMCUser)
  });

  // Check if user can approve a closure based on role and closure data
  const canApprove = (item: any) => {
    // NADI Staff can't approve
    if (isStaffUser) return false;
    
    // SuperAdmin can approve anything
    if (isSuperAdmin) return true;
    
    // Relocation category (id: 1) always needs DUSP approval
    const isRelocationCategory = item.nd_closure_categories?.id === 1;
    // Check if TP user
    if (isTPUser) {
      // TP can NEVER approve relocation requests (category id: 1)
      if (isRelocationCategory) return false;
      
      // Only allow TP approval for status id 2 (Submitted)
      if (item.nd_closure_status?.id !== 2) return false;
      
      // TP can only approve non-relocations that are <= 2 days
      return item.duration <= 2;
    }
    
    // Check if DUSP user
    if (isDUSPUser) {
      // Only allow DUSP approval for status id 2 (Submitted)
      if (item.nd_closure_status?.id !== 2) return false;
      
      // DUSP handles:
      // 1. Relocations (regardless of duration)
      // 2. Requests > 2 days
      return isRelocationCategory || item.duration > 2;
    }
    
    // No user type matched
    return false;
  };

  // Handle approval action
  const handleApprove = async () => {
    if (!selectedForAction) return;
    
    setIsProcessingAction(true);
    try {
      // Get the closure item
      const closureItem = closurelistdata?.find(item => item.id === selectedForAction);
      if (!closureItem) throw new Error("Closure item not found");
      
      // SAFETY CHECK: Prevent TP users from approving relocation category requests
      const isRelocationCategory = closureItem.nd_closure_categories?.id === 1;
      if (isTPUser && isRelocationCategory) {
        throw new Error("TP users cannot approve relocation requests.");
      }
      
      let newStatusId = 0;
      
      // Determine appropriate status based on user role
      if (isTPUser) {
        // Check if closure needs DUSP authorization due to duration > 2 days
        if (closureItem.duration > 2) {
          // Set to "Recommended" status
          newStatusId = 5; 
        } else {
          // Set to "Approved" status - only for short non-relocations
          newStatusId = 3;
        }
      } else if (isDUSPUser) {
        // DUSP approval sets to "Authorized" status
        newStatusId = 6;
      } else if (isSuperAdmin) {
        // SuperAdmin can directly approve
        newStatusId = 3;
      }
      
      if (newStatusId === 0) throw new Error("Could not determine appropriate status");
      
      // Update the closure status - using 'status' instead of 'status_id'
      const { error: updateError } = await supabase
        .from("nd_site_closure")
        .update({ 
          status: newStatusId // Changed from status_id to status
        })
        .eq("id", selectedForAction);
        
      if (updateError) throw updateError;
      
      // Add to closure logs - keep closure_status_id here as it's for the logs table
      const { error: logError } = await supabase
        .from("nd_site_closure_logs")
        .insert({
          site_closure_id: selectedForAction,
          remark: actionRemark,
          closure_status_id: newStatusId
        });
        
      if (logError) throw logError;
      
      // If the status is "Approved" (3) or "Authorized" (6), update the site profile status
      if (newStatusId === 3 || newStatusId === 6) {
        // Get the site profile ID from the closure item
        const siteProfileId = closureItem.nd_site_profile?.id;        
        if (siteProfileId) {
          // Update the site profile with both status values
          const { error: siteProfileUpdateError } = await supabase
            .from("nd_site_profile")
            .update({
              active_status: 3 // Set active_status to 3 for temporarily closed
            })
            .eq("id", siteProfileId);
            
          if (siteProfileUpdateError) {
            console.error("Error updating site profile status:", siteProfileUpdateError);
            // Don't throw error here to prevent blocking the approval process
            // Instead, we'll just log it and continue
          } else {
            console.log(`Site profile ${siteProfileId} status changed to temporarily close with active_status = 3`);
          }
        }
      }
      
      // Create appropriate success message based on the status
      let successMessage = "Closure request approved successfully";
      if (isTPUser && newStatusId === 5) {
        successMessage = "Closure request recommended for DUSP approval";
      } else if (newStatusId === 3 || newStatusId === 6) {
        successMessage = "Closure request approved and site status set to temporarily closed";
      }
      
      toast({
        title: "Success",
        description: successMessage
      });
      
      refetch();
    } catch (err) {
      console.error("Error approving closure:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to approve closure request",
        variant: "destructive"
      });
    } finally {
      setApprovalDialogOpen(false);
      setSelectedForAction(null);
      setActionRemark("");
      setIsProcessingAction(false);
    }
  };

  // Handle rejection action
  const handleReject = async () => {
    if (!selectedForAction) return;
    
    setIsProcessingAction(true);
    try {
      // Get the closure item
      const closureItem = closurelistdata?.find(item => item.id === selectedForAction);
      if (!closureItem) throw new Error("Closure item not found");
      
      let newStatusId = 0;
      
      // Determine appropriate rejection status based on user role
      if (isTPUser) {
        // TP rejection
        newStatusId = 4; // "Rejected" status
      } else if (isDUSPUser) {
        // DUSP rejection
        newStatusId = 7; // "Declined" status
      } else if (isSuperAdmin) {
        // SuperAdmin rejection
        newStatusId = 4; // "Rejected" status
      }
      
      if (newStatusId === 0) throw new Error("Could not determine appropriate status");
      
      // Update the closure status - using 'status' instead of 'status_id'
      const { error: updateError } = await supabase
        .from("nd_site_closure")
        .update({ 
          status: newStatusId // Changed from status_id to status
        })
        .eq("id", selectedForAction);
        
      if (updateError) throw updateError;
      
      // Add to closure logs
      const { error: logError } = await supabase
        .from("nd_site_closure_logs")
        .insert({
          site_closure_id: selectedForAction,
          remark: actionRemark,
          closure_status_id: newStatusId
        });
        
      if (logError) throw logError;
      
      toast({
        title: "Success",
        description: "Closure request rejected successfully"
      });
      
      refetch();
    } catch (err) {
      console.error("Error rejecting closure:", err);
      toast({
        title: "Error",
        description: "Failed to reject closure request",
        variant: "destructive"
      });
    } finally {
      setRejectionDialogOpen(false);
      setSelectedForAction(null);
      setActionRemark("");
      setIsProcessingAction(false);
    }
  };

  const handleDeletePendingClick = (requestId: number) => {
    setDeletePendingId(requestId);
    setShowDeletePendingConfirm(true);
  };

  const handleDeletePendingConfirm = async () => {
    if (!deletePendingId) return;

    try {
      // Delete the pending request
      const { error } = await supabase
        .from("nd_site_closure")
        .delete()
        .eq("id", deletePendingId);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Closure request deleted successfully"
      });
      
      refetch();
    } catch (err) {
      console.error("Error deleting request:", err);
      toast({
        title: "Error",
        description: "Failed to delete closure request",
        variant: "destructive"
      });
    } finally {
      setShowDeletePendingConfirm(false);
      setDeletePendingId(null);
    }
  };

  const availableColumns = useMemo<ColumnConfig[]>(() => [
    {
      id: 'number',
      header: 'No.',
      cell: (_, index) => <TableRowNumber index={index} />,
      alwaysVisible: true,
    },
    {
      id: 'siteInfo',
      header: 'Site Name',
      cell: (item) => (
        <>
          {item.nd_site_profile?.sitename || 'N/A'}
          <div className="text-xs text-muted-foreground">
            {item.nd_site_profile?.nd_site?.[0]?.standard_code || 'N/A'}
          </div>
        </>
      ),
      alwaysVisible: true,
    },
    {
      id: 'state',
      header: 'State',
      cell: (item) => item.nd_site_profile?.state_id?.name || 'N/A',
      responsive: true,
    },
    {
      id: 'region',
      header: 'Region',
      cell: (item) => item.nd_site_profile?.region_id?.eng || 'N/A',
      responsive: true,
    },
    {
      id: 'organization',
      header: 'Organization',
      cell: (item) => (
        <>
          {item.nd_site_profile?.organizations?.name || 'N/A'}
          {item.nd_site_profile?.organizations?.parent_id?.name && (
            <div className="text-xs text-muted-foreground">
              DUSP: {item.nd_site_profile?.organizations?.parent_id?.name}
            </div>
          )}
        </>
      ),
    },
    {
      id: 'closurePeriod',
      header: 'Closure Period',
      cell: (item) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">From:</span>
            <span>{formatDate(item.close_start)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">To:</span>
            <span>{formatDate(item.close_end)}</span>
          </div>
          {formatDuration(item.duration) && !columnVisibility.duration && (
            <div className="text-xs text-muted-foreground">
              Duration: {formatDuration(item.duration)}
            </div>
          )}
        </div>
      ),
      alwaysVisible: true,
    },
    {
      id: 'duration',
      header: 'Duration',
      cell: (item) => formatDuration(item.duration),
      responsive: true,
    },
    {
      id: 'category',
      header: 'Category',
      cell: (item) => item.nd_closure_categories?.eng || 'N/A',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => {
        let variant = "default";
        const statusName = item.nd_closure_status?.name?.toLowerCase() || 'unknown';
        
        // Map status ID to appropriate variant
        switch (item.nd_closure_status?.id) {
          case 1: variant = "draft"; break; // Draft
          case 2: variant = "submitted"; break; // Submitted
          case 3: variant = "approved"; break; // Approved
          case 4: variant = "rejected"; break; // Rejected
          case 5: variant = "recommended"; break; // Recommended
          case 6: variant = "authorized"; break; // Authorized
          case 7: variant = "declined"; break; // Declined
          case 8: variant = "completed"; break; // Completed
          default: variant = "default"; break;
        }
        
        return <Badge variant={variant as any}>{item.nd_closure_status?.name || 'N/A'}</Badge>;
      },
      alwaysVisible: true,
    },
    {
      id: 'requestor',
      header: 'Requestor',
      cell: (item) => (
        <>
          {item.profiles?.full_name || 'N/A'}
          {item.profiles?.user_type && (
            <div className="text-xs text-muted-foreground">
              {item.profiles.user_type}
            </div>
          )}
        </>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      cell: (item) => {
        const isDraft = item.nd_closure_status?.name === 'Draft';
        const isSubmitted = item.nd_closure_status?.id === 2; // Submitted
        const isPending = isSubmitted && item.created_by === user?.id; // Check if pending and owner
        
        // For small screens - use dropdown menu for all actions
        if (isSmallScreen) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-full p-0 hover:bg-slate-100 transition-colors"
                >
                  <span className="sr-only">Open actions menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewClosure(item.id)}>
                  <Search className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                
                {/* Edit option - only for drafts */}
                {isDraft && item.created_by === user?.id && (
                  <DropdownMenuItem onClick={() => handleEditDraft(item.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                
                {/* Delete options */}
                {((isDraft || isPending) && item.created_by === user?.id) && (
                  <DropdownMenuItem 
                    onClick={() => isDraft ? handleDeleteDraftClick(item.id) : handleDeletePendingClick(item.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
                
                {/* Approval options */}
                {canApprove(item) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedForAction(item.id);
                        setApprovalDialogOpen(true);
                      }}
                      className="text-green-600 focus:text-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedForAction(item.id);
                        setRejectionDialogOpen(true);
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        // For larger screens - use direct buttons for key actions
        else {
          // Action buttons for draft owner
          if (isDraft && item.created_by === user?.id) {
            return (
              <div className="flex gap-2 items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleViewClosure(item.id)}
                  className="h-8 w-8"
                  title="View"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleEditDraft(item.id)}
                  className="h-8 w-8"
                  title="Edit Draft"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteDraftClick(item.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  title="Delete Draft"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          } 
          // Action buttons for pending request owner
          else if (isPending) {
            return (
              <div className="flex gap-2 items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleViewClosure(item.id)}
                  className="h-8 w-8"
                  title="View"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeletePendingClick(item.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  title="Delete Request"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          }
          // Action buttons for approval - DIRECT BUTTONS for approvers on larger screens
          else if (canApprove(item)) {
            return (
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleViewClosure(item.id)}
                  className="h-8 w-8"
                  title="View"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="bg-green-600 hover:bg-green-700 h-8 w-8"
                  onClick={() => {
                    setSelectedForAction(item.id);
                    setApprovalDialogOpen(true);
                  }}
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setSelectedForAction(item.id);
                    setRejectionDialogOpen(true);
                  }}
                  title="Reject"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            );
          } 
          // View only
          else {
            return (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleViewClosure(item.id)}
                className="h-8 w-8"
                title="View"
              >
                <Search className="h-4 w-4" />
              </Button>
            );
          }
        }
      },
      alwaysVisible: true,
    },
  ], [user, formatDate, formatDuration, columnVisibility, isSmallScreen]);

  const filteredClosureData = useMemo(() => {
    if (!closurelistdata || !user) return [];
    
    return closurelistdata.filter(item => {
      if (item.nd_closure_status?.name !== 'Draft') {
        return true;
      }

      if (isSuperAdmin) {
        return true;
      }
      
      return item.created_by === user.id;
    });
  }, [closurelistdata, user, isSuperAdmin]);

  const visibleColumns = useMemo(() => {
    return availableColumns.filter(col => {
      if (col.alwaysVisible) return true;
      return columnVisibility[col.id] !== false;
    });
  }, [availableColumns, columnVisibility]);

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const resetColumnVisibility = () => {
    setColumnVisibility({
      siteInfo: true,
      state: true,
      region: true,
      organization: true,
      closurePeriod: true,
      duration: true,
      category: true,
      status: true,
      requestor: true,
      action: true,
    });
  };

  // Update the resize handler to track screen size for responsive action buttons
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const isDesktop = window.innerWidth >= 1024;
      
      // Set small screen state for action buttons
      setIsSmallScreen(isMobile || isTablet);

      if (isMobile) {
        setColumnVisibility(prev => ({
          ...prev,
          state: false,
          region: false,
          organization: false,
          duration: false,
          requestor: isDesktop,
        }));
      } else if (isTablet) {
        setColumnVisibility(prev => ({
          ...prev,
          state: false,
          region: false,
          organization: true,
          duration: false,
          requestor: true,
        }));
      } else {
        resetColumnVisibility();
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDialogOpenChange = (open: boolean) => {
    setSiteClosureOpen(open);
    if (!open) {
      setEditDraftData(null);
      refetch();
    }
  };

  const handleViewClosure = (closureId: number) => {
    setSelectedClosureId(closureId);
    setIsDetailDialogOpen(true);
  };

  const handleEditDraft = async (closureId: number) => {
    try {
      const formData = await fetchDraftData(closureId);
      setEditDraftData(formData);
      setSiteClosureOpen(true);
    } catch (err) {
      console.error("Failed to prepare draft for editing:", err);
    }
  };

  const handleNewRequest = () => {
    setEditDraftData(null);
    setSiteClosureOpen(true);
  };

  const handleDeleteDraftClick = (draftId: number) => {
    setDeleteDraftId(draftId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteDraftConfirm = async () => {
    if (!deleteDraftId) return;

    try {
      const result = await deleteDraft(deleteDraftId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Draft request deleted successfully"
        });
        refetch();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error("Error deleting draft:", err);
      toast({
        title: "Error",
        description: "Failed to delete draft request",
        variant: "destructive"
      });
    } finally {
      setShowDeleteConfirm(false);
      setDeleteDraftId(null);
    }
  };

  if (!isSuperAdmin && !organizationId && !effectiveSiteId && !isMCMCUser) {
    return <div>You do not have access to view this list.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Site Closure Requests</h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="w-full md:w-[400px]">
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Column Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableColumns
                .filter(col => !col.alwaysVisible)
                .map(col => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={columnVisibility[col.id] !== false}
                    onCheckedChange={() => toggleColumnVisibility(col.id)}
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetColumnVisibility}>
                Reset to Default
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Only show New Closure Request button if not DUSP or MCMC user */}
          {!isDUSPUser && !isMCMCUser && (
            <Button onClick={handleNewRequest}>
              <FilePlus className="mr-2 h-4 w-4" />
              New Closure Request
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Loading data...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">Error loading data: {(error as Error).message}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.map(column => (
                    <TableHead 
                      key={column.id} 
                      className={column.id === 'number' ? 'w-[60px] text-center' : ''}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClosureData && filteredClosureData.length > 0 ? (
                  filteredClosureData.map((item, index) => (
                    <TableRow key={item.id}>
                      {visibleColumns.map(column => (
                        <TableCell key={`${item.id}-${column.id}`}>
                          {column.id === 'number' 
                            ? column.cell(null, index) 
                            : column.cell(item)
                          }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="text-center py-4">
                      No closure requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <SiteClosureForm
        open={isSiteClosureOpen}
        onOpenChange={handleDialogOpenChange}
        siteId={effectiveSiteId || ""}
        onSuccess={() => refetch()}
        editData={editDraftData}
        clearEditData={() => setEditDraftData(null)}
      />

      <SiteClosureDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        closureId={selectedClosureId}
      />

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Draft"
        description={
          <div className="space-y-2">
            <p>Are you sure you want to delete this draft closure request?</p>
            <p className="text-red-500">This action cannot be undone.</p>
          </div>
        }
        cancelText="Cancel"
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={handleDeleteDraftConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteDraftId(null);
        }}
      />

      <ConfirmationDialog
        open={showDeletePendingConfirm}
        onOpenChange={setShowDeletePendingConfirm}
        title="Delete Pending Request"
        description={
          <div className="space-y-2">
            <p>Are you sure you want to delete this pending closure request?</p>
            <p className="text-red-500">This action cannot be undone.</p>
          </div>
        }
        cancelText="Cancel"
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={handleDeletePendingConfirm}
        onCancel={() => {
          setShowDeletePendingConfirm(false);
          setDeletePendingId(null);
        }}
      />

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Closure Request</DialogTitle>
            <DialogDescription>
              Please provide a remark for the approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approval-remark">Approval Remark</Label>
              <Textarea 
                id="approval-remark" 
                placeholder="Enter your approval remarks here..." 
                value={actionRemark}
                onChange={(e) => setActionRemark(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setApprovalDialogOpen(false);
                setSelectedForAction(null);
                setActionRemark("");
              }}
              disabled={isProcessingAction}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={isProcessingAction}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Closure Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for the rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-remark">Rejection Reason <span className="text-red-500">*</span></Label>
              <Textarea 
                id="rejection-remark" 
                placeholder="Enter your rejection reason here..." 
                value={actionRemark}
                onChange={(e) => setActionRemark(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setRejectionDialogOpen(false);
                setSelectedForAction(null);
                setActionRemark("");
              }}
              disabled={isProcessingAction}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReject}
              disabled={isProcessingAction || !actionRemark.trim()}
              variant="destructive"
            >
              {isProcessingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClosurePage;
