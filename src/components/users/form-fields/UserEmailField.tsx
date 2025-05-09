
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

interface UserEmailFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
  isEditMode: boolean;
  required?: boolean;
}

export function UserEmailField({ form, isLoading, isEditMode, required }: UserEmailFieldProps) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{required ? "Email *" : "Email"}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="email"
              disabled={isEditMode || isLoading}
              placeholder="user@example.com"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
