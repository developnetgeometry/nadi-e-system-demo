import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TPUserForm } from "@/components/hr/TPUserForm";
import { Profile } from "@/types/auth";

interface TPStaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: Profile;
  onSuccess?: () => void;
}

export function TPStaffFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: TPStaffFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {user ? "Edit User" : "Create New User"}
          </DialogTitle>
        </DialogHeader>
        <TPUserForm
          open={open}
          onOpenChange={onOpenChange}
          user={user}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess?.();
          }}
          // Removed onCancel as it is not defined in TPUserFormProps
        />
      </DialogContent>
    </Dialog>
  );
}
