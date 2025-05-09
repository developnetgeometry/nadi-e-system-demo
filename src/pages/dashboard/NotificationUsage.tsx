import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Bell, BookOpen, Lightbulb, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationUsageGuide } from "@/components/notifications/admin/NotificationUsageGuide";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NotificationUsage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl py-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Notification Usage Guide</h1>
        </div>

        <div className="grid gap-6">
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <BookOpen className="h-4 w-4" />
            <AlertTitle>Documentation</AlertTitle>
            <AlertDescription>
              This page provides documentation and examples for implementing
              notifications in your application. Learn how to use notification
              templates to send consistent messages across different channels.
            </AlertDescription>
          </Alert>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <span>Getting Started with Notifications</span>
              </CardTitle>
              <CardDescription>
                Understanding the notification system architecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert">
                <h3>Notification System Overview</h3>
                <p>
                  Our notification system supports three primary channels for
                  delivering messages to users:
                </p>
                <ul>
                  <li>
                    <strong>In-App Notifications:</strong> These appear within
                    the application interface and are stored in the database.
                    Users can access these through the notification center.
                  </li>
                  <li>
                    <strong>Email Notifications:</strong> Sent directly to the
                    user's email address for important notifications that
                    require immediate attention or may need to be referenced
                    later.
                  </li>
                  <li>
                    <strong>Push Notifications:</strong> Delivered to the user's
                    device even when they're not actively using your
                    application, ideal for time-sensitive information.
                  </li>
                </ul>
                <h3>Notification Templates</h3>
                <p>
                  Templates allow you to create reusable notification content
                  with placeholders for dynamic data. This approach ensures
                  consistent messaging across different channels and makes it
                  easier to manage notification content.
                </p>
                <p>
                  You can create and manage templates in the{" "}
                  <strong>Templates</strong> tab of the Notification Management
                  page. Templates support placeholders in the format{" "}
                  <code>{"{placeholder_name}"}</code> which will be replaced
                  with actual values when the notification is sent.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Bulk Notifications</span>
              </CardTitle>
              <CardDescription>
                Sending notifications to multiple users efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert">
                <p>
                  Our notification system supports sending messages to multiple
                  recipients efficiently using batch processing. This is
                  particularly useful for:
                </p>
                <ul>
                  <li>
                    <strong>Announcements:</strong> Sending important updates to
                    all users or a specific group.
                  </li>
                  <li>
                    <strong>Group Notifications:</strong> Notifying members of a
                    team, department, or other defined group.
                  </li>
                  <li>
                    <strong>Campaign Messages:</strong> Sending marketing or
                    engagement communications to targeted user segments.
                  </li>
                </ul>
                <p>The bulk notification functions are optimized to:</p>
                <ul>
                  <li>
                    Process notifications in batches to prevent database
                    overloading
                  </li>
                  <li>
                    Track success and failure rates for monitoring purposes
                  </li>
                  <li>Support template usage for consistent messaging</li>
                  <li>
                    Work across all notification channels (in-app, email, and
                    push)
                  </li>
                </ul>
                <p>
                  Explore the examples below to see how to implement bulk
                  notifications in your application.
                </p>
              </div>
            </CardContent>
          </Card>

          <NotificationUsageGuide />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationUsage;
