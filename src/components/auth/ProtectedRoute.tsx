
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
  const [hasRouteAccess, setHasRouteAccess] = useState<boolean | null>(null);
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

  // Check route-level access based on menu visibility settings
  useEffect(() => {
    const checkRouteAccess = async () => {
      if (!userType || userType === 'super_admin' || !accessChecked) {
        // Super admins always have access, and we need userType before checking
        setHasRouteAccess(true);
        return;
      }

      try {
        // Extract the first part of the path (e.g., /dashboard/users -> dashboard)
        const pathParts = location.pathname.split('/').filter(Boolean);
        if (pathParts.length === 0) {
          setHasRouteAccess(true);
          return;
        }

        const mainPath = pathParts[0];
        const subPath = pathParts.length > 1 ? pathParts[1] : null;

        console.log(`Checking route access for ${userType} to path: ${mainPath}/${subPath}`);

        // Check main menu access
        const { data: menuData } = await supabase
          .from('menu_visibility')
          .select('*')
          .eq('menu_key', mainPath)
          .maybeSingle();

        // If there's no menu visibility record, allow access by default
        if (!menuData) {
          console.log(`No menu visibility record for ${mainPath}, allowing access`);
          setHasRouteAccess(true);
          return;
        }

        // Check if user type is allowed to access this menu
        if (!menuData.visible_to.includes(userType)) {
          console.log(`User ${userType} denied access to ${mainPath} menu`);
          setHasRouteAccess(false);
          return;
        }

        // Check submodule access if applicable
        if (subPath) {
          const { data: submoduleData } = await supabase
            .from('submodule_visibility')
            .select('*')
            .eq('parent_module', mainPath)
            .eq('submodule_key', subPath)
            .maybeSingle();

          // If there's a submodule record and user isn't allowed
          if (submoduleData && !submoduleData.visible_to.includes(userType)) {
            console.log(`User ${userType} denied access to ${mainPath}/${subPath} submodule`);
            setHasRouteAccess(false);
            return;
          }
        }

        // If we got here, user has access
        setHasRouteAccess(true);
      } catch (err) {
        console.error("Error checking route access:", err);
        // Default to allowing access if there's an error checking
        setHasRouteAccess(true);
      }
    };

    if (accessChecked) {
      checkRouteAccess();
    }
  }, [location.pathname, userType, accessChecked]);

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

  // Show loading while checking authentication
  if (isLoading || !accessChecked || hasRouteAccess === null) {
    return <div>Loading permissions...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if user doesn't have access to this route based on menu visibility
  if (!hasRouteAccess) {
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
