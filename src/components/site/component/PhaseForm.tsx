import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCreatePhase,
  useUpdatePhase,
  useGetPhaseById,
  CreatePhaseData,
} from "@/hooks/phase/use-phase";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PhaseForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch phase for edit
  const { data: phase, isLoading: isLoadingPhase } = useGetPhaseById(Number(id));
  const createPhase = useCreatePhase();
  const updatePhase = useUpdatePhase();

  const form = useForm<CreatePhaseData>({
    defaultValues: {
      name: "",
      is_active: true,
      remark: "",
      organization_id: null,
    },
  });

  // Set form values if editing
  useEffect(() => {
    if (isEdit && phase) {
      form.reset({
        name: phase.name || "",
        is_active: phase.is_active ?? true,
        remark: phase.remark || "",
        organization_id: null,
      });
    }
  }, [isEdit, phase, form]);

  const onSubmit = async (values: CreatePhaseData) => {
    try {
      const dataToSubmit = {
        ...values,
        organization_id: null
      };

      if (isEdit && id) {
        await updatePhase.mutateAsync({ id: Number(id), data: dataToSubmit });
        toast({ title: "Phase updated successfully!", variant: "success" });
      } else {
        await createPhase.mutateAsync(dataToSubmit);
        toast({ title: "Phase created successfully!", variant: "success" });
      }
      navigate("/site-management/phase");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (isLoadingPhase && isEdit) {
    return <div className="text-center py-8">Loading phase data...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Phase" : "Create Phase"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit ? "Update phase information" : "Create a new phase"}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  name="name"
                  control={form.control}
                  rules={{ required: "Phase name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Phase Name *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter phase name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="is_active"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Status
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span className="text-sm text-gray-600">
                            {field.value ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  name="remark"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Remarks (optional)"
                          className="min-h-[300px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/site-management/phase")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPhase.isPending || updatePhase.isPending}
              >
                {isEdit
                  ? (updatePhase.isPending ? "Saving..." : "Save Changes")
                  : (createPhase.isPending ? "Creating..." : "Create Phase")
                }
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PhaseForm;