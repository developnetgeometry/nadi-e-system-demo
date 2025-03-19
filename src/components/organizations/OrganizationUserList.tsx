
import { EnhancedOrgUser } from "@/types/organization";
import { useOrganizationUserManagement } from "./users/hooks/useOrganizationUserManagement";
import { OrganizationMembersCard } from "./users/OrganizationMembersCard";
import { AddMembersCard } from "./users/AddMembersCard";

export const OrganizationUserList = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    filterUserType,
    setFilterUserType,
    eligibleUserTypes,
    orgUsers,
    loadingOrgUsers,
    orgUsersError,
    filteredAvailableUsers,
    loadingEligibleUsers,
    handleAddUser,
    handleRemoveUser,
    organizationType
  } = useOrganizationUserManagement();

  // Cast to EnhancedOrgUser to ensure correct typing
  const enhancedOrgUsers = orgUsers as unknown as EnhancedOrgUser[];

  return (
    <div className="space-y-6">
      <OrganizationMembersCard 
        orgUsers={enhancedOrgUsers}
        isLoading={loadingOrgUsers}
        error={orgUsersError}
        onRemoveUser={handleRemoveUser}
      />

      <AddMembersCard 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterUserType={filterUserType}
        onFilterChange={setFilterUserType}
        eligibleUserTypes={eligibleUserTypes}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        users={filteredAvailableUsers}
        isLoading={loadingEligibleUsers}
        onAddUser={handleAddUser}
        organizationType={organizationType}
      />
    </div>
  );
};
