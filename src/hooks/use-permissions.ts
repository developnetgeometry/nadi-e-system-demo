
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Permission } from "@/types/auth";

interface PermissionData {
  id: string;
  name: string;
  description: string | null;
  module: string;
  action: string;
  created_at?: string;
}

interface RolePermissionResponse {
  permissions: PermissionData;
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
        return [] as Permission[];
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

      // Transform the data to match the Permission interface
      const transformedPermissions = permissions.map((p: RolePermissionResponse) => ({
        id: p.permissions.id,
        name: p.permissions.name,
        description: p.permissions.description,
        module: p.permissions.module,
        action: p.permissions.action,
        created_at: p.permissions.created_at
      }));

      return transformedPermissions;
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
      }
    }
  });
};
