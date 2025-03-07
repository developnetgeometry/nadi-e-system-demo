
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Permission, UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [accessChecked, setAccessChecked] = useState(false);
  const { data: permissions = [], isLoading, error } = usePermissions();

  // Check if user is authenticated and get user type
  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        if (!user) {
          setUserType(null);
          setIsSuperAdmin(false);
          setAccessChecked(true);
          return;
        }

        // First try to get the user profile to check the user_type
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (!profileError && profile?.user_type) {
          const userTypeValue = profile.user_type as UserType;
          setUserType(userTypeValue);
          setIsSuperAdmin(userTypeValue === 'super_admin');
          console.log('User type from profile:', userTypeValue);
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
              const userTypeValue = roleName as UserType;
              setUserType(userTypeValue);
              setIsSuperAdmin(userTypeValue === 'super_admin');
              console.log('User type from roles:', userTypeValue);
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
  }, [user]);

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

  // Check if the current route is accessible based on menu visibility settings
  useEffect(() => {
    const checkRouteAccess = async () => {
      if (!userType || userType === 'super_admin' || !accessChecked) {
        return;
      }

      try {
        // Extract the first part of the path (e.g., /dashboard/users -> dashboard)
        const pathParts = location.pathname.split('/').filter(Boolean);
        if (pathParts.length === 0) return;

        const mainPath = pathParts[0];
        const subPath = pathParts.length > 1 ? pathParts[1] : null;

        console.log(`Checking access for path: ${mainPath}/${subPath}`);

        // Check if the main menu is accessible
        const { data: menuData } = await supabase
          .from('menu_visibility')
          .select('*')
          .eq('menu_key', mainPath)
          .single();

        if (menuData && !menuData.visible_to.includes(userType)) {
          console.log(`User ${userType} does not have access to ${mainPath}`);
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this section.",
            variant: "destructive",
          });
          // Will redirect in the return statement
          return;
        }

        // Check if the submodule is accessible
        if (subPath) {
          const { data: submoduleData } = await supabase
            .from('submodule_visibility')
            .select('*')
            .eq('parent_module', mainPath)
            .eq('submodule_key', subPath)
            .single();

          if (submoduleData && !submoduleData.visible_to.includes(userType)) {
            console.log(`User ${userType} does not have access to ${mainPath}/${subPath}`);
            toast({
              title: "Access Denied",
              description: "You don't have permission to access this submodule.",
              variant: "destructive",
            });
            // Will redirect in the return statement
            return;
          }
        }

      } catch (err) {
        console.error("Error checking route access:", err);
      }
    };

    if (accessChecked) {
      checkRouteAccess();
    }
  }, [location.pathname, userType, accessChecked, toast]);

  // Show loading while checking authentication
  if (isLoading || !accessChecked) {
    return <div>Loading permissions...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
