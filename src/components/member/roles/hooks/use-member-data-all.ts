import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFetchMembersAll = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nd_member_profile")
        .select(
          `
          id,
          ref_id (id, fullname),
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
        .not("user_id", "is", null) // Ensure user_id is not null
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching members data:", error);
        throw error;
      }

      return data;
    },
  });
};