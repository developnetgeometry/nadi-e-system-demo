import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useVendorProfile = () => {
  const fetchVendorProfile = async () => {
    // Fetch the user ID
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error(userError?.message || "No user found.");
    }

    const userId = userData.user.id;

    // Fetch the vendor profile data
    const { data: profile, error: profileError } = await supabase
      .from("nd_vendor_staff")
      .select(`
      *, position_id (id, name)
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
    queryKey: ["vendorProfile"],
    queryFn: fetchVendorProfile,
  });

  return { data, isLoading, isError, error };
};