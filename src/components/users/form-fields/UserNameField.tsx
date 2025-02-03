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
}

export function UserNameField({ form, isLoading }: UserNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="full_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input {...field} disabled={isLoading} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}