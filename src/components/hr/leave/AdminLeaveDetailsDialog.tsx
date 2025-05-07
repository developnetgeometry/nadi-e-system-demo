
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
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
import { Calendar, FileText, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface AdminLeaveDetailsDialogProps {
  leave: {
    id: string;
    staff: {
      id: string;
      name: string;
    };
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

export function AdminLeaveDetailsDialog({
  leave,
  open,
  onOpenChange,
}: AdminLeaveDetailsDialogProps) {
  const { toast } = useToast();
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Approved: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200"
  };

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      // In a real app, you would send an API request
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: "Leave application approved",
        description: "The staff will be notified of your decision.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve leave application.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReject = async () => {
    if (!remarks.trim()) {
      toast({
        title: "Remarks required",
        description: "Please provide remarks when rejecting a leave application.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      // In a real app, you would send an API request
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: "Leave application rejected",
        description: "The staff will be notified of your decision.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject leave application.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = leave.status === "Pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Leave Application Details
            <Badge variant="outline" className={`ml-2 ${statusColors[leave.status]}`}>
              {leave.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Review leave application submitted by staff
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center">
                <User className="h-4 w-4 mr-2" />
                Staff Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-sm font-medium">Name:</div>
                <div className="col-span-3">{leave.staff.name}</div>
                
                <div className="text-sm font-medium">Staff ID:</div>
                <div className="col-span-3">{leave.staff.id}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Leave Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-sm font-medium">Leave Type:</div>
                <div className="col-span-3">{leave.type}</div>
                
                <div className="text-sm font-medium">Duration:</div>
                <div className="col-span-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(leave.startDate), "PPP")} - {format(new Date(leave.endDate), "PPP")}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({leave.days} {leave.days === 1 ? "day" : "days"})
                  </span>
                </div>
                
                <div className="text-sm font-medium">Applied On:</div>
                <div className="col-span-3">{format(new Date(leave.created_at), "PPP")}</div>
                
                <div className="text-sm font-medium">Reason:</div>
                <div className="col-span-3">{leave.reason}</div>
                
                {leave.attachmentUrl && (
                  <>
                    <div className="text-sm font-medium">Attachment:</div>
                    <div className="col-span-3">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {isPending && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Remarks (required for rejection)</p>
              <Textarea
                placeholder="Enter remarks for approval or rejection..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isPending ? (
            <>
              <Button 
                onClick={handleApprove} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Processing..." : "Approve"}
              </Button>
              <Button 
                onClick={handleReject} 
                variant="destructive" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Reject"}
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
