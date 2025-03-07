
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UserTypeFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
}

export function UserTypeField({ form, isLoading }: UserTypeFieldProps) {
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('name, description')
        .order('name');
      
      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
      
      return data;
    }
  });

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
            disabled={isLoading || rolesLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {roles.map(({ name, description }) => (
                <SelectItem 
                  key={name} 
                  value={name}
                  title={description || undefined}
                >
                  {name.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
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
