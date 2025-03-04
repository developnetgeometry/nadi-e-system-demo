
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useAppSettings } from "@/hooks/use-app-settings";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useAppSettings();

  // Get session configuration from settings
  const sessionTimeout = settings.find(s => s.key === 'session_timeout')?.value || '3600'; // Default 1 hour in seconds
  const sessionInactivityTimeout = settings.find(s => s.key === 'session_inactivity_timeout')?.value || '1800'; // Default 30 minutes
  const enableInactivityTracking = settings.find(s => s.key === 'enable_inactivity_tracking')?.value === 'true';

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

  // Set up inactivity tracking
  useEffect(() => {
    if (!user || !enableInactivityTracking) return;

    let inactivityTimer: NodeJS.Timeout;
    
    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      inactivityTimer = setTimeout(() => {
        console.log("User inactive, logging out...");
        logout();
      }, parseInt(sessionInactivityTimeout) * 1000);
    };

    // Set initial timer
    resetInactivityTimer();

    // Reset timer on user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // Cleanup
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [user, enableInactivityTracking, sessionInactivityTimeout]);

  // Set up session timeout
  useEffect(() => {
    if (!user) return;

    // Get session expiry from Supabase (falls back to configuration if not available)
    const checkAndRefreshSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      
      // If session is close to expiring (within 5 minutes), refresh it
      const expiresAt = data.session.expires_at;
      if (expiresAt) {
        const expiryTime = new Date(expiresAt * 1000);
        const now = new Date();
        const timeUntilExpiry = expiryTime.getTime() - now.getTime();
        
        // If less than 5 minutes until expiry, refresh the session
        if (timeUntilExpiry < 300000) {
          console.log("Session close to expiry, refreshing...");
          await supabase.auth.refreshSession();
        }
      }
    };

    // Check session status periodically
    const sessionCheckTimer = setInterval(checkAndRefreshSession, 60000); // Every minute
    
    return () => {
      clearInterval(sessionCheckTimer);
    };
  }, [user, sessionTimeout]);

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
