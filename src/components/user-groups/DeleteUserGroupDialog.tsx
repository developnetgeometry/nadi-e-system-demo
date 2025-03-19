
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserGroup } from "./types";
import { toast } from "sonner";

interface DeleteUserGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userGroup: UserGroup;
}

export const DeleteUserGroupDialog = ({
  open,
  onOpenChange,
  userGroup,
}: DeleteUserGroupDialogProps) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("nd_user_group")
        .delete()
        .eq("id", userGroup.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      toast.success("User group deleted successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error deleting user group:", error);
      toast.error("Failed to delete user group. It may be in use by one or more users.");
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate();
    setIsDeleting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the group "{userGroup.group_name}". This action 
            cannot be undone. If users are assigned to this group, you'll need to reassign them first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Group"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
