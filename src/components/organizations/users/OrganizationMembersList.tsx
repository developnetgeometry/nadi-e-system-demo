
import { EnhancedOrgUser } from "@/types/organization";
import { OrganizationMember } from "./OrganizationMember";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface OrganizationMembersListProps {
  orgUsers: EnhancedOrgUser[];
  isLoading: boolean;
  onRemoveUser: (userId: string) => void;
}

export const OrganizationMembersList = ({ orgUsers, isLoading, onRemoveUser }: OrganizationMembersListProps) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (orgUsers.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No members in this organization yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {orgUsers.map((orgUser) => (
        <OrganizationMember 
          key={orgUser.id} 
          orgUser={orgUser} 
          onRemove={onRemoveUser} 
        />
      ))}
    </div>
  );
};
