import React, { useState } from "react";
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
import { Loader2, FileIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface SiteClosureDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closureId: number | null;
}

const SiteClosureDetailDialog: React.FC<SiteClosureDetailDialogProps> = ({
  open,
  onOpenChange,
  closureId,
}) => {
  const { formatDate } = useFormatDate();
  const { formatDuration } = useFormatDuration();
  const [selectedFile, setSelectedFile] = useState<{ url: string; filename: string } | null>(null);

  const { data: closure, isLoading, error } = useQuery({
    queryKey: ['closureDetail', closureId],
    queryFn: () => fetchClosureDetail(closureId as number),
    enabled: open && closureId !== null,
  });

  if (!open || closureId === null) return null;

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

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
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
