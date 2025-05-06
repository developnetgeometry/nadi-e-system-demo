
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

interface UserWorkEmailFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
}

export function UserWorkEmailField({ form, isLoading }: UserWorkEmailFieldProps) {
  return (
    <FormField
      control={form.control}
      name="work_email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Work Email</FormLabel>
          <FormControl>
            <Input {...field} disabled={isLoading} type="email" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
