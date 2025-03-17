
import { WorkflowConfig, WorkflowConfigStep } from "@/types/workflow";

export interface UseWorkflowConfigReturn {
  config: WorkflowConfig | null;
  setConfig: React.Dispatch<React.SetStateAction<WorkflowConfig | null>>;
  steps: WorkflowConfigStep[];
  setSteps: React.Dispatch<React.SetStateAction<WorkflowConfigStep[]>>;
  isLoading: boolean;
  isSaving: boolean;
  modules: { id: string, name: string }[];
  saveWorkflowConfig: (updatedConfig: WorkflowConfig, updatedSteps: WorkflowConfigStep[]) => Promise<void>;
  isNew: boolean;
}
