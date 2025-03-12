import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { supabase } from "@/lib/supabase";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import StaffProfileSettings from "@/components/profile/staff/StaffProfileSettings";
import { StaffJobSettings } from "@/components/profile/staff/StaffJobSettings";
import MemberProfileSettings from "@/components/profile/member/MemberProfileSettings";
import TPProfileSettings from "@/components/profile/tp/TPProfileSettings";
import SSOProfileSettings from "@/components/profile/sso/SSOProfileSettings";
import DUSPProfileSettings from "@/components/profile/dusp/DUSPProfileSettings";
import MCMCProfileSettings from "@/components/profile/mcmc/MCMCProfileSettings";
import VendorProfileSettings from "@/components/profile/vendor/VendorProfileSettings";

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


  if (userType === "super_admin") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">

          {/* <StaffProfileSettings />
          <StaffJobSettings />
          <MemberProfileSettings />
          <TPProfileSettings />
          <SSOProfileSettings />
          <DUSPProfileSettings />
          <MCMCProfileSettings />
          <VendorProfileSettings /> */}
        </div>
      </DashboardLayout>
    );
  }

  if (userType === "mcmc_admin" || userType === "mcmc_operation" || userType === "mcmc_management") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <MCMCProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType === "dusp_operation" || userType === "dusp_management") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <DUSPProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType === "sso_admin" || userType === "sso_operation" || userType === "sso_management" || userType === "sso_pillar" || userType === "sso") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <SSOProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType === "tp_management" || userType === "tp_region" || userType === "tp_hr" || userType === "tp_finance" || userType === "tp_admin" || userType === "tp_operation") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <TPProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType === "staff_manager" || userType === "staff_assistant_manager") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <StaffProfileSettings />
          <StaffJobSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType === "vendor" || userType === "vendor_admin" || userType === "vendor_staff") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <VendorProfileSettings />
        </div>
      </DashboardLayout>
    );
  }  

  if (userType === "member") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <MemberProfileSettings />
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