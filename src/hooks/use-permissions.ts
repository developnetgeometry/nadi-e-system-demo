
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Permission {
  id: string;
  name: string;
  description: string | null;
  module: string;
  action: string;
}

export const usePermissions = () => {
  return useQuery({
    queryKey: ['user-permissions'],
    queryFn: async () => {
      console.log('Fetching user permissions...');
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      if (!userRoles.length) {
        console.log('No roles found for user');
        return [];
      }

      const roleIds = userRoles.map(ur => ur.role_id);
      
      const { data: permissions, error: permissionsError } = await supabase
        .from('role_permissions')
        .select(`
          permissions:permission_id (
            id,
            name,
            description,
            module,
            action
          )
        `)
        .in('role_id', roleIds);

      if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        throw permissionsError;
      }

      console.log('Fetched permissions:', permissions);

      // Transform the data to match the Permission interface
      const transformedPermissions = permissions
        .map(p => p.permissions)
        .filter((p): p is Permission => {
          if (!p || typeof p !== 'object') return false;
          return 'id' in p && 'name' in p && 'module' in p && 'action' in p;
        });

      return transformedPermissions;
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
      }
    }
  });
};
