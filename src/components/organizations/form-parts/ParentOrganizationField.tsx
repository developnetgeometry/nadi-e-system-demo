
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { OrganizationFormValues } from "../schemas/organization-schema";
import { Organization } from "@/types/organization";

interface ParentOrganizationFieldProps {
  form: UseFormReturn<OrganizationFormValues>;
  filteredParentOrgs: Organization[];
}

export function ParentOrganizationField({ 
  form, 
  filteredParentOrgs 
}: ParentOrganizationFieldProps) {
  return (
    <FormField
      control={form.control}
      name="parent_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Parent Organization</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || "null"} // Using "null" as a string value instead of empty string
            disabled={filteredParentOrgs.length === 0}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select parent organization" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="null">None</SelectItem> {/* Use "null" instead of empty string */}
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
  );
}
