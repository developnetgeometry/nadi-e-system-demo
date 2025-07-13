import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchUserProfileNameById } from "@/hooks/auth/utils/profile-handler";
import { useToast } from "@/hooks/use-toast";
import { Asset, RetailTypes } from "@/types/asset";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
interface AssetDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

export const AssetDetailsDialog = ({
  open,
  onOpenChange,
  asset,
}: AssetDetailsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [requestedByName, setRequestedByName] = useState("N/A");

  useEffect(() => {
    if (!open) {
      setRequestedByName("N/A");
      return;
    }
    const fetchName = async () => {
      if (asset?.created_by) {
        try {
          const name = await fetchUserProfileNameById(asset.created_by);
          setRequestedByName(name);
        } catch (error) {
          console.error("Failed to fetch user name:", error);
          setRequestedByName("Error fetching name");
        }
      }
    };

    fetchName();
  }, [asset?.created_by, open]);

  if (!asset) return null;

  const requestDate = asset.created_at ? asset.created_at.split("T")[0] : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Item Name</span>
              <span>{asset.name}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Retail</span>
              <span>
                {RetailTypes.find((type) => type.id === asset.retail_type)
                  ?.name || "Unknown"}
              </span>{" "}
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
              <span>{asset.type.name}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Nadi Center</span>
              <span>{asset.site?.sitename}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Status</span>
              {/* TODO: Status */}
              <span>{asset.is_active ? "Final" : "Draft"}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
