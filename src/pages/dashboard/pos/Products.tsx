import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Filter, Search, Check, Edit } from "lucide-react";
import { useUserMetadata } from "@/hooks/use-user-metadata";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventories, setInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

   const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPUser =
    parsedMetadata?.user_group_name === "TP" &&
    !!parsedMetadata?.organization_id;

  // Fetch transactions with items
  const { data: inventoryData, isLoading, error } = useQuery({
    queryKey: ['inventories', parsedMetadata?.group_profile?.site_profile_id, isSuperAdmin],
    queryFn: async () => {
      let query = supabase
        .from('nd_inventory')
        .select(`*, 
          type:nd_inventory_type!type_id(id, name),
          category:nd_inventory_category!category_id(id, name)
        `);
        
      // If not super admin, filter by site_id
      if (!isSuperAdmin) {
        const siteProfileId = parsedMetadata?.group_profile?.site_profile_id || null;
        
        if (!siteProfileId) {
          console.warn("No site_profile_id found in user metadata");
          return [];
        }

        // Get the site_id from nd_site table using site_profile_id
        const { data: siteData, error: siteError } = await supabase
          .from('nd_site')
          .select('id')
          .eq('site_profile_id', siteProfileId)
          .single();

        if (siteError || !siteData) {
          console.error("Error fetching site:", siteError);
          return [];
        }

        const siteId = siteData.id;
        query = query.eq('site_id', siteId);
      }

      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching inventory:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditPrice(item.price?.toString() || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdatePrice = async () => {
    if (!selectedItem || !editPrice) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      let userId = null;
      try {
        const storedUserMetadata = localStorage.getItem('user_metadata');
        if (storedUserMetadata) {
          const userData = JSON.parse(storedUserMetadata);
          userId = userData.group_profile?.user_id || null;
        }
      } catch (error) {
        console.error("Error retrieving user data from localStorage:", error);
      }

      const { error } = await supabase
        .from('nd_inventory')
        .update({ 
          price: newPrice,
          updated_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedItem.id);

      if (error) {
        throw error;
      }

      // Update local state
      const updatedInventories = inventories.map(item => 
        item.id === selectedItem.id 
          ? { ...item, price: newPrice }
          : item
      );
      setInventories(updatedInventories);
      setFilteredInventories(updatedInventories);

      queryClient.invalidateQueries({ queryKey: ['inventories'] });

      toast({
        title: "Success",
        description: `Price updated successfully for ${selectedItem.name}`,
        variant: "default",
      });

      setIsEditDialogOpen(false);
      setSelectedItem(null);
      setEditPrice("");

    } catch (error) {
      console.error('Error updating price:', error);
      toast({
        title: "Error",
        description: "Failed to update price. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (inventoryData) {
      setInventories(inventoryData);
      setFilteredInventories(inventoryData);
    }
  }, [inventoryData]);

  useEffect(() => {
    if (!inventories || !searchTerm) {
      setFilteredInventories(inventories || []);
      return;
    }
      
    const filtered = inventories.filter(item => {
      const searchLower = searchTerm.toLowerCase();

      const idMatch = item.id.toLowerCase().includes(searchLower);
      const nameMatch = item.name?.toLowerCase().includes(searchLower);
      const typeMatch = item.type?.name?.toLowerCase().includes(searchLower);
      const categoryMatch = item.category?.name?.toLowerCase().includes(searchLower);
      const barcodeMatch = item.barcode?.toLowerCase().includes(searchLower);

      return idMatch || nameMatch || typeMatch || barcodeMatch || categoryMatch;
    })
    
    setFilteredInventories(filtered);
  }, [inventories, searchTerm]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your inventory</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Created At</TableHead>
                  {isSuperAdmin && (
                    <TableHead>Action</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventories.length > 0 ? (
                  filteredInventories.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell>{item.name || 'N/A'}</TableCell>
                      <TableCell>{item.category?.name || 'N/A'}</TableCell>
                      <TableCell>{item.price ? `RM ${item.price.toFixed(2)}` : 'N/A'}</TableCell>
                      <TableCell>{item.quantity || 0}</TableCell>
                      <TableCell>{item.barcode || 'N/A'}</TableCell>
                      <TableCell>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                      </TableCell>
                      {isSuperAdmin && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(item)}
                                  disabled={item.category?.name !== "Services"}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Price</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Price Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Service Price</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  value={selectedItem.name}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentPrice">Current Price</Label>
                <Input
                  id="currentPrice"
                  value={`RM ${selectedItem.price?.toFixed(2) || '0.00'}`}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPrice">New Price (RM)</Label>
                <Input
                  id="newPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter new price"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedItem(null);
                setEditPrice("");
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleUpdatePrice}
              disabled={!editPrice || parseFloat(editPrice) < 0}
            >
              Update Price
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Products;