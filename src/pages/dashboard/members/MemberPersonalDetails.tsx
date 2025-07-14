import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NoAccess } from "@/components/NoAccess";
import MemberProfileSettings from "@/components/profile/MemberProfileSettings";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const MemberPersonalDetails = () => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userGroup = parsedMetadata?.user_group;

  if (userGroup !== 7) {
    return <NoAccess/>;
  }

  return (
    <div>
      <MemberProfileSettings />
    </div>
  );
};

export default MemberPersonalDetails;
