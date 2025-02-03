import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { UserFormData } from "../types";

interface UserTypeFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
}

export function UserTypeField({ form, isLoading }: UserTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="user_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>User Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="tp">TP</SelectItem>
              <SelectItem value="sso">SSO</SelectItem>
              <SelectItem value="dusp">DUSP</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="medical_office">Medical Office</SelectItem>
              <SelectItem value="staff_internal">Staff Internal</SelectItem>
              <SelectItem value="staff_external">Staff External</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}