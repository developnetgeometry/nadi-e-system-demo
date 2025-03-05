
import { useOrganizationQueries } from "./organizations/use-organization-queries";
import { useOrganizationMutations } from "./organizations/use-organization-mutations";
import { organizationUsersClient } from "./organizations/organization-users-client";

/**
 * Main hook for all organization-related functionality
 */
export const useOrganizations = () => {
  // Get all query hooks
  const {
    useOrganizationsQuery,
    useOrganizationQuery,
    useChildOrganizationsQuery,
    useOrganizationUsersQuery,
    useEligibleUsersQuery,
  } = useOrganizationQueries();

  // Get all mutation hooks
  const {
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
    useAddUserToOrganizationMutation,
    useRemoveUserFromOrganizationMutation,
  } = useOrganizationMutations();

  // Export everything together
  return {
    // Query hooks
    useOrganizationsQuery,
    useOrganizationQuery,
    useChildOrganizationsQuery,
    useOrganizationUsersQuery,
    useEligibleUsersQuery,
    
    // Mutation hooks
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
    useAddUserToOrganizationMutation,
    useRemoveUserFromOrganizationMutation,
    
    // Direct methods
    checkUserHasRoleInOrganization: organizationUsersClient.checkUserHasRoleInOrganization,
  };
};
