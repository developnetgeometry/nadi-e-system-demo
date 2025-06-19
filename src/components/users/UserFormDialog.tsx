import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "@/components/users/UserForm";
import { Profile } from "@/types/auth";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: Profile;
  onSuccess?: () => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {user ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Update the user's information and permissions"
              : "Fill in the details to create a new user account"}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          user={user}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess?.();
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
