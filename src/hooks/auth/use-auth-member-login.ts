import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../use-toast";
import { handleAuthError } from "./utils/auth-error-handler";
import { createUserSession } from "./utils/session-handler";
import { fetchUserProfile } from "./utils/profile-handler";
import { fetchOrganizationDetails } from "./utils/organization-handler";

export const useMemberLogin = () => {
  const [icNumber, setIcNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting member login for IC number:", icNumber);

      // First find the user profile using the IC number in profiles table
      const { data: userData, error: userError } = await supabase
        .from("nd_member_profile")
        .select("user_id")
        .or(`identity_no.eq.${icNumber},membership_id.eq.${icNumber}`)
        .single();

      if (userError) {
        console.error("User lookup error:", userError);
        throw new Error("Invalid identification number Or membership ID");
      }

      if (!userData || !userData.user_id) {
        throw new Error(
          "No user found with this identification number or membership ID"
        );
      }

      // Now fetch the profile using the user_id from nd_member_profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          `
        id,
        email,
        full_name,
        user_type
      `
        )
        .eq("id", userData.user_id)
        .eq("user_type", "member")
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw new Error("Invalid identification number");
      }

      if (!profileData || !profileData.email) {
        throw new Error("No user found with this identification number");
      }

      console.log("Found user profile:", profileData.full_name);

      // Now sign in with the retrieved email and provided password
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: profileData.email,
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

      // Fetch user profile with group_profile
      const { profile, profileError: fetchProfileError } =
        await fetchUserProfile(authData.user.id);

      if (fetchProfileError && fetchProfileError.code !== "PGRST116") {
        console.error("Profile fetch error:", fetchProfileError);
        throw fetchProfileError;
      }

      // Fetch organization details (optional logic)
      const { organizationId, organizationName } =
        await fetchOrganizationDetails(authData.user.id, profile);

      // Prepare metadata
      const userMetadata: Record<string, any> = {
        user_type: profile?.user_type || "member",
        organization_id: organizationId,
        organization_name: organizationName,
        group_profile: profile?.group_profile || null,
      };

      if (profile?.user_group) {
        userMetadata.user_group = profile.user_group;
        userMetadata.user_group_name =
          profile.nd_user_group?.group_name || null;
      }

      console.log("User metadata:", userMetadata);

      // Store session
      createUserSession(authData.user, profile, userMetadata);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      // Redirect to admin dashboard since there is no specific member dashboard yet
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = handleAuthError(error);

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
    icNumber,
    setIcNumber,
    password,
    setPassword,
    loading,
    handleLogin,
  };
};
