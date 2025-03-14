
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { OrganizationFormValues } from "../schemas/organization-schema";
import { Organization } from "@/types/organization";

interface OrganizationTypeFieldProps {
  form: UseFormReturn<OrganizationFormValues>;
  organization?: Organization;
}

export function OrganizationTypeField({ form, organization }: OrganizationTypeFieldProps) {
  return (
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
  );
}
