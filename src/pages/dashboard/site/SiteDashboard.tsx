import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchSites,
  fetchAllStates,
  toggleSiteActiveStatus,
  deleteSite,
} from "@/components/site/hook/site-utils";
import type { Site } from "@/types/site";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DataTable, { Column } from "@/components/ui/datatable";

interface SiteDashboardProps {
  isBookingsEnabled?: boolean;
  setSelectedSiteId?: React.Dispatch<React.SetStateAction<number | null>>;
}

export const SiteDashboard = ({
  isBookingsEnabled = false,
  setSelectedSiteId
}: SiteDashboardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isTPUser =
    parsedMetadata?.user_group_name === "TP" &&
    !!parsedMetadata?.organization_id;
  const isDUSPUser =
    parsedMetadata?.user_group_name === "DUSP" &&
    !!parsedMetadata?.organization_id;
  const isMCMCUser = parsedMetadata?.user_group_name === "MCMC" || parsedMetadata?.user_type?.startsWith('sso'); // MCMC users don't require organization_id
  const isRestrictedUser = isDUSPUser || isMCMCUser; // Combined check for both DUSP and MCMC users
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
      (isTPUser || isDUSPUser) &&
      parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;
  // MCMC users don't need an organization_id for access

  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Fetch sites data
  const { data: sitesData, isLoading } = useQuery({
    queryKey: ["sites", organizationId],
    queryFn: async () => {
      console.log("ismcmcuser", isMCMCUser);
      const sites = await fetchSites(
        organizationId,
        isTPUser,
        isDUSPUser,
        isMCMCUser
      );
      return sites;
    },
    enabled: !!organizationId || isSuperAdmin || isMCMCUser,
  });

  const handleViewDetailsClick = (siteId: string) => {
    navigate(`/site-management/site?id=${siteId}`);
  };

  const handleEditClick = (site: Site) => {
    // Navigate to the edit page
    navigate(`/site-management/edit/${site.id}`);
  };

  const handleToggleStatus = async (site: Site) => {
    try {
      await toggleSiteActiveStatus(site.id.toString(), site.is_active);
      // Invalidate and refetch the sites query to update the UI
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["site-stats"] });
      toast({
        title: `Site visibility updated`,
        description: `The site ${site.sitename} visibility has been successfully updated.`,
      });
    } catch (error) {
      console.error("Failed to update site visibility:", error);
      toast({
        title: "Error",
        description: "Failed to update the site visibility. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (siteId: string) => {
    setSiteToDelete(siteId);
    setIsDeleteDialogOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;

    switch (status) {
      case "In Operation":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>
        );
      case "Temporarily Close":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">{status}</Badge>
        );
      case "Permanently Close":
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      default:
        return <Badge variant="outline">{status.replace("_", " ")}</Badge>;
    }
  };

  // Get total PC
  const getTotalPC = (site: Site) => {
    return site?.nd_site[0]?.nd_asset?.filter(pc => pc?.type_id === 3).length || 0;
  };

  // DataTable columns configuration
  const columns: Column[] = [
    {
      key: (_, i) => `${i + 1}.`,
      header: "No",
      width: "5%",
      visible: true,
      align: "center" as const
    },
    {
      key: "nd_site.0.standard_code",
      header: "Site ID",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value) => value || "-"
    },
    {
      key: "sitename",
      header: "Site Name",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "left" as const,
      width: "15%",
      render: (value) => value || "-"
    },
    {
      key: "nd_phases.name",
      header: "Phase",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value) => value || "-"
    },
    {
      key: "nd_region.eng",
      header: "Region",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value) => value || "-"
    },
    {
      key: "nd_site_address.0.nd_state.name",
      header: "State",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value) => value || "-"
    },
    ...(isDUSPUser ? [{
      key: "dusp_tp.name",
      header: "TP",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value: any) => value || "N/A"
    }] : []),
    ...((isSuperAdmin || isMCMCUser) ? [{
      key: "dusp_tp_id_display",
      header: "TP (DUSP)",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value: any) => value || "N/A"
    }] : []),
    {
      key: isBookingsEnabled ? (row: any) => getTotalPC(row) : "nd_site_status.eng",
      header: isBookingsEnabled ? "Total PC" : "Status",
      filterable: !isBookingsEnabled,
      visible: true,
      filterType: isBookingsEnabled ? ("number" as const) : ("string" as const),
      align: "center" as const,
      width: "10%",
      render: (value, row) => {
        if (isBookingsEnabled) {
          return getTotalPC(row);
        } else {
          return getStatusBadge(value);
        }
      }
    },
    {
      key: (row) => (
        <div className="flex space-x-2 justify-center">
          {(!isRestrictedUser && !isBookingsEnabled) && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
              onClick={() => handleEditClick(row)}
              title="Edit site"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          {isSuperAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
              onClick={() => handleDeleteClick(row.id)}
              title="Delete site"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            onClick={() => !isBookingsEnabled ? handleViewDetailsClick(row.id) : setSelectedSiteId?.(row.id)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
        </div>
      ),
      header: "Actions",
      align: "center" as const,
      width: "12%",
      visible: true,
    }
  ];

  // Access control logic - moved after all hooks
  if (
    parsedMetadata?.user_type !== "super_admin" &&
    !organizationId &&
    !isMCMCUser
  ) {
    return (
      <>
        <div>You do not have access to this dashboard.</div>;
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{!isBookingsEnabled ? "Site Management" : "Booking Management"}</h1>
            <p className="text-gray-500 mt-1">
              Manage all physical PC and Facility in locations
            </p>
          </div>
          {(!isRestrictedUser && !isBookingsEnabled) && (
            <Button
              onClick={() => navigate("/site-management/create")}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add New Site</span>
            </Button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <DataTable
            data={sitesData || []}
            columns={columns}
            pageSize={10}
            isLoading={isLoading}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div>
              Are you sure you want to delete this site?
              Type "DELETE" to confirm.
            </div>
            <Input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="mt-2 p-2"
              placeholder="DELETE"
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeleteConfirmation("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (deleteConfirmation !== "DELETE") return;

                  try {
                    if (siteToDelete) {
                      // Single site deletion
                      await deleteSite(siteToDelete);

                      toast({
                        title: "Site deleted",
                        description: "The site has been successfully deleted.",
                      });
                    }

                    // Invalidate queries to refresh the data
                    queryClient.invalidateQueries({ queryKey: ["sites"] });
                    queryClient.invalidateQueries({ queryKey: ["site-stats"] });
                  } catch (error) {
                    console.error("Failed to delete site(s):", error);
                    toast({
                      title: "Error",
                      description:
                        "Failed to delete the site(s). Please try again.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsDeleteDialogOpen(false);
                    setSiteToDelete(null);
                    setDeleteConfirmation("");
                  }
                }}
                disabled={deleteConfirmation !== "DELETE"}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SiteDashboard;
