import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Audit } from "@/hooks/site-audit/use-site-audit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BuildingIcon, FileText, ExternalLink, Users, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface AuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audit: Audit | null;
}

const AuditDialog: React.FC<AuditDialogProps> = ({ open, onOpenChange, audit }) => {
  if (!audit) return null;

  // Format date and time
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "PPP p"); // Format: Sep 1, 2023, 3:30 PM
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
              Audit Details
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Site audit information and attachments
          </DialogDescription>
        </DialogHeader>        <div className="py-4 space-y-4">
          {/* Audit Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Audit Information</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">Audit Date</div>
                  <div className="font-medium">
                    {audit.audit_date ? format(parseISO(audit.audit_date), "PPP") : "Not specified"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Audit Party</div>
                  <div className="font-medium">{audit.audit_party || "Not specified"}</div>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Purpose</div>
                <div className="font-medium text-sm">{audit.purpose || "Not specified"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Rectification Required</div>
                <div className="mt-1">
                  {audit.rectification_status === true ? (
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <XCircle className="h-3 w-3" />
                      Yes
                    </Badge>
                  ) : audit.rectification_status === null ? (
                    <Badge variant="secondary" className="w-fit">Not Set</Badge>
                  ) : (
                    <Badge variant="success" className="flex items-center gap-1 w-fit">
                      <CheckCircle className="h-3 w-3" />
                      No
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Site Profile Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Site Information</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              {audit.site_profile_id ? (
                <div className="flex items-start gap-3">
                  <BuildingIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="font-medium">{audit.site_profile_id.sitename}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      TPN: {audit.site_profile_id.refid_tp} · MCMC: {audit.site_profile_id.refid_mcmc}
                    </div>
                    {audit.site_profile_id.phase_id && (
                      <div className="text-sm mt-1">
                        Phase: {audit.site_profile_id.phase_id.name}
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
              {audit.file_path && audit.file_path.length > 0 ? (
                <div className="space-y-2">
                  {audit.file_path.map((filePath, index) => (
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

          {/* Remarks */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Remarks</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm whitespace-pre-wrap">
                {audit.remark || "No remarks provided"}
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">System Information</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Created By</div>
                  <div>{audit.created_by || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Created At</div>
                  <div>{formatDateTime(audit.created_at)}</div>
                </div>
              </div>

              {audit.updated_by && (
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-200 mt-2">
                  <div>
                    <div className="text-xs text-gray-500">Updated By</div>
                    <div>{audit.updated_by}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Updated At</div>
                    <div>{formatDateTime(audit.updated_at)}</div>
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

export default AuditDialog;