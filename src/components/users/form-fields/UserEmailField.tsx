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
}

export function UserEmailField({ form, isLoading, isEditMode }: UserEmailFieldProps) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
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