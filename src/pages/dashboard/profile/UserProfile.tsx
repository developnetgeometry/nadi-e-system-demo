import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileHeader } from "@/components/profile/components/ProfileHeader";
import StaffProfileSettings from "@/components/profile/StaffProfileSettings";
import MemberProfileSettings from "@/components/profile/MemberProfileSettings";
import SuperAdminProfileSettings from "@/components/profile/SuperAdminProfileSettings";
import McmcProfileSettings from "@/components/profile/McmcProfileSettings";
import DuspProfileSettings from "@/components/profile/DuspProfileSettings";
import SsoProfileSettings from "@/components/profile/SsoProfileSettings";
import TpProfileSettings from "@/components/profile/TpProfileSettings";
import VendorProfileSettings from "@/components/profile/VendorProfileSettings";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import NoAccess from "@/pages/NoAccess";
import SiteProfileSettings from "@/components/profile/SiteProfileSettings";

const UserProfile = () => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userGroup = parsedMetadata?.user_group;
  const userType = parsedMetadata?.user_type;

  if (userType === "super_admin") {
    return (
      <div>
        <ProfileHeader />
        <div className="space-y-8">
          <SuperAdminProfileSettings />
        </div>
      </div>
    );
  }

  if (!userGroup) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userGroup === 7) {
    return (
      <div>
        <ProfileHeader />
        <div className="space-y-8">
          <MemberProfileSettings />
        </div>
      </div>
    );
  }

  if (userGroup === 6) {
    return (
      <div>
        <ProfileHeader />
        <div className="space-y-8">
          <StaffProfileSettings />
        </div>
      </div>
    );
  }

  if (userGroup === 2) {
    return (
      <div>
        <ProfileHeader />
        <div className="space-y-8">
          <McmcProfileSettings />
        </div>
      </div>
    );
  }

  if (userGroup === 1) {
    return (
      <div>
        <ProfileHeader />
        <div className="space-y-8">
          <DuspProfileSettings />
        </div>
      </div>
    );
  }

  if (userGroup === 4) {
    return (
      <div>
        <ProfileHeader />
        <div className="space-y-8">
          <SsoProfileSettings />
        </div>
      </div>
    );
  }

  if (userGroup === 3) {
    return (
      <div>
        <ProfileHeader />
        <div className="space-y-8">
          <TpProfileSettings />
        </div>
      </div>
    );
  }

  if (userGroup === 5) {
    return (
      <div>
        <ProfileHeader />
        <div className="space-y-8">
          <VendorProfileSettings />
        </div>
      </div>
    );
  }

  if (userGroup === 9) {
    return (
      <div>
        <ProfileHeader />
        <div className="space-y-8">
          <SiteProfileSettings />
        </div>
      </div>
    );
  }

  return <NoAccess />;
};

export default UserProfile;
