import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowList } from "@/components/workflow/WorkflowList";
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
import { WorkflowAnalytics } from "@/components/workflow/WorkflowAnalytics";
import { WorkflowHeader } from "@/components/workflow/WorkflowHeader";
import { useWorkflows } from "@/hooks/use-workflows";

const WorkflowDashboard = () => {
  const [activeTab, setActiveTab] = useState("workflows");
  const {
    workflows,
    isLoading,
    selectedWorkflow,
    setSelectedWorkflow,
    handleDeleteWorkflow,
    handleDuplicateWorkflow,
    handleCreateWorkflow,
  } = useWorkflows();

  return (
    <div className="space-y-1 py-6 space-y-8 max-w-7xl">
      <WorkflowHeader
        onCreateWorkflow={handleCreateWorkflow}
        activeTab={activeTab}
      />

      <Tabs
        defaultValue="workflows"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="workflows" className="text-sm">
            My Workflows
          </TabsTrigger>
          <TabsTrigger value="builder" className="text-sm">
            Workflow Builder
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <WorkflowList
            workflows={workflows}
            isLoading={isLoading}
            onSelect={setSelectedWorkflow}
            onDelete={handleDeleteWorkflow}
            onDuplicate={handleDuplicateWorkflow}
          />
        </TabsContent>

        <TabsContent value="builder" className="min-h-[600px]">
          <WorkflowBuilder
            workflow={selectedWorkflow}
            onSave={(updated) => console.log("Save workflow:", updated)}
          />
        </TabsContent>

        <TabsContent value="analytics" className="min-h-[600px]">
          <WorkflowAnalytics workflows={workflows} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowDashboard;
