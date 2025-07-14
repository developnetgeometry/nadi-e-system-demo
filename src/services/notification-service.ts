import { supabase } from "@/integrations/supabase/client";

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type?: "info" | "warning" | "success" | "error";
}

class NotificationService {
  /**
   * Send a notification to a specific user
   */
  async sendNotification(data: NotificationData): Promise<boolean> {
    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || "info",
        read: false,
      });

      if (error) {
        console.error("Error sending notification:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }

  /**
   * Send payroll notification to staff when their payslip is ready
   */
  async sendPayrollNotification(
    staffId: string,
    month: number,
    year: number,
    netPay: number
  ): Promise<boolean> {
    try {
      // Get staff user_id from nd_staff_profile
      const { data: staffProfile, error: staffError } = await supabase
        .from("nd_staff_profile")
        .select("user_id, fullname")
        .eq("id", staffId)
        .single();

      if (staffError || !staffProfile?.user_id) {
        console.log(
          "Staff user_id not found or staff not linked to user account"
        );
        return false;
      }

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const notification: NotificationData = {
        userId: staffProfile.user_id,
        title: "New Payslip Available",
        message: `Your payslip for ${
          monthNames[month - 1]
        } ${year} is now available. Net pay: RM ${netPay.toFixed(
          2
        )}. You can now download your payslip from the HR section.`,
        type: "info",
      };

      return await this.sendNotification(notification);
    } catch (error) {
      console.error("Error sending payroll notification:", error);
      return false;
    }
  }

  /**
   * Send bulk payroll notifications for multiple staff
   */
  async sendBulkPayrollNotifications(
    payrollRecords: Array<{
      staffId: string;
      month: number;
      year: number;
      netPay: number;
    }>
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const record of payrollRecords) {
      const result = await this.sendPayrollNotification(
        record.staffId,
        record.month,
        record.year,
        record.netPay
      );

      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(userId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching notifications:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      return !error;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      return !error;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) {
        console.error("Error getting unread count:", error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  /**
   * Delete old notifications (older than specified days)
   */
  async cleanupOldNotifications(days: number = 30): Promise<boolean> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { error } = await supabase
        .from("notifications")
        .delete()
        .lt("created_at", cutoffDate.toISOString());

      return !error;
    } catch (error) {
      console.error("Error cleaning up old notifications:", error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
