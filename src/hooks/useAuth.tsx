
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      console.log("Logging out user...");
      
      // Get the user type before logging out
      let redirectPath = "/login"; // Default redirect path
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
          
        // If user is a member, redirect to member login
        if (profileData && profileData.user_type === 'member') {
          redirectPath = "/member-login";
        }
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all session data
      localStorage.clear();
      setUser(null);
      
      console.log(`User logged out successfully, redirecting to ${redirectPath}`);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });

      // Redirect based on user type
      navigate(redirectPath);
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    logout,
  };
};
