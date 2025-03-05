
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Organization, OrganizationFormData, OrganizationUser, OrganizationUserFormData } from "@/types/organization";
import { useToast } from "@/hooks/use-toast";

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

  const fetchOrganizationUsers = async (organizationId: string): Promise<OrganizationUser[]> => {
    const { data, error } = await supabase
      .from("organization_users")
      .select("*, profiles:user_id(id, full_name, email, user_type)")
      .eq("organization_id", organizationId);

    if (error) throw error;
    return data as OrganizationUser[];
  };

  const createOrganization = async (formData: OrganizationFormData): Promise<Organization> => {
    const { data, error } = await supabase
      .from("organizations")
      .insert([formData])
      .select()
      .single();

    if (error) throw error;
    return data as Organization;
  };

  const updateOrganization = async ({ id, ...formData }: Organization): Promise<Organization> => {
    const { data, error } = await supabase
      .from("organizations")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Organization;
  };

  const deleteOrganization = async (id: string): Promise<void> => {
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

  const useOrganizationUsersQuery = (organizationId: string) => useQuery({
    queryKey: ["organization-users", organizationId],
    queryFn: () => fetchOrganizationUsers(organizationId),
    enabled: !!organizationId,
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
      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting organization:", error);
      toast({
        title: "Error",
        description: "Failed to delete organization",
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
    useOrganizationUsersQuery,
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
    useAddUserToOrganizationMutation,
    useRemoveUserFromOrganizationMutation,
  };
};
