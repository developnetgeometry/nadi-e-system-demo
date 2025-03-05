
import { ReactNode, useEffect, useState } from "react";
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
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [accessChecked, setAccessChecked] = useState(false);
  const { data: permissions = [], isLoading, error } = usePermissions();

  // Check if user is super_admin
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsSuperAdmin(false);
          setAccessChecked(true);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        setIsSuperAdmin(profile?.user_type === 'super_admin');
        setAccessChecked(true);
      } catch (err) {
        console.error("Error checking super admin status:", err);
        setIsSuperAdmin(false);
        setAccessChecked(true);
      }
    };

    checkSuperAdmin();
  }, []);

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

    if (accessChecked) {
      checkAccess();
    }
  }, [isLoading, permissions, requiredPermission, toast, isSuperAdmin, accessChecked]);

  // Show loading while checking authentication
  if (isLoading || !accessChecked) {
    return <div>Loading permissions...</div>;
  }

  // Redirect to login if not authenticated
  if (error) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required permissions
  const hasAccess = isSuperAdmin || 
    (requiredPermission ? permissions.some((permission: Permission) => permission.name === requiredPermission) : true);

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
