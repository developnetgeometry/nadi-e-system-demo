
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { WorkflowConfig as WorkflowConfigType } from "@/types/workflow";

interface WorkflowConfigFormProps {
  initialConfig: WorkflowConfigType;
  isSaving: boolean;
  onSubmit: (data: WorkflowConfigType) => void;
}

export function WorkflowConfigForm({ 
  initialConfig,
  isSaving,
  onSubmit 
}: WorkflowConfigFormProps) {
  const form = useForm<WorkflowConfigType>({
    defaultValues: initialConfig
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workflow Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter workflow title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="slaHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall SLA (Hours)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="Enter SLA in hours"
                    min="1"
                  />
                </FormControl>
                <FormDescription>
                  Maximum time to complete the entire workflow
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe the purpose of this workflow" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Enable or disable this workflow
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Workflow Configuration'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
