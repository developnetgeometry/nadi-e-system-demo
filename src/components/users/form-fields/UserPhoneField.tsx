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

interface UserPhoneFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
}

export function UserPhoneField({ form, isLoading }: UserPhoneFieldProps) {
  return (
    <FormField
      control={form.control}
      name="phone_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input {...field} disabled={isLoading} type="tel" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}