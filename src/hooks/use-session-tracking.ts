
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export const useSessionTracking = (user: User | null) => {
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
          session_type: 'login', // Using the correct enum value
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

  // Log inactivity event
  const logInactivityEvent = async () => {
    if (!currentSessionId) return;
    
    try {
      await supabase.rpc('log_audit_event', {
        p_action: 'inactivity_timeout',
        p_entity_type: 'session',
        p_entity_id: currentSessionId
      });
    } catch (error) {
      console.error("Error logging inactivity:", error);
    }
  };

  // Log session refresh event
  const logSessionRefreshEvent = async () => {
    if (!currentSessionId) return;
    
    try {
      await supabase.rpc('log_audit_event', {
        p_action: 'session_refreshed',
        p_entity_type: 'session',
        p_entity_id: currentSessionId
      });
    } catch (error) {
      console.error("Error logging session refresh:", error);
    }
  };

  return {
    currentSessionId,
    startSessionTracking,
    endSessionTracking,
    logInactivityEvent,
    logSessionRefreshEvent
  };
};
