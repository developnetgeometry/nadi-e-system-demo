
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  users_count: number;
}

export const useRoles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: roles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      console.log('Fetching roles data...');
      
      try {
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('id, name, description, created_at');
        
        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          throw rolesError;
        }

        if (!rolesData) {
          throw new Error('No roles data returned');
        }

        console.log('Roles data fetched:', rolesData);

        // Get user counts based on user_type from profiles table
        const rolesWithCounts = await Promise.all(
          rolesData.map(async (role) => {
            // For 'super_admin' role, count profiles with user_type 'super_admin'
            // For 'admin' role, count profiles with user_type 'sso', 'dusp', etc.
            // For 'user' role, count profiles with user_type 'member'
            
            let userType;
            if (role.name === 'super_admin') {
              userType = 'super_admin';
            } else if (role.name === 'admin') {
              // Count multiple admin-like types
              const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .in('user_type', ['sso', 'dusp', 'tp', 'staff_internal', 'staff_external', 'medical_office']);
              
              return {
                ...role,
                users_count: count || 0
              };
            } else if (role.name === 'user') {
              userType = 'member';
            } else {
              // For other roles, use the role name as the user_type
              userType = role.name.toLowerCase();
            }
            
            // If we didn't return early (for admin role), get count for specific type
            const { count } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .eq('user_type', userType);

            return {
              ...role,
              users_count: count || 0
            };
          })
        );

        console.log('Roles with counts:', rolesWithCounts);
        return rolesWithCounts;
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch roles data. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const createRole = async (values: { name: string; description: string }) => {
    try {
      const { error } = await supabase
        .from('roles')
        .insert([values]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['roles'] });
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "Failed to create role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateRole = async (roleId: string, values: { description: string }) => {
    try {
      const { error } = await supabase
        .from('roles')
        .update({ description: values.description })
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['roles'] });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    roles,
    isLoading,
    error,
    createRole,
    updateRole
  };
};
