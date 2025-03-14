import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Organization } from "@/types/organization";
import { useOrganizations } from "@/hooks/use-organizations";
import { Form } from "@/components/ui/form";
import { useOrganizationLogo } from "./hooks/use-organization-logo";
import { organizationSchema, OrganizationFormValues } from "./schemas/organization-schema";
import { BasicInfoFields } from "./form-parts/BasicInfoFields";
import { OrganizationTypeField } from "./form-parts/OrganizationTypeField";
import { ParentOrganizationField } from "./form-parts/ParentOrganizationField";
import { LogoUploadField } from "./form-parts/LogoUploadField";
import { FormActions } from "./form-parts/FormActions";
import { supabase } from "@/lib/supabase";

interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: (values: OrganizationFormValues) => void;
  onCancel: () => void;
}

export function OrganizationForm({
  organization,
  onSubmit,
  onCancel,
}: OrganizationFormProps) {
  const { useOrganizationsQuery } = useOrganizations();
  const { data: organizations = [] } = useOrganizationsQuery();
  const [filteredParentOrgs, setFilteredParentOrgs] = useState<Organization[]>([]);
  
  const {
    logoFile,
    previewUrl,
    isUploading,
    handleLogoChange,
    handleRemoveLogo,
    uploadLogo
  } = useOrganizationLogo(organization?.logo_url);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || "",
      type: organization?.type || "dusp",
      description: organization?.description || "",
      logo_url: organization?.logo_url || "",
      parent_id: organization?.parent_id || null,
    },
  });

  // Filter parent organizations based on selected type
  useEffect(() => {
    const type = form.watch("type");
    
    if (type === "tp") {
      // If TP is selected, parent can only be DUSP
      setFilteredParentOrgs(organizations.filter(org => org.type === "dusp"));
    } else if (type === "dusp") {
      // If DUSP is selected, parent can be another DUSP or null (top level)
      setFilteredParentOrgs(organizations.filter(org => 
        org.type === "dusp" && org.id !== organization?.id
      ));
    } else {
      setFilteredParentOrgs([]);
    }
  }, [form.watch("type"), organizations, organization?.id]);

  const handleFormSubmit = async (values: OrganizationFormValues) => {
    try {
      // If there is an existing logo that isn't being changed, keep it
      if (!logoFile && previewUrl && organization?.logo_url) {
        values.logo_url = organization.logo_url;
      }
      // If a new logo was selected, upload it
      else if (logoFile) {
        const logoUrl = await uploadLogo();
        
        if (logoUrl) {
          values.logo_url = logoUrl;
        }
      }
      // If logo was removed, clear the URL
      else if (!previewUrl) {
        values.logo_url = "";
      }
      
      onSubmit(values);
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        
        <OrganizationTypeField 
          form={form}
          organization={organization}
        />
        
        <ParentOrganizationField 
          form={form}
          filteredParentOrgs={filteredParentOrgs}
        />
        
        <LogoUploadField 
          form={form}
          previewUrl={previewUrl}
          isUploading={isUploading}
          onLogoChange={handleLogoChange}
          onRemoveLogo={handleRemoveLogo}
        />
        
        <FormActions 
          isUploading={isUploading}
          isEditing={!!organization}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
}
