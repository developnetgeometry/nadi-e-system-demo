import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTPProfile = () => {
  const fetchTPProfile = async () => {
    // Fetch the user ID
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error(userError?.message || "No user found.");
    }

    const userId = userData.user.id;

    // Fetch the tp profile data
    const { data: profile, error: profileError } = await supabase
      .from("nd_tech_partner_profile")
      .select(`
      *, position_id (id, name),
      marital_status (id, bm, eng),
      tech_partner_id (id, code, name),
      nationality_id (id, bm, eng),
      religion_id (id, bm, eng),
      race_id (id, bm, eng)
    `)
      .eq("user_id", userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    return profile;
  };

  // Use React Query's useQuery to fetch the data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tpProfile"],
    queryFn: fetchTPProfile,
  });

  return { data, isLoading, isError, error };
};