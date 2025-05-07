
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLeaveApplications } from "./AdminLeaveApplications";
import { AdminLeaveSettings } from "./AdminLeaveSettings";

export function AdminLeaveManagement() {
  const [activeTab, setActiveTab] = useState("applications");

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
        <p className="text-muted-foreground">
          Manage leave applications and leave settings
        </p>
      </div>

      <Tabs defaultValue="applications" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="applications">Leave Applications</TabsTrigger>
          <TabsTrigger value="settings">Leave Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="mt-6">
          <AdminLeaveApplications />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <AdminLeaveSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
