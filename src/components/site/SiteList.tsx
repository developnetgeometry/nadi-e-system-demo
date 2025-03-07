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
import { useState } from "react";
import { MaintenanceFormDialog } from "./MaintenanceFormDialog";
import { fetchSites, Site } from "./component/site-utils";

export const SiteList = () => {
  const [selectedAsset, setSelectedAsset] = useState<Site | null>(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);

  const { data: sites = [], isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
  });
  const handleMaintenanceClick = (asset: Site) => {
    setSelectedAsset(asset);
    setIsMaintenanceDialogOpen(true);
  };
  const getStatusBadge = (status: Site['active_status']) => {
    if (!status) return "Unknown"; // Handle null or undefined status
    const variants: Record<Site['active_status'], "default" | "destructive" | "outline" | "secondary"> = {
      1: "default",
      2: "outline",
      3: "secondary",
      4: "destructive",
    };
    return <Badge variant={variants[status]}></Badge>;
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
              {/* <TableHead>No.</TableHead> */}
              <TableHead>Site Code</TableHead>
              <TableHead>Site Name</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site, index) => {
              return (
                <TableRow key={site.id}>
                  {/* <TableCell>{index + 1}</TableCell> */}
                  <TableCell>{site?.id || ""}</TableCell>
                  <TableCell>{site?.sitename || ""}</TableCell>
                  <TableCell>{site.nd_phases?.name || ""}</TableCell>
                  <TableCell>{site.nd_region?.eng || ""}</TableCell>
                  <TableCell>{getStatusBadge(site.active_status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
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

      {/* <MaintenanceFormDialog
        open={isMaintenanceDialogOpen}
        onOpenChange={setIsMaintenanceDialogOpen}
        asset={selectedAsset}
      /> */}
    </div>
  );
};