
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { UserGroup, UserGroupFormData } from "../types";

export const useUserGroupMutations = () => {
  const queryClient = useQueryClient();

  // Create user group mutation
  const createUserGroup = useMutation({
    mutationFn: async (formData: UserGroupFormData) => {
      // First, create the user group
      const { data, error } = await supabase
        .from("nd_user_group")
        .insert({
          group_name: formData.group_name,
          description: formData.description,
          user_types: formData.user_types, // Store user types as JSON array
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data[0] as UserGroup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      toast.success("User group created successfully");
    },
    onError: (error) => {
      console.error("Error creating user group:", error);
      toast.error("Failed to create user group");
    },
  });

  // Update user group mutation
  const updateUserGroup = useMutation({
    mutationFn: async ({
      values,
      id,
    }: {
      values: UserGroupFormData;
      id: number;
    }) => {
      const { data, error } = await supabase
        .from("nd_user_group")
        .update({
          group_name: values.group_name,
          description: values.description,
          user_types: values.user_types, // Store user types as JSON array
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data[0] as UserGroup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      toast.success("User group updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user group:", error);
      toast.error("Failed to update user group");
    },
  });

  return { createUserGroup, updateUserGroup };
};
