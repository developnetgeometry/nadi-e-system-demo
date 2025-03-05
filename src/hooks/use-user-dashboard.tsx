
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { UserType } from "@/types/auth";

export const useUserDashboard = () => {
  const { user } = useAuth();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserType = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to get user_type from profiles
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (profileData && profileData.user_type) {
          setUserType(profileData.user_type as UserType);
        } else {
          // Fallback to roles if profile doesn't contain user_type
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("roles(name)")
            .eq("user_id", user.id)
            .single();

          if (roleError) {
            throw roleError;
          }

          const role = roleData?.roles?.name;
          if (role) {
            setUserType(role as UserType);
          }
        }
      } catch (err) {
        console.error("Error fetching user type:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch user type"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserType();
  }, [user]);

  return {
    userType,
    isLoading,
    error,
    isAuthenticated: !!user
  };
};
