import { useState } from "react";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting login for email:", email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Authentication error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user data returned after successful auth");
      }

      console.log("Auth successful, checking profile...");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, nd_user_group(group_name)')
        .eq('id', authData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // Ignore "not found" error
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      // Special handling for tp_admin to ensure they have organization info
      let organizationName = null;
      let organizationId = profile?.organization_id || null;
      
      // If user is tp_admin or has an organization_id, fetch organization details
      if ((profile?.user_type === 'tp_admin' || profile?.organization_id) && profile) {
        // If tp_admin without organization_id, try to find their organization
        if (profile.user_type === 'tp_admin' && !profile.organization_id) {
          console.log("Fetching organization for tp_admin user");
          
          // Try to find organization where this user is an admin
          const { data: orgAdminData, error: orgAdminError } = await supabase
            .from('organization_users')
            .select('organization_id')
            .eq('user_id', authData.user.id)
            .eq('role', 'admin')
            .maybeSingle();
            
          if (!orgAdminError && orgAdminData?.organization_id) {
            organizationId = orgAdminData.organization_id;
            
            // Update profile with organization_id if found
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ organization_id: organizationId })
              .eq('id', authData.user.id);
              
            if (updateError) {
              console.error("Error updating profile with organization_id:", updateError);
            }
          }
        }
        
        // Fetch organization name if we have an organization_id
        if (organizationId) {
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', organizationId)
            .single();
            
          if (!orgError && orgData) {
            organizationName = orgData.name;
          } else if (orgError) {
            console.error("Error fetching organization:", orgError);
          }
        }
      }

      // If no profile exists, create one
      if (!profile) {
        console.log("No profile found, creating one...");
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              user_type: 'member'
            }
          ]);

        if (createProfileError) {
          console.error("Error creating profile:", createProfileError);
          throw createProfileError;
        }
      }

      // Extract user group name from the join result
      const userGroupName = profile?.nd_user_group?.group_name || null;

      // Create user metadata with all the requested fields
      const userMetadata = {
        user_type: profile?.user_type || 'member',
        organization_id: organizationId,
        organization_name: organizationName,
        user_group: profile?.user_group || null,
        user_group_name: userGroupName
      };

      console.log("User metadata:", userMetadata);

      // Store user metadata directly in localStorage
      localStorage.setItem('user_metadata', JSON.stringify(userMetadata));

      // Also keep the encrypted session for backward compatibility
      const encryptedSession = CryptoJS.AES.encrypt(JSON.stringify({
        user: {
          ...authData.user,
          user_metadata: userMetadata
        },
        profile: profile || {
          id: authData.user.id,
          email: authData.user.email,
          user_type: 'member'
        }
      }), 'secret-key').toString();
      localStorage.setItem('session', encryptedSession);

      console.log('Login successful with metadata:', userMetadata);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email before logging in.";
      } else if (error.message.includes("User not found")) {
        errorMessage = "No account found with this email. Please sign up.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin
  };
};
