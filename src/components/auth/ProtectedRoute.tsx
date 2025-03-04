
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Permission } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { data: permissions = [], isLoading, error } = usePermissions();

  // Check if user is super_admin
  const checkSuperAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    return profile?.user_type === 'super_admin';
  };

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

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoading && requiredPermission) {
        const isSuperAdmin = await checkSuperAdmin();
        
        if (!isSuperAdmin && !permissions.some((permission: Permission) => permission.name === requiredPermission)) {
          console.log('Access denied: Missing required permission:', requiredPermission);
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
        }
      }
    };

    checkAccess();
  }, [isLoading, permissions, requiredPermission, toast]);

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  if (error) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAccess = async () => {
    const isSuperAdmin = await checkSuperAdmin();
    return isSuperAdmin || (requiredPermission 
      ? permissions.some((permission: Permission) => permission.name === requiredPermission)
      : true);
  };

  if (!hasAccess()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
