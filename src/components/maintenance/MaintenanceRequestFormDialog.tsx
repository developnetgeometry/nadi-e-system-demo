import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMaintenance } from "@/hooks/use-maintenance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Asset } from "@/types/asset";
import { MaintenanceDocketType, MaintenanceRequest } from "@/types/maintenance";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { Textarea } from "../ui/textarea";
import { AttachmentUploadField } from "./AttachmentUploadField";
import { useAttachment } from "./hooks/use-attachment";

export interface MaintenanceRequestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceRequest?: MaintenanceRequest;
}

export const MaintenanceRequestFormDialog = ({
  open,
  onOpenChange,
  maintenanceRequest,
}: MaintenanceRequestFormDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

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

  const { useMaintenanceTypesQuery, useSLACategoriesQuery } = useMaintenance();

  const { data: maintenanceTypes = [], isLoading: isLoadingMaintenanceTypes } =
    useMaintenanceTypesQuery();

  const { data: slaCategories = [], isLoading: isLoadingSLACategories } =
    useSLACategoriesQuery();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    setIsSubmitting(true);

    let attachmentUrl = null;

    if (attachmentFile) {
      const logoUrl = await uploadAttachment();

      if (logoUrl) {
        attachmentUrl = logoUrl;
      } else {
        toast({
          title: "Error",
          description: `Failed to ${
            maintenanceRequest ? "update" : "add"
          } the maintenance request. Please try again.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const request = {
      description: description,
      asset_id: asset?.id as number,
      type_id: formData.get("maintenanceType") as string,
      sla_id: formData.get("sla") as string,
      requester_by: user.id,
      attachment: attachmentUrl,
    };

    try {
      if (maintenanceRequest) {
        const { error: updateError } = await supabase
          .from("nd_maintenance_request")
          .update({
            ...request,
            updated_at: new Date().toISOString(),
          })
          .eq("id", maintenanceRequest.id);

        if (updateError) throw updateError;

        toast({
          title: "Maintenance Request updated successfully",
          description:
            "The maintenance request has been updated in the system.",
        });
      } else {
        const { error: insertError } = await supabase
          .from("nd_maintenance_request")
          .insert([{ ...request, created_at: new Date().toISOString() }]);

        if (insertError) throw insertError;

        toast({
          title: "Maintenance Request added successfully",
          description:
            "The new maintenance request has been added to the system.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["maintenanceRequests"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding maintenance request:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          maintenanceRequest ? "update" : "add"
        } the maintenance request. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2/3 max-h-[90vh] overflow-y-auto">
        {isLoadingMaintenanceTypes && isLoadingMaintenanceTypes ? (
          <DialogTitle>
            <LoadingSpinner />
          </DialogTitle>
        ) : (
          <>
            <DialogHeader className="mb-2">
              <DialogTitle>
                {maintenanceRequest
                  ? "Update Maintenance Request"
                  : "Add New Maintenance Request"}
              </DialogTitle>
              <DialogDescription>
                {maintenanceRequest
                  ? "Update maintenance request details"
                  : "Fill in the details to create a new maintenance request"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maintenanceDocketType">Type</Label>
                <Select
                  name="maintenanceDocketType"
                  required
                  onValueChange={(value) =>
                    setMaintenanceDocketType(value as MaintenanceDocketType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenanceDocketTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {maintenanceDocketType === MaintenanceDocketType.Corrective && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="sla">SLA</Label>
                    <Select name="sla" required onValueChange={setSLACategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select SLA" />
                      </SelectTrigger>
                      <SelectContent>
                        {slaCategories.map((type, index) => (
                          <SelectItem key={index} value={type.id.toString()}>
                            {type?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenanceType">Maintenance Type</Label>
                    <Select
                      name="maintenanceType"
                      required
                      onValueChange={setMaintenanceType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select maintenance type" />
                      </SelectTrigger>
                      <SelectContent>
                        {maintenanceTypes.map((type, index) => (
                          <SelectItem key={index} value={type.id.toString()}>
                            {type?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <AttachmentUploadField
                    previewUrl={attachmentPreviewUrl}
                    isUploading={isUploading}
                    onAttachmentChange={handleAttachmentChange}
                    onRemoveAttachment={handleRemoveAttachment}
                  />
                </>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !maintenanceDocketType}
                className="pt-2 w-full"
              >
                {isSubmitting
                  ? maintenanceRequest
                    ? "Updating..."
                    : "Adding..."
                  : maintenanceRequest
                  ? "Update Maintenance Request"
                  : "Open Request"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
