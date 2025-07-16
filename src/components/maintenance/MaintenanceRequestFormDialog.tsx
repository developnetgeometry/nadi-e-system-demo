import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { fetchAllSites, fetchTPSites } from "@/components/site/hook/site-utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectOne } from "@/components/ui/SelectOne";
import { Textarea } from "@/components/ui/textarea";
import { useAssets } from "@/hooks/use-assets";
import { useMaintenance } from "@/hooks/use-maintenance";
import { useToast } from "@/hooks/use-toast";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useVendors } from "@/hooks/use-vendor";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Asset } from "@/types/asset";
import { MaintenanceDocketType, MaintenanceStatus } from "@/types/maintenance";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AttachmentUploadField } from "./AttachmentUploadField";
import { useAttachment } from "./hooks/use-attachment";
import { generateDocketNumber } from "./report/utils";

export interface MaintenanceRequestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MaintenanceRequestFormDialog = ({
  open,
  onOpenChange,
}: MaintenanceRequestFormDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPUser =
    parsedMetadata?.user_group_name === "TP" &&
    !!parsedMetadata?.organization_id;
  const isDUSPUser =
    parsedMetadata?.user_group_name === "DUSP" &&
    !!parsedMetadata?.organization_id;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    (isTPUser || isDUSPUser) &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff";
  const isTpSiteUser = parsedMetadata?.user_group_name === "Site";

  const { user } = useAuth();

  const maintenanceDocketTypes = Object.values(MaintenanceDocketType);

  const [maintenanceDocketType, setMaintenanceDocketType] = useState<
    "" | MaintenanceDocketType
  >("");
  const [description, setDescription] = useState("");

  const [estimatedCompletionDate, setEstimatedCompletionDate] =
    useState<Date | null>(null);

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  // Fetch all sites for SuperAdmin
  const {
    data: allSites = [],
    isLoading: isLoadingAllSites,
    refetch: refetchSites,
  } = useQuery({
    queryKey: ["sites"],
    queryFn: () => fetchAllSites(),
    enabled: isSuperAdmin && open,
  });

  // Fetch sites for TP user
  const { data: tpSites = [], isLoading: isLoadingTpSites } = useQuery({
    queryKey: ["tpSites", organizationId],
    queryFn: () => fetchTPSites(organizationId || ""),
    enabled: !!organizationId && isTPUser && open,
  });

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetsFilter, setAssetsFilter] = useState("");
  const { useAssetsByNameQuery } = useAssets();
  const { data: assets = [], isLoading: isLoadingAssets } =
    useAssetsByNameQuery(assetsFilter, true, selectedSiteId); // get only active assets

  useEffect(() => {
    setSelectedAsset(null);
    setAssetsFilter("");
  }, [selectedSiteId]);

  const {
    data: vendors,
    loading: isVendorLoading,
    error: vendorError,
  } = useVendors();

  const {
    attachmentFile,
    attachmentPreviewUrl,
    isUploading,
    handleAttachmentChange,
    handleRemoveAttachment,
    uploadAttachment,
  } = useAttachment();

  useEffect(() => {
    if (open) {
      setMaintenanceDocketType("");
      setSelectedAsset(null);
      setAssetsFilter("");
      setDescription("");
    }
  }, [open]);

  const { useMaintenanceTypesQuery } = useMaintenance();

  const { data: maintenanceTypes = [], isLoading: isLoadingMaintenanceTypes } =
    useMaintenanceTypesQuery();

  const handleSubmitCM = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    setIsSubmitting(true);

    if (!selectedAsset) {
      toast({
        title: "Error",
        description: `Please select an asset for the maintenance request.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    let attachmentUrl = null;

    if (attachmentFile) {
      const url = await uploadAttachment();

      if (url) {
        attachmentUrl = url;
      } else {
        toast({
          title: "Error",
          description: `Failed to add the maintenance request. Please try again.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    } else {
      toast({
        title: "Error",
        description: `Please upload an attachment for the maintenance request.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const now = new Date();

    const request = {
      description: description,
      asset_id: selectedAsset?.id as number,
      type_id: Number(formData.get("maintenanceType")),
      requester_by: user.id,
      attachment: attachmentUrl,
      status: MaintenanceStatus.Submitted,
      docket_type: "cm",
    };

    try {
      const { data: insertedData, error: insertError } = await supabase
        .from("nd_maintenance_request")
        .insert([
          {
            ...request,
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          },
        ])
        .select();

      if (insertError) throw insertError;

      const docketNumber = generateDocketNumber(
        selectedAsset?.site?.dusp_tp?.parent?.name,
        now,
        insertedData[0].id
      );

      // update no_docket
      const { error: updateNoDocketError } = await supabase
        .from("nd_maintenance_request")
        .update({
          no_docket: docketNumber,
        })
        .eq("id", insertedData[0].id);

      if (updateNoDocketError) {
        throw updateNoDocketError;
      }

      const { error: updateError } = await supabase
        .from("nd_asset")
        .update({ is_active: false })
        .eq("id", selectedAsset?.id);

      if (updateError) throw updateError;

      toast({
        title: "Maintenance Request added successfully",
        description:
          "The new maintenance request has been added to the system.",
      });
    } catch (error) {
      console.error("Error adding maintenance request:", error);
      toast({
        title: "Error",
        description: `Failed to add the maintenance request. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

  const handleSubmitPM = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const selectedVendor = formData.get("vendor");

    const now = new Date();

    const request = {
      description: description,
      type_id: Number(formData.get("maintenanceType")),
      asset_id: selectedAsset?.id as number,
      frequency: String(formData.get("frequency")),
      requester_by: user.id,
      vendor_id: Number(selectedVendor),
      maintenance_date: estimatedCompletionDate,
      status: MaintenanceStatus.Issued,
      docket_type: "pm",
    };

    try {
      const { data: insertedData, error: insertError } = await supabase
        .from("nd_maintenance_request")
        .insert([
          {
            ...request,
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          },
        ])
        .select();

      if (insertError) throw insertError;

      const docketNumber = generateDocketNumber(
        selectedAsset?.site?.dusp_tp?.parent?.name,
        now,
        insertedData[0].id
      );

      // update no_docket
      const { error: updateNoDocketError } = await supabase
        .from("nd_maintenance_request")
        .update({
          no_docket: docketNumber,
        })
        .eq("id", insertedData[0].id);

      if (updateNoDocketError) {
        throw updateNoDocketError;
      }

      toast({
        title: "Maintenance Request added successfully",
        description:
          "The new maintenance request has been added to the system.",
      });
    } catch (error) {
      console.error("Error adding maintenance request:", error);
      toast({
        title: "Error",
        description: `Failed to add the maintenance request. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

  const AssetCard = ({ asset }: { asset: Asset }) => (
    <div
      className="border-2 rounded-md m-2 p-2 cursor-pointer hover:bg-gray-100"
      onClick={() => {
        setSelectedAsset(asset);
        setAssetsFilter("");
      }}
    >
      <p className="font-semibold text-sm">{asset.name}</p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2/3 max-h-[90vh] overflow-y-auto">
        {isLoadingMaintenanceTypes && isLoadingMaintenanceTypes ? (
          <DialogTitle>
            <LoadingSpinner />
          </DialogTitle>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add New Maintenance Request</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new maintenance request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="maintenanceDocketType">Request Type</Label>
              <Select
                name="maintenanceDocketType"
                required
                onValueChange={(value) => {
                  if (
                    value === MaintenanceDocketType.Preventive &&
                    (isStaffUser || isTpSiteUser)
                  ) {
                    toast({
                      title: "Error",
                      description:
                        "Preventive Maintenance is not allowed for staff or tp site users.",
                      variant: "destructive",
                    });
                    return;
                  } else {
                    setMaintenanceDocketType(value as MaintenanceDocketType);
                  }
                }}
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
              <form onSubmit={handleSubmitCM} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceType">Maintenance Type</Label>
                  <Select name="maintenanceType" required>
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

                {(isSuperAdmin || isDUSPUser || isTPUser) && (
                  <div className="space-y-2">
                    <Label htmlFor="site">Site</Label>
                    <SelectOne
                      options={isTPUser ? tpSites : allSites}
                      value={selectedSiteId}
                      onChange={(value) => {
                        const newSiteId = value as string;
                        setSelectedSiteId(newSiteId);
                      }}
                      placeholder="Select a site"
                      disabled={
                        (isTPUser ? isLoadingTpSites : isLoadingAllSites) ||
                        isSubmitting
                      }
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="asset">Asset</Label>
                  <div className="relative flex space-x-4">
                    <Input
                      placeholder="Search and add asset"
                      value={assetsFilter}
                      onChange={(e) => {
                        setAssetsFilter(e.target.value);
                      }}
                      className="pl-10"
                    />
                    <Search className="absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>

                  <div className="mt-2">
                    {isLoadingAssets ? (
                      <LoadingSpinner />
                    ) : assetsFilter && assets.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No assets found
                      </p>
                    ) : (
                      assets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} />
                      ))
                    )}

                    {selectedAsset && (
                      <div className="relative mt-4 p-4 border rounded bg-gray-50">
                        <button
                          onClick={() => setSelectedAsset(null)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                          aria-label="Clear selection"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="mt-2 bg-gray-50">
                          <p className="font-semibold text-sm">
                            {selectedAsset.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment</Label>
                  <AttachmentUploadField
                    previewUrl={attachmentPreviewUrl}
                    isUploading={isUploading}
                    onAttachmentChange={handleAttachmentChange}
                    onRemoveAttachment={handleRemoveAttachment}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !maintenanceDocketType}
                  className="pt-2 w-full"
                >
                  {isSubmitting ? "Adding..." : "Open Request"}
                </Button>
              </form>
            )}

            {maintenanceDocketType === MaintenanceDocketType.Preventive && (
              <form onSubmit={handleSubmitPM} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceType">Maintenance Type</Label>
                  <Select name="maintenanceType" required>
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

                {(isSuperAdmin || isDUSPUser || isTPUser) && (
                  <div className="space-y-2">
                    <Label htmlFor="site">Site</Label>
                    <SelectOne
                      options={isTPUser ? tpSites : allSites}
                      value={selectedSiteId}
                      onChange={(value) => {
                        const newSiteId = value as string;
                        setSelectedSiteId(newSiteId);
                      }}
                      placeholder="Select a site"
                      disabled={
                        (isTPUser ? isLoadingTpSites : isLoadingAllSites) ||
                        isSubmitting
                      }
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="asset">Asset</Label>
                  <div className="relative flex space-x-4">
                    <Input
                      placeholder="Search and add asset"
                      value={assetsFilter}
                      onChange={(e) => {
                        setAssetsFilter(e.target.value);
                      }}
                      className="pl-10"
                    />
                    <Search className="absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>

                  <div className="mt-2">
                    {isLoadingAssets ? (
                      <LoadingSpinner />
                    ) : assetsFilter && assets.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No assets found
                      </p>
                    ) : (
                      assets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} />
                      ))
                    )}

                    {selectedAsset && (
                      <div className="relative mt-4 p-4 border rounded bg-gray-50">
                        <button
                          onClick={() => setSelectedAsset(null)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                          aria-label="Clear selection"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="mt-2 bg-gray-50">
                          <p className="font-semibold text-sm">
                            {selectedAsset.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select name="frequency" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Completion Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !estimatedCompletionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {estimatedCompletionDate ? (
                          format(estimatedCompletionDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-white shadow-md border"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={estimatedCompletionDate}
                        onSelect={(date) => {
                          setEstimatedCompletionDate(date);
                        }}
                        initialFocus
                        className="pointer-events-auto"
                        disabled={(date) =>
                          date <= new Date(new Date().setHours(0, 0, 0, 0))
                        } // disable dates before today
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select name="vendor" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {!isVendorLoading &&
                        vendors.map((vendor) => (
                          <SelectItem
                            key={vendor.id}
                            value={vendor.id.toString()}
                          >
                            {vendor.business_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !maintenanceDocketType}
                  className="pt-2 w-full"
                >
                  {isSubmitting ? "Adding..." : "Open Request"}
                </Button>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
