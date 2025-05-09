import React, { useState, useEffect } from "react";
import FileViewer from './FileViewer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchClosureDetail } from "../hook/use-siteclosure";
import { useFormatDate } from "@/hooks/use-format-date";
import { useFormatDuration } from "@/hooks/use-format-duration";
import { Loader2, CheckCircle, XCircle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useSiteClosureLogs } from "../hook/use-site-closure-logs";
import { Badge } from "@/components/ui/badge";

interface SiteClosureDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closureId: number | null;
  onApprove?: () => void;
  onReject?: () => void;
}

const SiteClosureDetailDialog: React.FC<SiteClosureDetailDialogProps> = ({
  open,
  onOpenChange,
  closureId,
  onApprove,
  onReject,
}) => {
  const { formatDate } = useFormatDate();
  const { formatDuration } = useFormatDuration();
  const [selectedFile, setSelectedFile] = useState<{ url: string; filename: string } | null>(null);
  const { user } = useAuth();
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;

  // User role checks
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPUser = parsedMetadata?.user_group_name === "TP" && !!parsedMetadata?.organization_id;
  const isDUSPUser = parsedMetadata?.user_group_name === "DUSP" && !!parsedMetadata?.organization_id;
  const isMCMCUser = parsedMetadata?.user_group_name === "MCMC";
  
  const { data: closure, isLoading, error } = useQuery({
    queryKey: ['closureDetail', closureId],
    queryFn: () => fetchClosureDetail(closureId as number),
    enabled: open && closureId !== null,
  });

  // Use the site closure logs hook
  const { getLogs } = useSiteClosureLogs();
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<Error | null>(null);

  // Fetch logs when closure ID changes
  useEffect(() => {
    const fetchLogs = async () => {
      if (!closureId) return;
      
      setLogsLoading(true);
      try {
        console.log("Fetching logs for closure ID:", closureId);
        const logsData = await getLogs(closureId);
        console.log("Retrieved logs data:", logsData);
        setLogs(logsData || []);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setLogsError(err as Error);
      } finally {
        setLogsLoading(false);
      }
    };

    if (open && closureId) {
      fetchLogs();
    }
  // Remove getLogs from dependency array to prevent infinite loop
  }, [closureId, open]);

  if (!open || closureId === null) return null;

  // Check if user can take action on this request
  const canTakeAction = () => {
    if (!closure) return false;
    
    // Only allow actions on submitted requests (status_id = 2)
    if (closure.nd_closure_status?.id !== 2) return false;
    
    // Staff users can't approve
    if (!isSuperAdmin && !isTPUser && !isDUSPUser && !isMCMCUser) return false;

    const isRelocationCategory = closure.nd_closure_categories?.id === 1;
    const duration = closure.duration || 0;
    
    // Super admin can approve anything submitted
    if (isSuperAdmin) return true;
    
    if (isTPUser) {
      // TP can't approve relocation requests
      if (isRelocationCategory) return false;
      
      // TP can only approve non-relocations up to 2 days
      return duration <= 2;
    }
    
    if (isDUSPUser) {
      // DUSP handles relocations and requests > 2 days
      return isRelocationCategory || duration > 2;
    }
    
    return false;
  };

  const renderAttachments = () => {
    if (!closure?.nd_site_closure_attachment?.length) {
      return <p className="text-muted-foreground">No attachments</p>;
    }

    const attachments = closure.nd_site_closure_attachment;
    return (
      <div className="space-y-2">
        {attachments.map((attachment: any, index: number) => {
          const filePaths = Array.isArray(attachment.file_path)
            ? attachment.file_path
            : [attachment.file_path];

          return (
            <div key={attachment.id || index} className="space-y-1">
              {filePaths.map((path: string, fileIndex: number) => {
                const fileName = path.split('/').pop() || `File ${fileIndex + 1}`;
                return (
                  <FileViewer 
                    key={fileIndex} 
                    path={path}
                    filename={fileName} 
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAffectedAreas = () => {
    if (!closure?.nd_site_closure_affect_area?.length) {
      return <span className="text-muted-foreground">None</span>;
    }

    return (
      <ul className="list-disc pl-5">
        {closure.nd_site_closure_affect_area.map((area: any) => (
          <li key={area.id}>
            {area.nd_closure_affect_areas?.eng || 'Unknown Area'}
          </li>
        ))}
      </ul>
    );
  };

  const renderLogs = () => {
    if (logsLoading) {
      return (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading approval history...</span>
        </div>
      );
    }

    if (logsError) {
      return <p className="text-red-500">Error loading approval history</p>;
    }

    // Filter out draft logs (status ID 1)
    const filteredLogs = logs.filter(log => log.closure_status_id !== 1);

    if (!filteredLogs?.length) {
      return <p className="text-muted-foreground">No approval history available</p>;
    }

    // Function to format date with time
    const formatDateWithTime = (dateString: string) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (err) {
        console.error('Date formatting error:', err);
        return dateString;
      }
    };

    return (
      <div className="border rounded-md">
        <Table>
          <TableBody>
            {filteredLogs.map((log: any) => {
              // Determine the variant for the status badge
              let badgeVariant: "default" | "outline" | "secondary" | "destructive" = "outline";
              if (log.nd_closure_status) {
                switch (log.nd_closure_status.id) {
                  case 3: // Approved 
                  case 6: // Authorized
                    badgeVariant = "secondary";
                    break;
                  case 4: // Rejected
                  case 7: // Declined
                    badgeVariant = "destructive";
                    break;
                  default:
                    badgeVariant = "outline";
                }
              }

              return (
                <TableRow key={log.id}>
                  <TableCell className="w-1/4">
                    <div className="font-medium">
                      {formatDateWithTime(log.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="w-2/4">
                    <div className="space-y-1">
                      <div>{log.remark}</div>
                      {log.profiles && (
                        <div className="text-xs text-muted-foreground">
                          By: {log.profiles.full_name || 'Unknown'} 
                          {log.profiles.user_type && ` (${log.profiles.user_type})`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-1/4 text-right">
                    {log.nd_closure_status && (
                      <Badge variant={badgeVariant}>
                        {log.nd_closure_status.name}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Closure Request Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Loading details...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">Error loading details: {(error as Error).message}</div>
        ) : closure ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Site Information</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Site Name</TableCell>
                    <TableCell>{closure.nd_site_profile?.sitename || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Site Code</TableCell>
                    <TableCell>{closure.nd_site_profile?.nd_site?.[0]?.standard_code || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Organization</TableCell>
                    <TableCell>
                      {closure.nd_site_profile?.organizations?.name || 'N/A'}
                      {closure.nd_site_profile?.organizations?.parent_id?.name && (
                        <span className="text-muted-foreground"> ({closure.nd_site_profile.organizations.parent_id.name})</span>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Closure Details</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Request ID</TableCell>
                    <TableCell>{closure.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell>
                      <span className={
                        closure.nd_closure_status?.name === 'Approved' ? 'text-green-600' :
                        closure.nd_closure_status?.name === 'Rejected' ? 'text-red-600' :
                        closure.nd_closure_status?.name === 'Submitted' ? 'text-blue-600' :
                        'text-amber-600'
                      }>
                        {closure.nd_closure_status?.name || 'Unknown'}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Date Requested</TableCell>
                    <TableCell>{formatDate(closure.request_datetime)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Requestor</TableCell>
                    <TableCell>
                      {closure.profiles?.full_name || 'N/A'}
                      {closure.profiles?.user_type && (
                        <div className="text-xs text-muted-foreground">
                          ({closure.profiles.user_type})
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Category</TableCell>
                    <TableCell>{closure.nd_closure_categories?.eng || 'N/A'}</TableCell>
                  </TableRow>
                  {closure.nd_closure_subcategories && (
                    <TableRow>
                      <TableCell className="font-medium">Sub-category</TableCell>
                      <TableCell>{closure.nd_closure_subcategories.eng}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">Closure Period</TableCell>
                    <TableCell>
                      <div>From: {formatDate(closure.close_start)}</div>
                      <div>To: {formatDate(closure.close_end)}</div>
                    </TableCell>
                  </TableRow>
                  {closure.nd_closure_session && (
                    <TableRow>
                      <TableCell className="font-medium">Session</TableCell>
                      <TableCell>{closure.nd_closure_session?.eng || 'N/A'}</TableCell>
                    </TableRow>
                  )}
                  {(closure.start_time || closure.end_time) && (
                    <TableRow>
                      <TableCell className="font-medium">Time</TableCell>
                      <TableCell>
                        {closure.start_time && (
                          <div>Start: {formatTime(closure.start_time)}</div>
                        )}
                        {closure.end_time && (
                          <div>End: {formatTime(closure.end_time)}</div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                  {formatDuration(closure.duration) && (
                    <TableRow>
                      <TableCell className="font-medium">Duration</TableCell>
                      <TableCell>{formatDuration(closure.duration)}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">Affected Areas</TableCell>
                    <TableCell>{renderAffectedAreas()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reason</TableCell>
                    <TableCell>{closure.remark || 'N/A'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Attachments</h3>
              {renderAttachments()}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Approval History</h3>
              {renderLogs()}
            </div>

            <div className="flex justify-end space-x-2">
              {canTakeAction() && onApprove && onReject ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      onReject();
                      onOpenChange(false);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      onApprove();
                      onOpenChange(false);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">No data found</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SiteClosureDetailDialog;