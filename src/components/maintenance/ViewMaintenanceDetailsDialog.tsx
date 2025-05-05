import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Asset } from "@/types/asset";
import { MaintenanceDocketType, MaintenanceRequest } from "@/types/maintenance";
import { useState } from "react";
import { useAttachment } from "./hooks/use-attachment";

export interface ViewMaintenanceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceRequest?: MaintenanceRequest;
}

export const ViewMaintenanceDetailsDialog = ({
  open,
  onOpenChange,
  maintenanceRequest,
}: ViewMaintenanceDetailsDialogProps) => {
  const maintenanceDocketTypes = Object.values(MaintenanceDocketType);

  const [maintenanceDocketType, setMaintenanceDocketType] = useState<
    "" | MaintenanceDocketType
  >("");
  const [description, setDescription] = useState("");
  const [slaCategory, setSLACategory] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [asset, setAsset] = useState<Asset | null>(null);
  const [status, setStatus] = useState("");

  const {
    attachmentFile,
    attachmentPreviewUrl,
    isUploading,
    handleAttachmentChange,
    handleRemoveAttachment,
    uploadAttachment,
  } = useAttachment();

  // const { useMaintenanceTypesQuery, useSLACategoriesQuery } = useMaintenance();

  // const { data: maintenanceTypes = [], isLoading: isLoadingMaintenanceTypes } =
  //   useMaintenanceTypesQuery();

  // const { data: slaCategories = [], isLoading: isLoadingSLACategories } =
  //   useSLACategoriesQuery();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2/3 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>Maintenance Request Details</DialogTitle>
          <DialogDescription>
            {maintenanceRequest?.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p>{maintenanceRequest?.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Asset</h3>
            <p>{maintenanceRequest?.asset?.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <p>{maintenanceRequest?.status}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">SLA Category</h3>
            <p>{maintenanceRequest?.sla?.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Maintenance Type</h3>
            <p>{maintenanceRequest?.type?.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Attachment</h3>
            {maintenanceRequest?.attachment ? (
              <img src={maintenanceRequest?.attachment} alt="Attachment" />
            ) : (
              <p>No attachment</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
