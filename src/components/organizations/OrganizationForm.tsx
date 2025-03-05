
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Organization, OrganizationType } from "@/types/organization";
import { useOrganizations } from "@/hooks/use-organizations";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const organizationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["dusp", "tp"] as const),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  parent_id: z.string().optional(),
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

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || "",
      type: organization?.type || "dusp",
      description: organization?.description || "",
      logo_url: organization?.logo_url || "",
      parent_id: organization?.parent_id || "",
    },
  });

  // Filter parent organizations based on selected type
  useEffect(() => {
    const type = form.watch("type");
    
    if (type === "tp") {
      // If TP is selected, parent can only be DUSP
      setFilteredParentOrgs(organizations.filter(org => org.type === "dusp"));
    } else {
      // If DUSP is selected, parent can only be null (top level)
      setFilteredParentOrgs([]);
    }
  }, [form.watch("type"), organizations]);

  const handleSubmit = (values: OrganizationFormValues) => {
    onSubmit(values);
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

        {form.watch("type") === "tp" && (
          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Organization (DUSP)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
        )}

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
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter logo URL" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {organization ? "Update" : "Create"} Organization
          </Button>
        </div>
      </form>
    </Form>
  );
}
