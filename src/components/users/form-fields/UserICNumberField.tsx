
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
  required?: boolean;
}

export function UserICNumberField({ form, isLoading, required }: UserICNumberFieldProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9-]/g, '');
    
    // Format the IC number automatically
    if (value.length > 6 && value.charAt(6) !== '-') {
      value = value.slice(0, 6) + '-' + value.slice(6);
    }
    if (value.length > 9 && value.charAt(9) !== '-') {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }
    
    // Limit to correct format
    if (value.length > 14) {
      value = value.slice(0, 14);
    }
    
    form.setValue('ic_number', value);
  };

  return (
    <FormField
      control={form.control}
      name="ic_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{required ? "IC Number *" : "IC Number"}</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              onChange={handleInputChange}
              disabled={isLoading} 
              placeholder="xxxxxx-xx-xxxx"
              className="font-mono"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
