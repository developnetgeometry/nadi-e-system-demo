
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import StaffProfileSettings from "@/components/profile/staff/StaffProfileSettings";
import { StaffJobSettings } from "@/components/profile/staff/StaffJobSettings";
import MemberProfileSettings from "@/components/profile/member/MemberProfileSettings";
import SuperAdminProfileSettings from "@/components/profile/super_admin/SuperAdminProfileSettings";
import McmcProfileSettings from "@/components/profile/McmcProfileSettings";
import DuspProfileSettings from "@/components/profile/DuspProfileSettings";
import SsoProfileSettings from "@/components/profile/SsoProfileSettings";
import TpProfileSettings from "@/components/profile/TpProfileSettings";
import VendorProfileSettings from "@/components/profile/VendorProfileSettings";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const UserProfile = () => {
  const { userMetadata, isLoading } = useUserMetadata();
  
  if (isLoading) {
    return <SettingsLoading />;
  }
  
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userType = parsedMetadata?.user_type;

  if (!userType) {
    return <SettingsLoading />;
  }

  if (userType === "super_admin") {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <SuperAdminProfileSettings />
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

  if (userType?.startsWith("staff")) {
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

  if (userType?.startsWith("mcmc")) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <McmcProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType?.startsWith("dusp")) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <DuspProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType?.startsWith("sso")) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <SsoProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType?.startsWith("tp")) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <TpProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userType?.startsWith("vendor")) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <VendorProfileSettings />
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
