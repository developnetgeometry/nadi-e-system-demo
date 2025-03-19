
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

interface UserICNumberFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
}

export function UserICNumberField({ form, isLoading }: UserICNumberFieldProps) {
  return (
    <FormField
      control={form.control}
      name="ic_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>IC Number</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              disabled={isLoading} 
              placeholder="xxxxxx-xx-xxxx"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
