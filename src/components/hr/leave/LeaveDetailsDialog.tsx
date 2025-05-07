
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";

interface LeaveDetailsDialogProps {
  leave: {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    status: "Pending" | "Approved" | "Rejected";
    reason: string;
    attachmentUrl?: string;
    created_at: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeaveDetailsDialog({
  leave,
  open,
  onOpenChange,
}: LeaveDetailsDialogProps) {
  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Approved: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {leave.type} Leave Application
            <Badge variant="outline" className={`ml-2 ${statusColors[leave.status]}`}>
              {leave.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Applied on {format(new Date(leave.created_at), "PPP")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium text-sm">Duration:</span>
            <div className="col-span-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              {format(new Date(leave.startDate), "PPP")} - {format(new Date(leave.endDate), "PPP")}
              <span className="ml-2 text-sm text-muted-foreground">
                ({leave.days} {leave.days === 1 ? "day" : "days"})
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium text-sm">Reason:</span>
            <p className="col-span-3">{leave.reason}</p>
          </div>
          {leave.attachmentUrl && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-sm">Attachment:</span>
              <div className="col-span-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  View Document
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
