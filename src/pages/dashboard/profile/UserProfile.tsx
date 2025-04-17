import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { ProfileHeader } from "@/components/profile/components/ProfileHeader";
import StaffProfileSettings from "@/components/profile/StaffProfileSettings";
import { StaffJobSettings } from "@/components/profile/staff/StaffJobSettings";
import MemberProfileSettings from "@/components/profile/MemberProfileSettings";
import SuperAdminProfileSettings from "@/components/profile/SuperAdminProfileSettings";
import McmcProfileSettings from "@/components/profile/McmcProfileSettings";
import DuspProfileSettings from "@/components/profile/DuspProfileSettings";
import SsoProfileSettings from "@/components/profile/SsoProfileSettings";
import TpProfileSettings from "@/components/profile/TpProfileSettings";
import VendorProfileSettings from "@/components/profile/VendorProfileSettings";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const UserProfile = () => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userGroup = parsedMetadata?.user_group;
  const userType = parsedMetadata?.user_type;

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

  if (!userGroup) {
    return <SettingsLoading />;
  }
  
  if (userGroup === 7) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <MemberProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userGroup === 6) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <StaffProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userGroup === 2) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <McmcProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userGroup === 1) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <DuspProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userGroup === 4) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <SsoProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userGroup === 3) {
    return (
      <DashboardLayout>
        <ProfileHeader />
        <div className="space-y-8">
          <TpProfileSettings />
        </div>
      </DashboardLayout>
    );
  }

  if (userGroup === 5) {
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