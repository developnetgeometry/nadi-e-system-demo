
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationClient } from "./organization-client";
import { organizationUsersClient } from "./organization-users-client";
import { useToast } from "@/hooks/use-toast";
import { Organization } from "@/types/organization";

/**
 * Custom hooks for organization mutations
 */
export const useOrganizationMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Mutation hook for creating a new organization
   */
  const useCreateOrganizationMutation = () => useMutation({
    mutationFn: organizationClient.createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating organization:", error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    },
  });

  /**
   * Mutation hook for updating an organization
   */
  const useUpdateOrganizationMutation = () => useMutation({
    mutationFn: organizationClient.updateOrganization,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organizations", data.id] });
      queryClient.invalidateQueries({ queryKey: ["child-organizations"] });
      toast({
        title: "Success",
        description: "Organization updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating organization:", error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    },
  });

  /**
   * Mutation hook for deleting an organization
   */
  const useDeleteOrganizationMutation = () => useMutation({
    mutationFn: organizationClient.deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["child-organizations"] });
      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting organization:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete organization",
        variant: "destructive",
      });
    },
  });

  /**
   * Mutation hook for adding a user to an organization
   */
  const useAddUserToOrganizationMutation = () => useMutation({
    mutationFn: organizationUsersClient.addUserToOrganization,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organization-users", data.organization_id] });
      toast({
        title: "Success",
        description: "User added to organization successfully",
      });
    },
    onError: (error) => {
      console.error("Error adding user to organization:", error);
      toast({
        title: "Error",
        description: "Failed to add user to organization",
        variant: "destructive",
      });
    },
  });

  /**
   * Mutation hook for removing a user from an organization
   */
  const useRemoveUserFromOrganizationMutation = () => useMutation({
    mutationFn: ({ organizationId, userId }: { organizationId: string; userId: string }) => 
      organizationUsersClient.removeUserFromOrganization(organizationId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organization-users", variables.organizationId] });
      toast({
        title: "Success",
        description: "User removed from organization successfully",
      });
    },
    onError: (error) => {
      console.error("Error removing user from organization:", error);
      toast({
        title: "Error",
        description: "Failed to remove user from organization",
        variant: "destructive",
      });
    },
  });

  return {
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
    useAddUserToOrganizationMutation,
    useRemoveUserFromOrganizationMutation,
  };
};
