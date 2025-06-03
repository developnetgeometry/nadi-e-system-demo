
import { supabase } from "@/integrations/supabase/client";
import { NADI4UWorkflowService } from "./nadi4u-workflow-service";

export interface ProgramNotificationService {
  sendProgramCreationNotification: (programmeData: any, categoryId: number) => Promise<boolean>;
  sendProgramApprovalNotification: (programmeData: any) => Promise<boolean>;
}

export const ProgramNotificationService: ProgramNotificationService = {
  async sendProgramCreationNotification(programmeData: any, categoryId: number): Promise<boolean> {
    try {
      // Determine category name based on categoryId
      let categoryName = "Others";
      
      if (categoryId === 1) {
        categoryName = "Smart Services NADI4U";
      } else if (categoryId === 2) {
        categoryName = "Smart Services NADI2U";
      }

      // Only send notifications for NADI4U, NADI2U, and Others categories
      if (categoryId === 1 || categoryId === 2 || categoryName === "Others") {
        return await NADI4UWorkflowService.sendProgramCreationNotification(
          programmeData,
          categoryName
        );
      }

      return true;
    } catch (error) {
      console.error('Error in program notification service:', error);
      return false;
    }
  },

  async sendProgramApprovalNotification(programmeData: any): Promise<boolean> {
    try {
      return await NADI4UWorkflowService.sendBackdatedApprovalNotification(programmeData);
    } catch (error) {
      console.error('Error sending program approval notification:', error);
      return false;
    }
  }
};
