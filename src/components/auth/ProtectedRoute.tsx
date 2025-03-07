
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Permission, UserType } from "@/types/auth";

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
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [accessChecked, setAccessChecked] = useState(false);
  const { data: permissions = [], isLoading, error } = usePermissions();

  // Check if user is authenticated and get user type
  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setUserType(null);
          setIsSuperAdmin(false);
          setAccessChecked(true);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (profile?.user_type) {
          setUserType(profile.user_type);
          setIsSuperAdmin(profile.user_type === 'super_admin');
        } else {
          // Fallback to roles if profile doesn't contain user_type
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('roles(name)')
            .eq('user_id', user.id)
            .single();

          if (!roleError && roleData?.roles) {
            // Check if roles is an array or an object
            let roleName: string | null = null;
            
            if (Array.isArray(roleData.roles)) {
              if (roleData.roles.length > 0 && roleData.roles[0].name) {
                roleName = roleData.roles[0].name;
              }
            } else if (typeof roleData.roles === 'object') {
              roleName = (roleData.roles as { name: string }).name;
            }
            
            if (roleName) {
              setUserType(roleName as UserType);
              setIsSuperAdmin(roleName === 'super_admin');
            }
          }
        }

        setAccessChecked(true);
      } catch (err) {
        console.error("Error checking user access:", err);
        setUserType(null);
        setIsSuperAdmin(false);
        setAccessChecked(true);
      }
    };

    checkUserAccess();
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
      if (!isLoading && requiredPermission && !isSuperAdmin) {
        const hasPermission = permissions.some(
          (permission: Permission) => permission.name === requiredPermission
        );
        
        if (!hasPermission) {
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
  if (error || !userType) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required permissions or is of an allowed user type
  const hasPermissionAccess = isSuperAdmin || 
    (requiredPermission ? permissions.some((permission: Permission) => permission.name === requiredPermission) : true);

  const hasUserTypeAccess = isSuperAdmin || 
    (allowedUserTypes ? allowedUserTypes.includes(userType) : true);

  if (!hasPermissionAccess || !hasUserTypeAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
