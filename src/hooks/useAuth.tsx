
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

  // Track the current session ID
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Start session tracking
  const startSessionTracking = async (userId: string) => {
    try {
      // Get user agent and IP information
      const userAgent = navigator.userAgent;
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      // Create a new session record
      const { data, error } = await supabase
        .from('usage_sessions')
        .insert({
          user_id: userId,
          session_type: 'web_session',
          ip_address: ipData.ip,
          user_agent: userAgent,
          device_info: {
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`
          }
        })
        .select('id')
        .single();

      if (error) throw error;
      
      if (data?.id) {
        setCurrentSessionId(data.id);
        
        // Log the login event
        await supabase.rpc('log_audit_event', {
          p_action: 'login',
          p_entity_type: 'session',
          p_entity_id: data.id,
          p_ip_address: ipData.ip
        });
      }
    } catch (error) {
      console.error("Error starting session tracking:", error);
    }
  };

  // End session tracking
  const endSessionTracking = async () => {
    if (!currentSessionId || !user) return;
    
    try {
      // Update the session record with end time
      await supabase
        .from('usage_sessions')
        .update({
          end_time: new Date().toISOString()
        })
        .eq('id', currentSessionId);
      
      // Log the logout event
      await supabase.rpc('log_audit_event', {
        p_action: 'logout',
        p_entity_type: 'session',
        p_entity_id: currentSessionId
      });
      
      setCurrentSessionId(null);
    } catch (error) {
      console.error("Error ending session tracking:", error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        startSessionTracking(currentUser.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Handle session start/end based on auth state
      if (currentUser && !user) {
        startSessionTracking(currentUser.id);
      } else if (!currentUser && user) {
        await endSessionTracking();
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      // End session when component unmounts
      if (currentSessionId) {
        endSessionTracking();
      }
    };
  }, []);

  // Set up inactivity tracking
  useEffect(() => {
    if (!user || !enableInactivityTracking) return;

    let inactivityTimer: NodeJS.Timeout;
    
    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      inactivityTimer = setTimeout(() => {
        console.log("User inactive, logging out...");
        
        // Log inactivity timeout event
        if (currentSessionId) {
          supabase.rpc('log_audit_event', {
            p_action: 'inactivity_timeout',
            p_entity_type: 'session',
            p_entity_id: currentSessionId
          }).then(() => {
            logout();
          }).catch(error => {
            console.error("Error logging inactivity:", error);
            logout();
          });
        } else {
          logout();
        }
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
  }, [user, enableInactivityTracking, sessionInactivityTimeout, currentSessionId]);

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
          
          // Log session refresh event
          if (currentSessionId) {
            await supabase.rpc('log_audit_event', {
              p_action: 'session_refreshed',
              p_entity_type: 'session',
              p_entity_id: currentSessionId
            });
          }
          
          await supabase.auth.refreshSession();
        }
      }
    };

    // Check session status periodically
    const sessionCheckTimer = setInterval(checkAndRefreshSession, 60000); // Every minute
    
    return () => {
      clearInterval(sessionCheckTimer);
    };
  }, [user, sessionTimeout, currentSessionId]);

  const logout = async () => {
    try {
      console.log("Logging out user...");
      
      // End session tracking before logout
      await endSessionTracking();
      
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
