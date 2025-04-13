import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssets } from "@/hooks/use-assets";
import { useBrand } from "@/hooks/use-brand";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Asset } from "@/types/asset";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";

export interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: Asset | null;
}

export const AssetFormDialog = ({
  open,
  onOpenChange,
  asset,
}: AssetFormDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetBrandId, setAssetBrandId] = useState("");
  const [assetDescription, setAssetDescription] = useState("");
  const [assetLocationId, setAssetLocationId] = useState("");

  useEffect(() => {
    if (asset) {
      setAssetName(asset.name);
      setAssetType(String(asset.type_id));
      setAssetBrandId(String(asset.brand_id));
      setAssetDescription(asset.remark);
    }
  }, [asset]);

  const { useAssetTypesQuery } = useAssets();

  const {
    data: assetTypes = [],
    isLoading: assetTypeIsLoading,
    error: assetTypeError,
  } = useAssetTypesQuery();

  const {
    data: brands,
    isLoading: brandIsLoading,
    error: brandError,
  } = useBrand();

  // TODO: Replace with actual data
  const locations = [
    { id: "1", name: "Location 1" },
    { id: "2", name: "Location 2" },
    { id: "3", name: "Location 3" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const asset = {
      name: formData.get("name"),
      type_id: formData.get("type"),
      brand_id: formData.get("brand"),
      remark: formData.get("description"),
      location_id: formData.get("location"),
    };

    try {
      console.log("Creating new asset:", asset);
      const { error } = await supabase.from("nd_asset").insert([asset]);

      if (error) throw error;

      toast({
        title: "Asset added successfully",
        description: "The new asset has been added to the system.",
      });

      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset-stats"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding asset:", error);
      toast({
        title: "Error",
        description: "Failed to add the asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (assetTypeError) {
    console.error("Error fetching asset types:", assetTypeError);
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        Failed to load asset types
      </Dialog>
    );
  }

  if (brandError) {
    console.error("Error fetching brands:", brandError);
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        Failed to load brands
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2/3">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
          <DialogDescription>
            {asset
              ? "Update asset details"
              : "Fill in the details to create a new asset"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Enter asset name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Brand</Label>
            <Select
              name="brand"
              required
              value={assetBrandId}
              onValueChange={setAssetBrandId}
              disabled={brandIsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand, index) => (
                  <SelectItem key={index} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Enter asset description"
              value={assetDescription}
              onChange={(e) => setAssetDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Asset Location</Label>
            <Select
              name="location"
              required
              value={assetLocationId}
              onValueChange={setAssetLocationId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location, index) => (
                  <SelectItem key={index} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Asset Type</Label>
            <Select
              name="type"
              required
              value={assetType}
              onValueChange={setAssetType}
              disabled={assetTypeIsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type, index) => (
                  <SelectItem key={index} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting
              ? asset
                ? "Updating..."
                : "Adding..."
              : asset
              ? "Update Asset"
              : "Add Asset"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
