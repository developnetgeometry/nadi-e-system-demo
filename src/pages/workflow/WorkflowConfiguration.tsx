import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WorkflowConfig } from "@/components/workflow/WorkflowConfig";
import { useWorkflowConfig } from "@/hooks/workflow-config";
import {
  WorkflowConfigStep,
  WorkflowConfig as WorkflowConfigType,
} from "@/types/workflow";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const WorkflowConfiguration = () => {
  const {
    config,
    setConfig,
    steps,
    setSteps,
    isLoading,
    isSaving,
    modules,
    saveWorkflowConfig,
    isNew,
  } = useWorkflowConfig();

  const navigate = useNavigate();

  const handleSave = (
    updatedConfig: WorkflowConfigType,
    updatedSteps: WorkflowConfigStep[]
  ) => {
    saveWorkflowConfig(updatedConfig, updatedSteps);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/workflow")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">
              {isNew
                ? "New Workflow Configuration"
                : "Edit Workflow Configuration"}
            </h1>
          </div>
        </div>

        {config && (
          <WorkflowConfig
            initialConfig={config}
            initialSteps={steps}
            modules={modules}
            isSaving={isSaving}
            onSave={handleSave}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkflowConfiguration;
