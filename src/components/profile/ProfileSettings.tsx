import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useDuspProfileData from "@/components/profile/hook/use-dusp-profile-data";
import useMcmcProfileData from "@/components/profile/hook/use-mcmc-profile-data";
import useSsoProfileData from "@/components/profile/hook/use-sso-profile-data";
import useTpProfileData from "@/components/profile/hook/use-tp-profile-data";
import useVendorProfileData from "@/components/profile/hook/use-vendor-profile-data";
import usePositionData from "@/hooks/use-position-data";
import useGeneralData from "@/hooks/use-general-data";
import PersonalInformation from "./PersonalInformation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";


const ProfileSettings = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user type first
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setUserType(profile?.user_type || null);
      } catch (error) {
        console.error("Error fetching user type:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, []);

  // Conditionally use hooks based on userType
  const duspProfile = useDuspProfileData();
  const mcmcProfile = useMcmcProfileData();
  const ssoProfile = useSsoProfileData();
  const tpProfile = useTpProfileData();
  const vendorProfile = useVendorProfileData();
  const { positions, error: positionError } = usePositionData();
  const { maritalStatuses, races, religions, nationalities, error: generalDataError } = useGeneralData();

  // Determine which profile data to use
  const activeProfile = userType?.startsWith("dusp") ? duspProfile 
    : userType?.startsWith("mcmc") ? mcmcProfile 
    : userType?.startsWith("sso") ? ssoProfile 
    : userType?.startsWith("tp") ? tpProfile
    : userType?.startsWith("vendor") ? vendorProfile
    : null;

  if (loading) return <Skeleton>Loading Data...</Skeleton>;
  if (error || positionError || generalDataError) return <div>Error: {error || positionError || generalDataError}</div>;
  if (!activeProfile) return <div>No profile type detected</div>;
  if (activeProfile.loading) return <div>Loading profile data...</div>;
  if (activeProfile.error) return <div>Error: {activeProfile.error}</div>;

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <PersonalInformation
          profileData={activeProfile.profileData}
          handleChange={activeProfile.handleChange}
          userType={userType}
          positions={positions}
          maritalStatuses={maritalStatuses}
          races={races}
          religions={religions}
          nationalities={nationalities}
        />
        <div className="flex justify-end mt-6">
          <Button onClick={activeProfile.handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;