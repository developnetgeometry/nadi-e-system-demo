
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserGroup, UserGroupFormData } from "./types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  group_name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

interface UserGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userGroup: UserGroup | null;
}

export const UserGroupDialog = ({
  open,
  onOpenChange,
  userGroup,
}: UserGroupDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!userGroup;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserGroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_name: userGroup?.group_name || "",
      description: userGroup?.description || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: UserGroupFormData) => {
      const newId = uuidv4();
      const currentUser = (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await supabase.from("nd_user_group").insert([
        {
          id: newId,
          group_name: values.group_name,
          description: values.description,
          created_by: currentUser,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      toast.success("User group created successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating user group:", error);
      toast.error("Failed to create user group");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: UserGroupFormData) => {
      const { data, error } = await supabase
        .from("nd_user_group")
        .update({
          group_name: values.group_name,
          description: values.description,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", userGroup?.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      toast.success("User group updated successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error updating user group:", error);
      toast.error("Failed to update user group");
    },
  });

  const onSubmit = (values: UserGroupFormData) => {
    setIsSubmitting(true);
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit User Group" : "Create User Group"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user group details"
              : "Create a new user group to organize users"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="group_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description for this group"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Update Group"
                  : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
