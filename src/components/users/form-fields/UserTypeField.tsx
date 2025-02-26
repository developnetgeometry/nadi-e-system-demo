
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
import { UserType } from "@/types/auth";

interface UserTypeFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
}

const userTypes: { value: UserType; label: string }[] = [
  { value: "member", label: "Member" },
  { value: "vendor", label: "Vendor" },
  { value: "tp", label: "TP" },
  { value: "sso", label: "SSO" },
  { value: "dusp", label: "DUSP" },
  { value: "super_admin", label: "Super Admin" },
  { value: "medical_office", label: "Medical Office" },
  { value: "staff_internal", label: "Staff Internal" },
  { value: "staff_external", label: "Staff External" }
];

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
              {userTypes.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
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
