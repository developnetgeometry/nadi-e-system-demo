
import { usePermissions } from "./use-permissions";
import { Permission } from "@/types/auth";

export const useHasPermission = (requiredPermission: string) => {
  const { data: permissions = [], isLoading, error } = usePermissions();

  if (isLoading || error || !permissions) {
    return false;
  }

  return permissions.some((permission: Permission) => permission.name === requiredPermission);
};
