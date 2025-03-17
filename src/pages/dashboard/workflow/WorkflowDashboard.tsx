
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkflowList } from "@/components/workflow/WorkflowList";
import { WorkflowFormDialog } from "@/components/workflow/WorkflowFormDialog";
import { WorkflowManagementDashboard } from "@/components/workflow/WorkflowManagementDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WorkflowDashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Workflow Management</h1>
        </div>
        
        <Tabs defaultValue="workflows" className="space-y-4">
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflows" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </div>
            <WorkflowList />
          </TabsContent>
          
          <TabsContent value="approvals">
            <WorkflowManagementDashboard />
          </TabsContent>
        </Tabs>
        
        <WorkflowFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default WorkflowDashboard;
