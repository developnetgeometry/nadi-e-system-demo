
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import { Permission, UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/use-user-access";
import { useMenuPathVisibility } from "@/hooks/use-menu-visibility";
import { AuthLoading } from "./AuthLoading";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  allowedUserTypes?: UserType[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredPermission,
  allowedUserTypes 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { userType, isSuperAdmin, accessChecked } = useUserAccess();
  const { data: permissions = [], isLoading: permissionsLoading, error } = usePermissions();
  
  // Extract path parts for route checking
  const pathParts = location.pathname.split('/').filter(Boolean);
  const mainPath = pathParts.length > 0 ? pathParts[0] : null;
  const subPath = pathParts.length > 1 ? pathParts[1] : null;
  
  // Use our new hook to check menu visibility
  const { hasAccess, loading: menuAccessLoading } = useMenuPathVisibility(
    mainPath || '', 
    subPath, 
    userType
  );

  // Log any errors with permissions
  useEffect(() => {
    if (error) {
      console.error('Error loading permissions:', error);
      toast({
        title: "Error",
        description: "Failed to load permissions. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Show loading component while checking authentication or menu access
  if (permissionsLoading || !accessChecked || menuAccessLoading) {
    return <AuthLoading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if user doesn't have access to this route based on menu visibility
  if (!hasAccess) {
    console.log('Access denied based on menu visibility');
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user has required permissions or is of an allowed user type
  const hasPermissionAccess = isSuperAdmin || 
    (requiredPermission ? permissions.some((permission: Permission) => permission.name === requiredPermission) : true);

  const hasUserTypeAccess = isSuperAdmin || 
    (allowedUserTypes ? allowedUserTypes.includes(userType as UserType) : true);

  if (!hasPermissionAccess || !hasUserTypeAccess) {
    console.log('Access denied based on permissions or user type');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
