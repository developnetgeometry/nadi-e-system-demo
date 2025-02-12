
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Permission } from "@/types/auth";

interface RolePermissionJoin {
  permissions: Permission;
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
            action,
            created_at
          )
        `)
        .in('role_id', roleIds);

      if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        throw permissionsError;
      }

      console.log('Fetched permissions:', permissions);

      return permissions.map((p: RolePermissionJoin) => p.permissions);
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
      }
    }
  });
};
