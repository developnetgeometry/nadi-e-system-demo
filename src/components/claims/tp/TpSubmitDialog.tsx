import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { updateClaim } from "../hook/update-claim"; // Import the update function
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface TpSubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  claim: any;
}

const TpSubmitDialog: React.FC<TpSubmitDialogProps> = ({ isOpen, onClose, claim }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [remark, setRemark] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateClaim({
        claim_id: claim.id,
        claim_status: 2,
        request_remark: remark,
      });
      toast({ title: "Success", description: "Claim submitted successfully." });

      // Invalidate the query to refresh the ClaimList
      queryClient.invalidateQueries({ queryKey: ["claimStats"] });
      queryClient.invalidateQueries({ queryKey: ["fetchClaimTP"] });
      queryClient.invalidateQueries({ queryKey: ["fetchClaimById"] });

      // Reset states and close dialog
      setRemark("");
      setIsCheckboxChecked(false);
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit claim.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRemark("");
    setIsCheckboxChecked(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Claim</DialogTitle>
          <DialogDescription className="text-muted-foreground mb-4">
            Provide a remark for your submission.
          </DialogDescription>
        </DialogHeader>
        <textarea
          className="w-full border rounded-md p-2 mb-4"
          placeholder="Enter your remark..."
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <p className="text-sm text-gray-700 italic">
          Once submitted, the claim <span className="text-red-600">cannot</span> be edited.
        </p>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="confirm-checkbox"
            className="mr-2"
            checked={isCheckboxChecked}
            onChange={(e) => setIsCheckboxChecked(e.target.checked)}
          />
          <label htmlFor="confirm-checkbox" className="text-sm text-gray-600">
            I understand and confirm this action
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !isCheckboxChecked || !remark.trim()}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TpSubmitDialog;