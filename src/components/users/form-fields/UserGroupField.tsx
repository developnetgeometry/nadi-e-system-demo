
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UserGroupFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
}

export function UserGroupField({ form, isLoading }: UserGroupFieldProps) {
  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['user-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nd_user_group')
        .select('id, group_name, description')
        .order('group_name');
      
      if (error) {
        console.error('Error fetching user groups:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  return (
    <FormField
      control={form.control}
      name="user_group"
      render={({ field }) => (
        <FormItem>
          <FormLabel>User Group</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoading || groupsLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select user group" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem 
                  key={group.id} 
                  value={group.id}
                  title={group.description || undefined}
                >
                  {group.group_name}
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
