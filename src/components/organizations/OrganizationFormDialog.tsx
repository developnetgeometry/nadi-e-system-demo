
import { Organization } from "@/types/organization";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrganizationForm } from "./OrganizationForm";

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization;
  onSubmit: (values: any) => void;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  organization,
  onSubmit,
}: OrganizationFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {organization ? "Edit" : "Create"} Organization
          </DialogTitle>
        </DialogHeader>
        <OrganizationForm
          organization={organization}
          onSubmit={(values) => {
            onSubmit(values);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
