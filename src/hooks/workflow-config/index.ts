
import { useConfigData } from "./use-config-data";
import { useModules } from "./use-modules";
import { useSaveConfig } from "./use-save-config";
import { UseWorkflowConfigReturn } from "./types";

export function useWorkflowConfig(): UseWorkflowConfigReturn {
  const modules = useModules();
  const { config, setConfig, steps, setSteps, isLoading, isNew } = useConfigData();
  const { isSaving, saveWorkflowConfig } = useSaveConfig(isNew);

  return {
    config,
    setConfig,
    steps,
    setSteps,
    isLoading,
    isSaving,
    modules,
    saveWorkflowConfig,
    isNew
  };
}
