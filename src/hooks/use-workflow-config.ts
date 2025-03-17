
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { WorkflowConfig, WorkflowConfigStep, ApprovalCondition } from "@/types/workflow";
import { useParams, useNavigate } from "react-router-dom";

export function useWorkflowConfig() {
  const [config, setConfig] = useState<WorkflowConfig | null>(null);
  const [steps, setSteps] = useState<WorkflowConfigStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modules, setModules] = useState<{ id: string, name: string }[]>([]);
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  // Fetch available modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        // In a real application, you would fetch from a modules table
        // For now, we'll use mock data
        setModules([
          { id: "work_orders", name: "Work Orders" },
          { id: "training", name: "Training" },
          { id: "center_management", name: "Center Management" },
          { id: "finance", name: "Finance" },
          { id: "inventory", name: "Inventory" },
        ]);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, []);

  // Fetch workflow configuration and steps
  useEffect(() => {
    if (isNew) {
      // Initialize with default values for a new configuration
      setConfig({
        id: "",
        title: "",
        description: "",
        moduleId: "",
        moduleName: "",
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startStepId: "",
        steps: [],
        slaHours: 48,
      });
      setSteps([]);
      return;
    }

    const fetchWorkflowConfig = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // Fetch workflow configuration
        const { data: configData, error: configError } = await supabase
          .from("workflow_configurations")
          .select("*")
          .eq("id", id)
          .single();

        if (configError) {
          throw configError;
        }

        // Fetch workflow steps
        const { data: stepsData, error: stepsError } = await supabase
          .from("workflow_config_steps")
          .select("*")
          .eq("workflow_config_id", id)
          .order("order_index", { ascending: true });

        if (stepsError) {
          throw stepsError;
        }

        // Map database fields (snake_case) to our model fields (camelCase)
        const mappedConfig: WorkflowConfig = {
          id: configData.id,
          title: configData.title,
          description: configData.description || "",
          moduleId: configData.module_id || "",
          moduleName: configData.module_name || "",
          isActive: configData.is_active || false,
          createdAt: configData.created_at || new Date().toISOString(),
          updatedAt: configData.updated_at || new Date().toISOString(),
          startStepId: configData.start_step_id || "",
          steps: [],
          slaHours: configData.sla_hours || 48,
        };

        // Map database fields (snake_case) to our model fields (camelCase)
        const mappedSteps: WorkflowConfigStep[] = stepsData.map((step: any) => ({
          id: step.id,
          name: step.name,
          description: step.description || "",
          order: step.order_index,
          approverUserTypes: step.approver_user_types || [],
          conditions: step.conditions || [],
          nextStepId: step.next_step_id,
          isStartStep: step.is_start_step || false,
          isEndStep: step.is_end_step || false,
          slaHours: step.sla_hours || 24,
        }));

        setConfig(mappedConfig);
        setSteps(mappedSteps);

      } catch (error) {
        console.error("Error fetching workflow configuration:", error);
        toast({
          title: "Error",
          description: "Failed to load workflow configuration",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflowConfig();
  }, [id, isNew, toast]);

  // Save workflow configuration and steps
  const saveWorkflowConfig = async (updatedConfig: WorkflowConfig, updatedSteps: WorkflowConfigStep[]) => {
    setIsSaving(true);
    
    try {
      let configId = updatedConfig.id;
      
      // If it's a new config, create it first
      if (isNew) {
        const newConfig = {
          title: updatedConfig.title,
          description: updatedConfig.description,
          module_id: updatedConfig.moduleId,
          module_name: updatedConfig.moduleName,
          is_active: updatedConfig.isActive,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          start_step_id: updatedConfig.startStepId,
          sla_hours: updatedConfig.slaHours,
        };
        
        const { data: insertedConfig, error: configError } = await supabase
          .from("workflow_configurations")
          .insert(newConfig)
          .select()
          .single();
        
        if (configError) {
          throw configError;
        }
        
        configId = insertedConfig.id;
      } else {
        // Update existing config
        const { error: configError } = await supabase
          .from("workflow_configurations")
          .update({
            title: updatedConfig.title,
            description: updatedConfig.description,
            module_id: updatedConfig.moduleId,
            module_name: updatedConfig.moduleName,
            is_active: updatedConfig.isActive,
            updated_at: new Date().toISOString(),
            start_step_id: updatedConfig.startStepId,
            sla_hours: updatedConfig.slaHours,
          })
          .eq("id", configId);
        
        if (configError) {
          throw configError;
        }
        
        // Delete existing steps to replace with new ones
        const { error: deleteError } = await supabase
          .from("workflow_config_steps")
          .delete()
          .eq("workflow_config_id", configId);
        
        if (deleteError) {
          throw deleteError;
        }
      }
      
      // Insert updated steps
      if (updatedSteps.length > 0) {
        const stepsToInsert = updatedSteps.map((step, index) => ({
          name: step.name,
          description: step.description,
          workflow_config_id: configId,
          order_index: index,
          approver_user_types: step.approverUserTypes,
          conditions: step.conditions,
          next_step_id: step.nextStepId,
          is_start_step: step.isStartStep,
          is_end_step: step.isEndStep,
          sla_hours: step.slaHours,
        }));
        
        const { error: stepsError } = await supabase
          .from("workflow_config_steps")
          .insert(stepsToInsert);
        
        if (stepsError) {
          throw stepsError;
        }
      }
      
      toast({
        title: "Success",
        description: "Workflow configuration saved successfully",
      });
      
      // Redirect back to the list view
      navigate("/workflow");
      
    } catch (error) {
      console.error("Error saving workflow configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save workflow configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
