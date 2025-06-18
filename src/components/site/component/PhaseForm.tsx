import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import {
  useCreatePhase,
  useUpdatePhase,
  useGetPhaseById,
  CreatePhaseData,
  Phase,
  useGetDuspOrganizations,
} from "@/hooks/phase/use-phase";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateInput } from "@/components/ui/date-input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SelectOne } from "@/components/ui/SelectOne";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PhaseForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();  
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userType = parsedMetadata?.user_type || "";
  const organizationId = userType.startsWith('dusp') ? parsedMetadata?.organization_id : "";
  

  // Fetch phase for edit
  const { data: phase, isLoading: isLoadingPhase } = useGetPhaseById(Number(id));
  // Fetch DUSP organizations for dropdown
  const { data: organizations, isLoading: isLoadingOrganizations } = useGetDuspOrganizations();
  const createPhase = useCreatePhase();
  const updatePhase = useUpdatePhase();

  const form = useForm<CreatePhaseData>({
    defaultValues: {
      name: "",
      is_active: true,
      remark: "",
      organization_id: organizationId,
    },
  });  // Set form values if editing
  useEffect(() => {
    if (isEdit && phase) {
      console.log("Phase data for edit:", phase); // Debug log
      form.reset({
        name: phase.name || "",
        is_active: phase.is_active ?? true,
        remark: phase.remark || "",
        organization_id: organizationId || (phase.organization_id ? phase.organization_id.id : ""),
      });
    }
  }, [isEdit, phase, form, organizationId]);  const onSubmit = async (values: CreatePhaseData) => {
    try {
      // Check if organization_id is required but missing
      if (!organizationId && !values.organization_id) {
        toast({ 
          title: "Error", 
          description: "Organization is required", 
          variant: "destructive" 
        });
        return;
      }

      // Use organizationId from user metadata if available
      const dataToSubmit = {
        ...values,
        organization_id: organizationId || values.organization_id
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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow">
      <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Phase" : "Create Phase"}</h2>      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!organizationId && (
            <FormField
              name="organization_id"
              control={form.control}
              rules={{ required: "Organization is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization *</FormLabel>                  <FormControl>
                    <div className="relative">
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(value)}
                        disabled={isLoadingOrganizations}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations?.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <button 
                          type="button"
                          className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                          onClick={() => field.onChange("")}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500">
                            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Show selected organization name when there's organizationId */}
          {organizationId && isEdit && phase?.organization_id && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Organization</p>
              <p className="text-sm p-2 border rounded-md bg-gray-50">
                {phase.organization_id.name}
              </p>
            </div>
          )}

          <FormField
            name="name"
            control={form.control}
            rules={{ required: "Phase name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phase Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter phase name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="remark"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Remarks (optional)" />
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
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <span>{field.value ? "Active" : "Inactive"}</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate("/site-management/phase")}>Cancel</Button>
            <Button type="submit" disabled={createPhase.isPending || updatePhase.isPending}>
              {isEdit ? (updatePhase.isPending ? "Saving..." : "Save Changes") : (createPhase.isPending ? "Creating..." : "Create Phase")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PhaseForm;