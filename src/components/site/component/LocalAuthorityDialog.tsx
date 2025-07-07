import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LocalAuthority } from "@/hooks/site-local-authority/use-site-local-authority";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BuildingIcon, FileText, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";

interface LocalAuthorityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  localAuthority: LocalAuthority | null;
}

const LocalAuthorityDialog: React.FC<LocalAuthorityDialogProps> = ({ open, onOpenChange, localAuthority }) => {
  if (!localAuthority) return null;

  // Format date and time
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "PPP p"); // Format: Sep 1, 2023, 3:30 PM
    } catch (e) {
      return "-";
    }
  };

  // Format date only
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "PPP"); // Format: Sep 1, 2023
    } catch (e) {
      return "-";
    }
  };

  // Handle file download/view
  const handleFileView = (filePath: string) => {
    if (filePath.startsWith('http')) {
      window.open(filePath, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader className="pb-2 border-b">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-bold">
              Local Authority Details
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Site local authority information and attachments
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Local Authority Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Local Authority Information</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">Start Date</div>
                  <div className="font-medium">
                    {formatDate(localAuthority.start_date)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">End Date</div>
                  <div className="font-medium">
                    {formatDate(localAuthority.end_date)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Site Profile Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Site Information</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              {localAuthority.site_profile_id ? (
                <div className="flex items-start gap-3">
                  <BuildingIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="font-medium">{localAuthority.site_profile_id.sitename}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      TPN: {localAuthority.site_profile_id.refid_tp} · MCMC: {localAuthority.site_profile_id.refid_mcmc}
                    </div>
                    {localAuthority.site_profile_id.phase_id && (
                      <div className="text-sm mt-1">
                        Phase: {localAuthority.site_profile_id.phase_id.name}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No site profile assigned</div>
              )}
            </div>
          </div>

          {/* File Attachments */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Attachments</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              {localAuthority.file_path && localAuthority.file_path.length > 0 ? (
                <div className="space-y-2">
                  {localAuthority.file_path.map((filePath, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm flex-1 truncate">
                        {filePath.split('/').pop() || `File ${index + 1}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleFileView(filePath)}
                        title="View file"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No attachments</div>
              )}
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">System Information</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Created By</div>
                  <div>{localAuthority.created_by || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Created At</div>
                  <div>{formatDateTime(localAuthority.created_at)}</div>
                </div>
              </div>

              {localAuthority.updated_by && (
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-200 mt-2">
                  <div>
                    <div className="text-xs text-gray-500">Updated By</div>
                    <div>{localAuthority.updated_by}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Updated At</div>
                    <div>{formatDateTime(localAuthority.updated_at)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocalAuthorityDialog;