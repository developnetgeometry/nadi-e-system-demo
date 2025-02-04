import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { data: permissions, isLoading, error } = usePermissions();

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  if (error) {
    console.error('Error loading permissions:', error);
    toast({
      title: "Error",
      description: "Failed to load permissions. Please try again.",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasPermission = requiredPermission 
    ? permissions?.some(p => p.name === requiredPermission)
    : true;

  if (!hasPermission) {
    console.log('Access denied: Missing required permission:', requiredPermission);
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};