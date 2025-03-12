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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MaintenanceFormDialog } from "./MaintenanceFormDialog";
import { fetchSites, Site, deleteSite } from "./component/site-utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const SiteList = () => {
  const [selectedAsset, setSelectedAsset] = useState<Site | null>(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sites = [], isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
  });

  const handleDeleteClick = (siteId: string) => {
    setSiteToDelete(siteId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!siteToDelete) return;
    try {
      await deleteSite(siteToDelete);
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site-stats'] });
      toast({
        title: "Site deleted",
        description: "The site has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete site:", error);
      toast({
        title: "Error",
        description: "Failed to delete the site. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSiteToDelete(null);
    }
  };

  const getStatusBadge = (status: Site['nd_site_status']['eng']) => {
    if (!status) return "Unknown"; // Handle null or undefined status
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      "In Operation": "default",
      "Permanently Close": "outline",
      "In Progress": "secondary",
      "Temporarily Close": "destructive",
    };
    const variant = variants[status] || "default";
    return <Badge variant={variant}>{status.replace('_', ' ')}</Badge>;
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
              <TableHead>No.</TableHead>
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
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{site?.nd_site[0]?.standard_code || ""}</TableCell>
                  <TableCell>{site?.sitename || ""}</TableCell>
                  <TableCell>{site?.nd_phases?.name || ""}</TableCell>
                  <TableCell>{site?.nd_region?.eng || ""}</TableCell>
                  <TableCell>{getStatusBadge(site?.nd_site_status?.eng)}</TableCell>
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
                        onClick={() => handleDeleteClick(site.id)}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this site?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <MaintenanceFormDialog
        open={isMaintenanceDialogOpen}
        onOpenChange={setIsMaintenanceDialogOpen}
        asset={selectedAsset}
      /> */}
    </div>
  );
};