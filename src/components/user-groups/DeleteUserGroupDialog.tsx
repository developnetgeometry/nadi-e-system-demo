
import { useState } from "react";
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
import { useDeleteUserGroup } from "./hooks/useDeleteUserGroup";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteUserGroup } = useDeleteUserGroup();

  const handleDelete = () => {
    setIsDeleting(true);
    deleteUserGroup.mutate(userGroup.id, {
      onSettled: () => {
        setIsDeleting(false);
        onOpenChange(false);
      }
    });
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
