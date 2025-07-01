import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFetchMembersSite = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      // Step 1: Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user data:", userError);
        throw userError || new Error("User not found");
      }
      const userId = userData.user.id;

      // Step 2: Get the site_profile_id from nd_site_user table
      const { data: siteUserData, error: siteUserError } = await supabase
        .from("nd_site_user")
        .select("site_profile_id")
        .eq("user_id", userId)
        .single(); // Expect only one site profile for the user

      if (siteUserError || !siteUserData?.site_profile_id) {
        console.error("Error fetching site profile data:", siteUserError);
        throw siteUserError || new Error("Site profile not found");
      }
      const siteProfileId = siteUserData.site_profile_id;

      // Step 3: Fetch members from nd_member_profile where id matches siteProfileId
      const { data: membersData, error: membersError } = await supabase
        .from("nd_member_profile")
        .select(
          `
          id,
          ref_id (id, fullname, dusp_tp_id),
          identity_no,
          community_status,
          fullname,
          email,
          status_membership (id, name),
          status_entrepreneur,
          membership_id,
          identity_no,
          user_id
        `
        )
        .eq("ref_id", siteProfileId) // Filter by site profile ID
        .not("user_id", "is", null) // Ensure user_id is not null
        .order("id", { ascending: false });

      if (membersError) {
        console.error("Error fetching members data:", membersError);
        throw membersError;
      }

      return membersData;
    },
  });
};