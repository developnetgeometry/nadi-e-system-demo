import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Phase } from "@/hooks/phase/use-phase";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BuildingIcon, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface PhaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase: Phase | null;
}

const PhaseDialog: React.FC<PhaseDialogProps> = ({ open, onOpenChange, phase }) => {
  if (!phase) return null;

  // Format dates properly when available
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "PPP"); // Format: Sep 1, 2023
    } catch (e) {
      return "-";
    }
  };

  // Format date and time
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "PPP p"); // Format: Sep 1, 2023, 3:30 PM
    } catch (e) {
      return "-";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader className="pb-2 border-b">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-bold">{phase.name}</DialogTitle>
            <div className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5",
              phase.is_active
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            )}>
              {phase.is_active ?
                <><CheckCircle className="h-3 w-3" /> Active</> :
                <><XCircle className="h-3 w-3" /> Inactive</>
              }
            </div>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Details for this phase
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">{/* Organization Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Organization</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              {phase.organization_id ? (
                <div className="flex items-start gap-3">
                  <BuildingIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="font-medium">{phase.organization_id.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {phase.organization_id.type} · ID: {phase.organization_id.id}
                    </div>
                    {phase.organization_id.description && (
                      <div className="text-sm mt-1">{phase.organization_id.description}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No organization assigned</div>
              )}
            </div>
          </div>

          {/* Date Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Contract Period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-medium">Start Date</span>
                </div>
                <div className="mt-1 font-medium">
                  {formatDate(phase.nd_phases_contract?.start_date)}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-medium">End Date</span>
                </div>
                <div className="mt-1 font-medium">
                  {formatDate(phase.nd_phases_contract?.end_date)}
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">System Information</h3>
            <div className="bg-gray-50 p-3 rounded-md space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Created By</div>
                  <div>{phase.created_by || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Created At</div>
                  <div>{formatDateTime(phase.created_at)}</div>
                </div>
              </div>

              {phase.updated_by && (
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500">Updated By</div>
                    <div>{phase.updated_by}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Updated At</div>
                    <div>{formatDateTime(phase.updated_at)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Remarks - at the end as requested */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Remarks</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm whitespace-pre-wrap">
                {phase.remark || "No remarks provided"}
              </div>
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

export default PhaseDialog;
