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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAssetCategory } from "./hooks/useAssetCategory";

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssetFormDialog = ({
  open,
  onOpenChange,
}: AssetFormDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: categories = [],
    isLoading: isLoadingAssetCategory,
    error,
  } = useAssetCategory();

  const calculateDepreciation = (
    purchaseCost: number,
    depreciationRate: number,
    purchaseDate: string
  ) => {
    const yearsSincePurchase =
      (new Date().getTime() - new Date(purchaseDate).getTime()) /
      (365 * 24 * 60 * 60 * 1000);
    const depreciation =
      purchaseCost * (depreciationRate / 100) * yearsSincePurchase;
    const currentValue = Math.max(0, purchaseCost - depreciation);
    return currentValue;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const purchaseCost = Number(formData.get("purchaseCost"));
    const depreciationRate = Number(formData.get("depreciationRate"));
    const purchaseDate = formData.get("purchaseDate") as string;

    const currentValue = calculateDepreciation(
      purchaseCost,
      depreciationRate,
      purchaseDate
    );

    const asset = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      purchase_date: purchaseDate,
      purchase_cost: purchaseCost,
      current_value: currentValue,
      depreciation_rate: depreciationRate,
      location: formData.get("location"),
      status: "active",
    };

    try {
      console.log("Creating new asset:", asset);
      const { error } = await supabase.from("assets").insert([asset]);

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

  if (isLoadingAssetCategory) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        Loading...
      </Dialog>
    );
  }

  if (error) {
    console.error("Error fetching categories:", error);
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        Failed to load categories
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Fill in the details below to register a new asset
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset ID</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Enter asset ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Enter asset name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Asset Type</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
