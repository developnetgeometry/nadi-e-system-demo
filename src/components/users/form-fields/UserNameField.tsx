
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UserFormData } from "../types";

interface UserNameFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
  required?: boolean;
}

export function UserNameField({ form, isLoading, required }: UserNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="full_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{required ? "Full Name *" : "Full Name"}</FormLabel>
          <FormControl>
            <Input {...field} disabled={isLoading} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
