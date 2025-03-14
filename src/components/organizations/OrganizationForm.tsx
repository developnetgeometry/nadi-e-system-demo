
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Organization, OrganizationType } from "@/types/organization";
import { useOrganizations } from "@/hooks/use-organizations";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload, Loader2 } from "lucide-react";

const organizationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["dusp", "tp"] as const),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  parent_id: z.string().optional().nullable().transform(val => val === "" ? null : val),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(organization?.logo_url || "");
  const { isUploading, uploadFile } = useFileUpload();

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

  // Handle logo file selection
  const handleLogoChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setLogoFile(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Remove the selected logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl("");
    form.setValue("logo_url", "");
  };

  const handleSubmit = async (values: OrganizationFormValues) => {
    try {
      // If a new logo was selected, upload it
      if (logoFile) {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        const folder = userId || "anonymous";
        const logoUrl = await uploadFile(logoFile, "organization_logos", folder);
        
        if (logoUrl) {
          values.logo_url = logoUrl;
        }
      }
      
      onSubmit(values);
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!!organization} // Disable if editing
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dusp">DUSP</SelectItem>
                  <SelectItem value="tp">Technology Partner (TP)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Organization</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled={filteredParentOrgs.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent organization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {filteredParentOrgs.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Organization description"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <div className="space-y-4">
                {previewUrl ? (
                  <div className="relative w-40 h-40 border rounded-md overflow-hidden bg-muted/30 flex items-center justify-center group">
                    <img 
                      src={previewUrl}
                      alt="Logo preview"
                      className="object-contain w-full h-full p-2"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-2 right-2 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <FileUpload
                    acceptedFileTypes="image/png,image/jpeg,image/webp,image/svg+xml"
                    maxFiles={1}
                    maxSizeInMB={2}
                    onFilesSelected={handleLogoChange}
                    buttonText={
                      isUploading ? (
                        <span className="flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </span>
                      )
                    }
                  />
                )}
                <input 
                  type="hidden" 
                  {...field}
                  value={field.value || ""} 
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>{organization ? "Update" : "Create"} Organization</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
