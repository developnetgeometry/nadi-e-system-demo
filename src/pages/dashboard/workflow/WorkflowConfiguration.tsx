
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowConfig } from "@/components/workflow/WorkflowConfig";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const WorkflowConfiguration = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Workflow Configuration</h1>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Configuration
          </Button>
        </div>
        
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Configurations</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            <WorkflowConfig />
          </TabsContent>
          
          <TabsContent value="draft">
            <p className="text-muted-foreground">Your draft configurations will appear here.</p>
          </TabsContent>
          
          <TabsContent value="templates">
            <p className="text-muted-foreground">Predefined workflow templates will appear here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WorkflowConfiguration;
