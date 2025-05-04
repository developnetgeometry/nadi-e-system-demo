import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Bell, Settings, TestTube, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NotificationTemplates } from "@/components/notifications/admin/NotificationTemplates";
import { NotificationTesting } from "@/components/notifications/admin/NotificationTesting";
import { NotificationConfig } from "@/components/notifications/admin/NotificationConfig";

const NotificationManagement = () => {
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Notification Management</h1>
          </div>

          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link to="/admin/notification-usage">
              <BookOpen className="h-4 w-4" />
              <span>Usage Guide</span>
            </Link>
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span>Testing</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <NotificationTemplates />
          </TabsContent>

          <TabsContent value="testing" className="space-y-4">
            <NotificationTesting />
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <NotificationConfig />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NotificationManagement;
