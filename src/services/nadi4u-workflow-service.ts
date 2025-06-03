import { supabase } from "@/integrations/supabase/client";
import {
  sendNotificationToUsers,
  sendTemplateNotificationToUsers,
} from "@/utils/notification-utils";

export interface NADI4UWorkflowData {
  programmeId: string;
  programmeTitle: string;
  startDate: string;
  endDate: string;
  location: string;
  description?: string;
  submittedBy: string;
  submittedAt: string;
}

export interface WorkflowTask {
  id: string;
  workflow_id: string;
  step_name: string;
  assignee_type: string;
  status: "pending" | "approved" | "rejected";
  assigned_at: string;
  completed_at?: string;
  comments?: string;
}

export const NADI4UWorkflowService = {
  // Initialize the backdated programme approval workflow
  async startBackdatedApprovalWorkflow(
    programmeId: string,
    programmeData: any,
    submittedBy: string
  ): Promise<string | null> {
    try {
      // Create workflow record
      const workflowData: NADI4UWorkflowData = {
        programmeId,
        programmeTitle: programmeData.program_name,
        startDate: programmeData.start_datetime,
        endDate: programmeData.end_datetime,
        location: programmeData.location_event || "",
        description: programmeData.description || "",
        submittedBy,
        submittedAt: new Date().toISOString(),
      };

      const { data: workflow, error: workflowError } = await supabase
        .from("workflows")
        .insert({
          workflow_name: "NADI4U Backdated Programme Approval",
          entity_type: "nadi4u_programme",
          entity_id: programmeId,
          status: "pending",
          data: workflowData,
          created_by: submittedBy,
        })
        .select()
        .single();

      if (workflowError) throw workflowError;

      // Create initial workflow task for TP approval
      const { error: taskError } = await supabase
        .from("workflow_tasks")
        .insert({
          workflow_id: workflow.id,
          step_name: "TP Review",
          assignee_type: "tp",
          status: "pending",
          assigned_at: new Date().toISOString(),
        });

      if (taskError) throw taskError;

      return workflow.id;
    } catch (error) {
      console.error("Error starting backdated approval workflow:", error);
      return null;
    }
  },

  // Send program creation notification to eligible users
  async sendProgramCreationNotification(
    programmeData: any,
    categoryName: string
  ): Promise<boolean> {
    try {
      // Get all users excluding specified user types
      const excludedUserTypes = [
        "member",
        "vendor_admin",
        "vendor_staff",
        "staff_manager",
        "staff_assistant_manager",
        "tp_site",
      ];

      const { data: eligibleUsers, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .not("user_type", "in", `(${excludedUserTypes.join(",")})`);

      if (userError) throw userError;

      if (eligibleUsers && eligibleUsers.length > 0) {
        const userIds = eligibleUsers.map((user) => user.id);

        const title = `New ${categoryName} Program Created`;
        const message = `A new program "${
          programmeData.program_name
        }" has been created for ${categoryName}. Location: ${
          programmeData.location_event || "TBD"
        }, Start Date: ${new Date(
          programmeData.start_datetime
        ).toLocaleDateString()}`;

        await sendNotificationToUsers(userIds, title, message, "info");
      }

      return true;
    } catch (error) {
      console.error("Error sending program creation notification:", error);
      return false;
    }
  },

  // Send backdated approval notification to SSO roles
  async sendBackdatedApprovalNotification(
    programmeData: any
  ): Promise<boolean> {
    try {
      // Get SSO users
      const ssoUserTypes = [
        "sso_admin",
        "sso_operation",
        "sso_management",
        "sso_pillar",
      ];

      const { data: ssoUsers, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .in("user_type", ssoUserTypes);

      if (userError) throw userError;

      if (ssoUsers && ssoUsers.length > 0) {
        // Find the Programme Backdated Approval template
        const { data: template, error: templateError } = await supabase
          .from("notification_templates")
          .select("id")
          .eq("name", "Programme Backdated Approval")
          .single();

        if (templateError) {
          console.error(
            "Programme Backdated Approval template not found:",
            templateError
          );
          // Fallback to direct notification
          const userIds = ssoUsers.map((user) => user.id);
          const title = "Programme Backdated Approval Required";
          const message = `The programme "${programmeData.program_name}" has been approved and requires backdated approval processing.`;

          await sendNotificationToUsers(userIds, title, message, "warning");
          return true;
        }

        // Prepare template parameters
        const templateParams = {
          programme_name: programmeData.program_name || "Unknown Programme",
          location: programmeData.location_event || "TBD",
          start_date: new Date(
            programmeData.start_datetime
          ).toLocaleDateString(),
          end_date: new Date(programmeData.end_datetime).toLocaleDateString(),
          approval_date: new Date().toLocaleDateString(),
        };

        const userIds = ssoUsers.map((user) => user.id);
        await sendTemplateNotificationToUsers(
          userIds,
          template.id,
          templateParams
        );
      }

      return true;
    } catch (error) {
      console.error("Error sending backdated approval notification:", error);
      return false;
    }
  },

  // Get pending approvals for a user type
  async getPendingApprovals(userType: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("workflow_tasks")
        .select(
          `
          id,
          workflow_id,
          step_name,
          status,
          assigned_at,
          workflows:workflow_id (
            id,
            workflow_name,
            entity_id,
            entity_type,
            data,
            status,
            created_at
          )
        `
        )
        .eq("assignee_type", userType)
        .eq("status", "pending");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      return [];
    }
  },

  // Process approval decision
  async processApproval(
    taskId: string,
    workflowId: string,
    action: "approve" | "reject",
    comments: string,
    approverId: string
  ): Promise<boolean> {
    try {
      // Update the task
      const { error: taskError } = await supabase
        .from("workflow_tasks")
        .update({
          status: action === "approve" ? "approved" : "rejected",
          completed_at: new Date().toISOString(),
        })
        .eq("id", taskId);

      if (taskError) throw taskError;

      // Add comment
      const { error: commentError } = await supabase
        .from("workflow_task_comments")
        .insert({
          task_id: taskId,
          comment: comments,
          created_by: approverId,
          action_type: action,
        });

      if (commentError) throw commentError;

      // Update workflow status
      const newWorkflowStatus = action === "approve" ? "approved" : "rejected";
      const { error: workflowError } = await supabase
        .from("workflows")
        .update({
          status: newWorkflowStatus,
          completed_at: new Date().toISOString(),
        })
        .eq("id", workflowId);

      if (workflowError) throw workflowError;

      // If approved, update the programme status and send backdated approval notification
      if (action === "approve") {
        const { data: workflowData } = await supabase
          .from("workflows")
          .select("entity_id, data")
          .eq("id", workflowId)
          .single();

        if (workflowData) {
          // Update programme status
          await supabase
            .from("nd_event")
            .update({ status_id: 2 }) // Assuming 2 is 'approved' status
            .eq("id", workflowData.entity_id);

          // Get programme data for notification
          const { data: programmeData } = await supabase
            .from("nd_event")
            .select("*")
            .eq("id", workflowData.entity_id)
            .single();

          if (programmeData) {
            // Send backdated approval notification to SSO roles
            await this.sendBackdatedApprovalNotification(programmeData);
          }
        }
      }

      return true;
    } catch (error) {
      console.error("Error processing approval:", error);
      return false;
    }
  },

  // Check if a programme needs backdated approval
  isBackdatedProgramme(startDate: string): boolean {
    const programmeStart = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    return programmeStart < today;
  },
};
