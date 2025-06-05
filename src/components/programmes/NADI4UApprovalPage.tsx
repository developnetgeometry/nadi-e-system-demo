import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  NADI4UWorkflowService,
  NADI4UWorkflowData,
} from "@/services/nadi4u-workflow-service";
import { formatDate } from "@/utils/date-utils";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PendingApproval {
  id: string;
  workflow_id: string;
  step_name: string;
  status: string;
  assigned_at: string;
  workflows: {
    id: string;
    workflow_name: string;
    entity_id: string;
    entity_type: string;
    data: NADI4UWorkflowData;
    status: string;
    created_at: string;
  };
}

export const NADI4UApprovalPage: React.FC = () => {
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(
    []
  );
  const [selectedApproval, setSelectedApproval] =
    useState<PendingApproval | null>(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Determine user type - in a real app, this would come from user profile
  const getUserType = () => {
    // This is a placeholder - in reality, you'd get this from user profile
    return "tp"; // Technology Partner
  };

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    setLoading(true);
    try {
      const userType = getUserType();
      const approvals = await NADI4UWorkflowService.getPendingApprovals(
        userType
      );
      setPendingApprovals(approvals);
    } catch (error) {
      console.error("Error loading approvals:", error);
      toast({
        title: "Error",
        description: "Failed to load pending approvals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (action: "approve" | "reject") => {
    if (!selectedApproval || !user?.id) return;

    if (action === "reject" && !comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide comments when rejecting an approval",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const success = await NADI4UWorkflowService.processApproval(
        selectedApproval.id,
        selectedApproval.workflow_id,
        action,
        comments.trim(),
        user.id
      );

      if (success) {
        toast({
          title: "Success",
          description: `Programme ${
            action === "approve" ? "approved" : "rejected"
          } successfully`,
        });

        setSelectedApproval(null);
        setComments("");
        loadPendingApprovals();
      } else {
        throw new Error("Failed to process approval");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process approval",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading pending approvals...</span>
      </div>
    );
  }

  if (selectedApproval) {
    const programme = selectedApproval.workflows.data;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Programme Approval Details</h1>
          <Button variant="outline" onClick={() => setSelectedApproval(null)}>
            Back to List
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Programme Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Programme Title
                </label>
                <p className="font-medium">{programme.programmeTitle}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Start Date
                </label>
                <p>{formatDate(programme.startDate)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  End Date
                </label>
                <p>{formatDate(programme.endDate)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Location
                </label>
                <p>{programme.location || "Not specified"}</p>
              </div>

              {programme.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p>{programme.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Submitted Date
                </label>
                <p>{formatDate(programme.submittedAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="mt-1">
                  {getStatusBadge(selectedApproval.workflows.status)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approval Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Comments{" "}
                  {selectedApproval.status === "pending"
                    ? "(Required for rejection)"
                    : ""}
                </label>
                <Textarea
                  placeholder="Enter your comments..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  disabled={processing}
                />
              </div>

              {selectedApproval.status === "pending" && (
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => handleApproval("reject")}
                    disabled={processing}
                    className="flex-1"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApproval("approve")}
                    disabled={processing}
                    className="flex-1"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Approve
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          NADI4U Backdated Programme Approvals
        </h1>
      </div>

      {pendingApprovals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No pending approvals found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <Card
              key={approval.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {approval.workflows.data.programmeTitle}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {formatDate(approval.workflows.data.startDate)}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {approval.workflows.data.location || "Not specified"}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {formatDate(approval.assigned_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(approval.status)}
                    <Button onClick={() => setSelectedApproval(approval)}>
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
