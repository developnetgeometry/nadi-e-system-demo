import { useUserMetadata } from "@/hooks/use-user-metadata";
import NoAccess from "@/pages/NoAccess";
import RegistrationPage from "./Registration";
import McmcMemberList from "@/components/member/roles/mcmc/McmcMemberList";
import DuspMemberList from "@/components/member/roles/dusp/DuspMemberList";
import TpMemberList from "@/components/member/roles/tp/TpMemberList";
import SiteMemberList from "@/components/member/roles/site/SiteMemberList";
import BulkUpload from "@/components/member/BulkUpload";

const BulkUploadPages = () => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userGroup = parsedMetadata?.user_group;
  const userType = parsedMetadata?.user_type;
  // UserGroup: 1 = DUSP
  // UserGroup: 2 = MCMC
  // UserGroup: 3 = TP
  // UserGroup: 4 = SSO
  // UserGroup: 5 = Vendor
  // UserGroup: 6 = Staff
  // UserGroup: 7 = Member
  // UserGroup: 9 = Site
  // UserType: "super_admin" = Super Admin

  if (userType === "super_admin") {
    return (
      <NoAccess />
    );
  }

  if (!userGroup) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>);
  }

    if (userGroup === 2) {
    return (
      <NoAccess />
    );
  }

  if (userGroup === 1) {
    return (
      <NoAccess />
    );
  }

  if (userGroup === 3) {
    return (
      <NoAccess />
    );
  }

  if (userGroup === 9) {
    return (
      <BulkUpload />
    );
  }

  return (
    <NoAccess />
  );
};

export default BulkUploadPages;