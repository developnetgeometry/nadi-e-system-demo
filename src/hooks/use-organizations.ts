
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Organization, OrganizationFormData, OrganizationUser, OrganizationUserFormData } from "@/types/organization";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/auth";

export const useOrganizations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchOrganizations = async (): Promise<Organization[]> => {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .order("name");

    if (error) throw error;
    return data as Organization[];
  };

  const fetchOrganizationById = async (id: string): Promise<Organization> => {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Organization;
  };

  const fetchChildOrganizations = async (parentId: string): Promise<Organization[]> => {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("parent_id", parentId)
      .order("name");

    if (error) throw error;
    return data as Organization[];
  };

  const fetchOrganizationUsers = async (organizationId: string): Promise<OrganizationUser[]> => {
    const { data, error } = await supabase
      .from("organization_users")
      .select("*, profiles:user_id(id, full_name, email, user_type)")
      .eq("organization_id", organizationId);

    if (error) throw error;
    return data as OrganizationUser[];
  };

  const createOrganization = async (formData: OrganizationFormData): Promise<Organization> => {
    // Clean up the data to ensure parent_id is properly handled
    const cleanData = { ...formData };
    
    // Ensure parent_id is either a valid UUID or null, not an empty string
    if (cleanData.parent_id === "") {
      cleanData.parent_id = null;
    }

    const { data, error } = await supabase
      .from("organizations")
      .insert([cleanData])
      .select()
      .single();

    if (error) throw error;
    return data as Organization;
  };

  const updateOrganization = async ({ id, ...formData }: Organization): Promise<Organization> => {
    // Clean up the data to ensure parent_id is properly handled
    const cleanData = { ...formData };
    
    // Ensure parent_id is either a valid UUID or null, not an empty string
    if (cleanData.parent_id === "") {
      cleanData.parent_id = null;
    }

    const { data, error } = await supabase
      .from("organizations")
      .update(cleanData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Organization;
  };

  const deleteOrganization = async (id: string): Promise<void> => {
    // First check if organization has children
    const { data: children } = await supabase
      .from("organizations")
      .select("id")
      .eq("parent_id", id);
    
    if (children && children.length > 0) {
      throw new Error("Cannot delete organization with sub-organizations. Please delete or reassign sub-organizations first.");
    }

    const { error } = await supabase
      .from("organizations")
      .delete()
      .eq("id", id);

    if (error) throw error;
  };

  const addUserToOrganization = async (formData: OrganizationUserFormData): Promise<OrganizationUser> => {
    const { data, error } = await supabase
      .from("organization_users")
      .insert([formData])
      .select()
      .single();

    if (error) throw error;
    return data as OrganizationUser;
  };

  const removeUserFromOrganization = async (organizationId: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from("organization_users")
      .delete()
      .eq("organization_id", organizationId)
      .eq("user_id", userId);

    if (error) throw error;
  };

  // Check if user has specific role in organization
  const checkUserHasRoleInOrganization = async (
    userId: string,
    organizationId: string,
    roles: string[]
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from("organization_users")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", userId);

    if (error) throw error;
    
    if (!data || data.length === 0) return false;
    return roles.includes(data[0].role);
  };

  // Get eligible users by user type for adding to organization
  const fetchEligibleUsersByType = async (userTypes: UserType[]): Promise<any[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("user_type", userTypes);

    if (error) throw error;
    return data;
  };

  // React Query hooks
  const useOrganizationsQuery = () => useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
  });

  const useOrganizationQuery = (id: string) => useQuery({
    queryKey: ["organizations", id],
    queryFn: () => fetchOrganizationById(id),
    enabled: !!id,
  });

  const useChildOrganizationsQuery = (parentId: string) => useQuery({
    queryKey: ["child-organizations", parentId],
    queryFn: () => fetchChildOrganizations(parentId),
    enabled: !!parentId,
  });

  const useOrganizationUsersQuery = (organizationId: string) => useQuery({
    queryKey: ["organization-users", organizationId],
    queryFn: () => fetchOrganizationUsers(organizationId),
    enabled: !!organizationId,
  });

  const useEligibleUsersQuery = (userTypes: UserType[]) => useQuery({
    queryKey: ["eligible-users", userTypes],
    queryFn: () => fetchEligibleUsersByType(userTypes),
    enabled: userTypes.length > 0,
  });

  const useCreateOrganizationMutation = () => useMutation({
    mutationFn: createOrganization,
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

  const useUpdateOrganizationMutation = () => useMutation({
    mutationFn: updateOrganization,
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

  const useDeleteOrganizationMutation = () => useMutation({
    mutationFn: deleteOrganization,
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

  const useAddUserToOrganizationMutation = () => useMutation({
    mutationFn: addUserToOrganization,
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

  const useRemoveUserFromOrganizationMutation = () => useMutation({
    mutationFn: ({ organizationId, userId }: { organizationId: string; userId: string }) => 
      removeUserFromOrganization(organizationId, userId),
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
    useOrganizationsQuery,
    useOrganizationQuery,
    useChildOrganizationsQuery,
    useOrganizationUsersQuery,
    useEligibleUsersQuery,
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
    useAddUserToOrganizationMutation,
    useRemoveUserFromOrganizationMutation,
    checkUserHasRoleInOrganization,
  };
};
