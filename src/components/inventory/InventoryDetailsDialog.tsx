import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchUserProfileNameById } from "@/hooks/auth/utils/profile-handler";
import { useToast } from "@/hooks/use-toast";
import { Inventory } from "@/types/inventory";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
interface InventoryDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: Inventory | null;
}

export const InventoryDetailsDialog = ({
  open,
  onOpenChange,
  inventory,
}: InventoryDetailsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestedByName, setRequestedByName] = useState("N/A");

  // Get the inventory image URL
  const inventoryImageUrl = inventory?.nd_inventory_attachment?.find(
    attachment => attachment.file_path
  )?.file_path || null;

  useEffect(() => {
    if (!open) {
      setRequestedByName("N/A");
      return;
    }
    const fetchName = async () => {
      if (inventory?.created_by) {
        try {
          const name = await fetchUserProfileNameById(inventory.created_by);
          setRequestedByName(name);
        } catch (error) {
          console.error("Failed to fetch user name:", error);
          setRequestedByName("Error fetching name");
        }
      }
    };

    fetchName();
  }, [inventory?.created_by, open]);

  if (!inventory) return null;

  // TODO: Submit to DUSP
  // const handleSubmitToDusp = async () => {
  //   return new Error("Function not implemented.");
  // };

  const handleSubmitForApproval = async () => {
    return new Error("Function not implemented.");
  };

  const handleApprove = async () => {
    return new Error("Function not implemented.");
  };
  const requestDate = inventory.created_at
    ? inventory.created_at.split("T")[0]
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inventory Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4">

          {inventoryImageUrl && (
            <div className="w-full mb-4">
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Inventory Image</span>
                <div className="w-48 h-48 border rounded-md overflow-hidden bg-muted/30 flex items-center justify-center">
                  <img
                    src={inventoryImageUrl}
                    alt={`${inventory.name} image`}
                    className="object-contain w-full h-full p-2"
                    onError={(e) => {
                      // Hide image if it fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Item Name</span>
              <span>{inventory.name}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Quantity</span>
              <span>{inventory.quantity}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Request Date</span>
              <span>{requestDate}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Requested By</span>
              <span>{requestedByName}</span>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Type</span>
              <span>{inventory?.type?.name}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Nadi Center</span>
              <span>{inventory?.site?.sitename}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Status</span>
              {/* TODO: Status */}
              <span>{"Draft"}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          {/* <Button
            type="button"
            variant="default"
            onClick={() => {
              handleSubmitToDusp();
            }}
          >
            Submit to DUSP
          </Button> */}
          {/* {inventory.is_active && (
            <Button
              type="button"
              variant="default"
              onClick={() => {
                handleSubmitToDusp();
              }}
            >
              Submit to DUSP
            </Button>
          )}
          {!inventory.is_active && (
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleSubmitForApproval();
                }}
              >
                Submit for Approval
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  handleApprove();
                }}
              >
                Approve
              </Button>
            </div>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
