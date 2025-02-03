import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssetFormDialog = ({ open, onOpenChange }: AssetFormDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDepreciation = (purchaseCost: number, depreciationRate: number, purchaseDate: string) => {
    const yearsSincePurchase = (new Date().getTime() - new Date(purchaseDate).getTime()) / (365 * 24 * 60 * 60 * 1000);
    const depreciation = purchaseCost * (depreciationRate / 100) * yearsSincePurchase;
    const currentValue = Math.max(0, purchaseCost - depreciation);
    return currentValue;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const purchaseCost = Number(formData.get('purchaseCost'));
    const depreciationRate = Number(formData.get('depreciationRate'));
    const purchaseDate = formData.get('purchaseDate') as string;
    
    const currentValue = calculateDepreciation(purchaseCost, depreciationRate, purchaseDate);

    const asset = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      purchase_date: purchaseDate,
      purchase_cost: purchaseCost,
      current_value: currentValue,
      depreciation_rate: depreciationRate,
      location: formData.get('location'),
      status: 'active',
    };

    try {
      console.log('Creating new asset:', asset);
      const { error } = await supabase.from('assets').insert([asset]);
      
      if (error) throw error;

      toast({
        title: "Asset added successfully",
        description: "The new asset has been added to the system.",
      });

      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset-stats'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: "Error",
        description: "Failed to add the asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input id="name" name="name" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input id="purchaseDate" name="purchaseDate" type="date" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purchaseCost">Purchase Cost ($)</Label>
            <Input
              id="purchaseCost"
              name="purchaseCost"
              type="number"
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="depreciationRate">Annual Depreciation Rate (%)</Label>
            <Input
              id="depreciationRate"
              name="depreciationRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required />
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