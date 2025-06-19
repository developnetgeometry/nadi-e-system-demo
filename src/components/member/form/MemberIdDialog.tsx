import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MemberIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membershipId: string | null;
}

export const MemberIdDialog = ({
  open,
  onOpenChange,
  membershipId,
}: MemberIdDialogProps) => {
  if (!membershipId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[40vw] max-h-[50vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Membership Registration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-lg font-semibold text-center">
            Successfully registered!
          </p>
          <p className="text-center">
            Your Membership ID is <span className="font-bold">{membershipId}</span>.
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            type="button"
            variant="default"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};