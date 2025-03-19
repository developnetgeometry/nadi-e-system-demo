
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserGroupFormData } from "../types";
import { toast } from "sonner";

export const useUserGroupMutations = () => {
  const queryClient = useQueryClient();

  const createUserGroup = useMutation({
    mutationFn: async (values: UserGroupFormData) => {
      const currentUser = (await supabase.auth.getUser()).data.user?.id;
      
      // First get the maximum ID to generate the next one
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("nd_user_group")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      if (maxIdError) throw maxIdError;
      
      // Generate new ID (max + 1) or start with 1 if no records exist
      const newId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;
      
      // Get current timestamp for created_at
      const now = new Date().toISOString();
      
      // Insert with the new ID and created_at
      const { data, error } = await supabase.from("nd_user_group").insert([
        {
          id: newId,
          group_name: values.group_name,
          description: values.description,
          created_by: currentUser,
          created_at: now,
          updated_at: now
        },
      ]);

      if (error) throw error;
      return data;
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

  const updateUserGroup = useMutation({
    mutationFn: async ({ values, id }: { values: UserGroupFormData; id: number }) => {
      // For updates, we'll use the existing bigint ID
      const { data, error } = await supabase
        .from("nd_user_group")
        .update({
          group_name: values.group_name,
          description: values.description,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", id);

      if (error) throw error;
      return data;
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

  return {
    createUserGroup,
    updateUserGroup,
  };
};
