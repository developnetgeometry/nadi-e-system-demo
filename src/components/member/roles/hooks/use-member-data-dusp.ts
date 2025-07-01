import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFetchMembersDusp = () => {
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

      // Step 2: Get the organization ID from organization_users table
      const { data: organizationData, error: organizationError } = await supabase
        .from("organization_users")
        .select("organization_id")
        .eq("user_id", userId)
        .single(); // Expect only one organization for the user

      if (organizationError || !organizationData?.organization_id) {
        console.error("Error fetching organization data:", organizationError);
        throw organizationError || new Error("Organization not found");
      }
      const organizationId = organizationData.organization_id;
      console.log("Organization ID:", organizationId);

      // Step 3: Fetch organization IDs where parent_id matches the organization_id
      const { data: childOrganizations, error: childOrganizationsError } = await supabase
        .from("organizations")
        .select("id")
        .eq("parent_id", organizationId);

      if (childOrganizationsError) {
        console.error("Error fetching child organizations:", childOrganizationsError);
        throw childOrganizationsError;
      }

      const childOrganizationIds = childOrganizations.map((org) => org.id);
      console.log("Child Organization IDs:", childOrganizationIds);

      // Step 4: Fetch members from nd_member_profile where ref_id matches one of the child organization IDs
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
        .in("ref_id.dusp_tp_id", childOrganizationIds) // Filter by child organization IDs
        .not("ref_id", "is", null) // Exclude rows where ref_id.dusp_tp_id is null
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