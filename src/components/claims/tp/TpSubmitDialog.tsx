import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateClaimTP } from "./hooks/update-claim-tp"; // Import the update function
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TpSubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  claim: any;
}

const TpSubmitDialog: React.FC<TpSubmitDialogProps> = ({ isOpen, onClose, claim }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [remark, setRemark] = useState("");

  const handleSubmit = async () => {
    try {
      await updateClaimTP({
        claim_id: claim.id,
        claim_status: 2,
        request_remark: remark,
      });
      toast({ title: "Success", description: "Claim submitted successfully." });

      // Invalidate the query to refresh the ClaimList
      queryClient.invalidateQueries({ queryKey: ["fetchClaimTP"] });

      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit claim.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Claim</DialogTitle>
        </DialogHeader>
        <textarea
          className="w-full border rounded-md p-2"
          placeholder="Enter your remark..."
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TpSubmitDialog;