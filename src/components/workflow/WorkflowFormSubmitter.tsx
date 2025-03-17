
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useWorkflow } from "@/hooks/use-workflow";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WorkflowFormConfig, FormField as WorkflowFormField, WorkflowStep } from "@/types/workflow";
import { AlertCircle } from "lucide-react";

interface WorkflowFormSubmitterProps {
  formConfig: WorkflowFormConfig;
  workflowId: string;
  initialStep: WorkflowStep;
  onSubmit?: (data: any) => void;
}

export function WorkflowFormSubmitter({
  formConfig,
  workflowId,
  initialStep,
  onSubmit: externalSubmitHandler
}: WorkflowFormSubmitterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startWorkOrderWorkflow } = useWorkflow();
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: formConfig.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {} as Record<string, any>)
  });

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create form data to submit to workflow
      const formSubmission = {
        formId: formConfig.id,
        workflowId,
        data,
        title: data.title || formConfig.name,
        description: data.description || formConfig.description
      };
      
      // Start the workflow process
      const result = await startWorkOrderWorkflow(formSubmission.formId);
      
      if (result) {
        toast({
          title: "Form submitted",
          description: "Your form has been submitted for approval",
        });
        
        if (externalSubmitHandler) {
          externalSubmitHandler(data);
        }
      } else {
        setError("Failed to submit the form. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: WorkflowFormField) => {
    switch (field.type) {
      case "text":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input 
                    {...formField} 
                    placeholder={field.placeholder} 
                    disabled={isSubmitting} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case "textarea":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea 
                    {...formField} 
                    placeholder={field.placeholder} 
                    disabled={isSubmitting} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case "select":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select 
                  onValueChange={formField.onChange} 
                  defaultValue={formField.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case "checkbox":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={formField.value} 
                    onCheckedChange={formField.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
                  {field.placeholder && <FormDescription>{field.placeholder}</FormDescription>}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      // Add more field types as needed
      
      default:
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input 
                    {...formField} 
                    placeholder={field.placeholder} 
                    disabled={isSubmitting} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formConfig.name}</CardTitle>
        {formConfig.description && <CardDescription>{formConfig.description}</CardDescription>}
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {formConfig.fields.map(renderField)}
            
            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={isSubmitting} className="ml-auto">
                {isSubmitting ? <LoadingSpinner /> : null}
                <span className="ml-2">Submit for Approval</span>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
