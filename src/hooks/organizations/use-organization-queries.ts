
import { useQuery } from "@tanstack/react-query";
import { organizationClient } from "./organization-client";
import { UserType } from "@/types/auth";
import { organizationUsersClient } from "./organization-users-client";

/**
 * Custom hooks for fetching organization data
 */
export const useOrganizationQueries = () => {
  /**
   * Query hook for fetching all organizations
   */
  const useOrganizationsQuery = () => useQuery({
    queryKey: ["organizations"],
    queryFn: organizationClient.fetchOrganizations,
  });

  /**
   * Query hook for fetching a single organization
   */
  const useOrganizationQuery = (id: string) => useQuery({
    queryKey: ["organizations", id],
    queryFn: () => organizationClient.fetchOrganizationById(id),
    enabled: !!id,
  });

  /**
   * Query hook for fetching child organizations
   */
  const useChildOrganizationsQuery = (parentId: string) => useQuery({
    queryKey: ["child-organizations", parentId],
    queryFn: () => organizationClient.fetchChildOrganizations(parentId),
    enabled: !!parentId,
  });

  /**
   * Query hook for fetching organization users
   */
  const useOrganizationUsersQuery = (organizationId: string) => useQuery({
    queryKey: ["organization-users", organizationId],
    queryFn: () => organizationUsersClient.fetchOrganizationUsers(organizationId),
    enabled: !!organizationId,
  });

  /**
   * Query hook for fetching eligible users
   */
  const useEligibleUsersQuery = (userTypes: UserType[]) => useQuery({
    queryKey: ["eligible-users", userTypes],
    queryFn: () => organizationUsersClient.fetchEligibleUsersByType(userTypes),
    enabled: userTypes.length > 0,
  });

  return {
    useOrganizationsQuery,
    useOrganizationQuery,
    useChildOrganizationsQuery,
    useOrganizationUsersQuery,
    useEligibleUsersQuery,
  };
};
