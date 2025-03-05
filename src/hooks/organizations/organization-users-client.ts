
import { supabase } from "@/lib/supabase";
import { OrganizationUser, OrganizationUserFormData } from "@/types/organization";
import { UserType } from "@/types/auth";

/**
 * Organization users-related Supabase client functions
 */
export const organizationUsersClient = {
  /**
   * Fetch users for a specific organization
   */
  fetchOrganizationUsers: async (organizationId: string): Promise<OrganizationUser[]> => {
    const { data, error } = await supabase
      .from("organization_users")
      .select(`
        *,
        profiles:user_id (
          id, 
          full_name, 
          email, 
          user_type,
          avatar_url
        )
      `)
      .eq("organization_id", organizationId);

    if (error) throw error;
    return data as unknown as OrganizationUser[];
  },

  /**
   * Add a user to an organization
   */
  addUserToOrganization: async (formData: OrganizationUserFormData): Promise<OrganizationUser> => {
    const { data, error } = await supabase
      .from("organization_users")
      .insert([formData])
      .select()
      .single();

    if (error) throw error;
    return data as OrganizationUser;
  },

  /**
   * Remove a user from an organization
   */
  removeUserFromOrganization: async (organizationId: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from("organization_users")
      .delete()
      .eq("organization_id", organizationId)
      .eq("user_id", userId);

    if (error) throw error;
  },

  /**
   * Check if user has specific role in organization
   */
  checkUserHasRoleInOrganization: async (
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
  },

  /**
   * Get eligible users by user type for adding to organization
   */
  fetchEligibleUsersByType: async (userTypes: UserType[]): Promise<any[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("user_type", userTypes);

    if (error) throw error;
    return data;
  }
};
