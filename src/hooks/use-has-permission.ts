import { usePermissions } from "./use-permissions";

export const useHasPermission = (requiredPermission: string) => {
  const { data: permissions, isLoading, error } = usePermissions();

  if (isLoading || error || !permissions) {
    return false;
  }

  return permissions.some(p => p.name === requiredPermission);
};