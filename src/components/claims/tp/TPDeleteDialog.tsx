import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { deleteClaimData } from "./hooks/delete-claim";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react"; // Import a spinner icon

interface TPDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: string;
}

const TPDeleteDialog: React.FC<TPDeleteDialogProps> = ({ isOpen, onClose, claimId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const handleDelete = async () => {
    setIsLoading(true); // Set loading to true
    try {
      await deleteClaimData(claimId);
      toast({ title: "Success", description: "Claim deleted successfully." });

      // Invalidate the query to refresh the ClaimList
      queryClient.invalidateQueries({ queryKey: ["fetchClaimTP"] });

      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete claim.", variant: "destructive" });
    } finally {
      setIsLoading(false); // Set loading to false after operation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Claim</DialogTitle>
                    <DialogDescription className="text-muted-foreground mb-4">
                      
                    </DialogDescription>
        </DialogHeader>
        <p>Are you sure you want to delete this claim? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> {/* Spinner */}
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TPDeleteDialog;