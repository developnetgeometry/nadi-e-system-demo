import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { supabase } from "@/lib/supabase";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import StaffProfileSettings from "@/components/profile/staff/StaffProfileSettings";
import { StaffJobSettings } from "@/components/profile/staff/StaffJobSettings";
import MemberProfileSettings from "@/components/profile/member/MemberProfileSettings";
import DummyProfileSettings from "@/components/profile/member/DummyProfileSettings";
import TPProfileSettings from "@/components/profile/tp/TPProfileSettings";
import SSOProfileSettings from "@/components/profile/sso/SSOProfileSettings";
import DUSPProfileSettings from "@/components/profile/dusp/DUSPProfileSettings";
import MCMCProfileSettings from "@/components/profile/mcmc/MCMCProfileSettings";

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
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
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return <SettingsLoading />;
  }

  console.log(userType);

  if (userType === "member") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
        <DummyProfileSettings />
          <StaffProfileSettings />
          <StaffJobSettings />
          <MemberProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType === "super_admin") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          {/* <StaffProfileSettings />
          <StaffJobSettings />
          <MemberProfileSettings /> */}
          {/* <TPProfileSettings/> */}
          {/* <SSOProfileSettings/> */}
          {/* <DUSPProfileSettings/> */}
          <MCMCProfileSettings/>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ProfileHeader />
      <div className="space-y-8">
        <p>User type not recognized.</p>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;