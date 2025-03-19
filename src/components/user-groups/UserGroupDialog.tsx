
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserGroup, UserGroupFormData } from "./types";
import { UserGroupForm } from "./UserGroupForm";
import { useUserGroupMutations } from "./hooks/useUserGroupMutations";

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
  const isEditing = !!userGroup;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createUserGroup, updateUserGroup } = useUserGroupMutations();

  const handleSubmit = (values: UserGroupFormData) => {
    setIsSubmitting(true);
    
    if (isEditing && userGroup) {
      updateUserGroup.mutate(
        { values, id: userGroup.id },
        {
          onSettled: () => {
            setIsSubmitting(false);
            onOpenChange(false);
          }
        }
      );
    } else {
      createUserGroup.mutate(values, {
        onSettled: () => {
          setIsSubmitting(false);
          onOpenChange(false);
        }
      });
    }
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

        <UserGroupForm
          userGroup={userGroup}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
