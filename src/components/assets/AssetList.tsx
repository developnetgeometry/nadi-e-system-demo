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
  next_maintenance_date: string | null;
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
    const variants = {
      active: 'success',
      in_maintenance: 'destructive',
      retired: 'secondary',
      disposed: 'outline',
    };
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>;
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
              <TableHead>Purchase Date</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>{getStatusBadge(asset.status)}</TableCell>
                <TableCell>{new Date(asset.purchase_date).toLocaleDateString()}</TableCell>
                <TableCell>${asset.current_value.toLocaleString()}</TableCell>
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
            ))}
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