import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { MaintenanceFormDialog } from "./MaintenanceFormDialog";

interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'in_maintenance' | 'retired' | 'disposed';
  purchase_date: string;
  current_value: number;
  purchase_cost: number;
  depreciation_rate: number;
  next_maintenance_date: string | null;
  location: string;
}

export const AssetList = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      console.log('Fetching assets...');
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Asset[];
      } catch (error) {
        console.error('Error fetching assets:', error);
        throw error;
      }
    },
  });

  const getStatusBadge = (status: Asset['status']) => {
    const variants: Record<Asset['status'], "default" | "destructive" | "outline" | "secondary"> = {
      active: "default",
      in_maintenance: "destructive",
      retired: "secondary",
      disposed: "outline",
    };
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const calculateDepreciation = (asset: Asset) => {
    const yearsSincePurchase = (new Date().getTime() - new Date(asset.purchase_date).getTime()) / (365 * 24 * 60 * 60 * 1000);
    const depreciation = asset.purchase_cost * (asset.depreciation_rate / 100) * yearsSincePurchase;
    return Math.max(0, asset.purchase_cost - depreciation);
  };

  const handleMaintenanceClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsMaintenanceDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading assets...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Purchase Cost</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead>Depreciation</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              const currentValue = calculateDepreciation(asset);
              const depreciationAmount = asset.purchase_cost - currentValue;
              return (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{getStatusBadge(asset.status)}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>${asset.purchase_cost.toLocaleString()}</TableCell>
                  <TableCell>${currentValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="text-destructive">
                      -${depreciationAmount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {asset.next_maintenance_date
                      ? new Date(asset.next_maintenance_date).toLocaleDateString()
                      : 'Not scheduled'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMaintenanceClick(asset)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <MaintenanceFormDialog
        open={isMaintenanceDialogOpen}
        onOpenChange={setIsMaintenanceDialogOpen}
        asset={selectedAsset}
      />
    </div>
  );
};