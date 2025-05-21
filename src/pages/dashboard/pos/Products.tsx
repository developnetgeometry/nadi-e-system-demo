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

import { FileDown, Filter, Search, Check } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventories, setInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);

  // Fetch transactions with items
  const { data: inventoryData, isLoading, error } = useQuery({
    queryKey: ['inventories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nd_inventory')
        .select(`*, type:nd_inventory_type!type_id(id, name)`);
        // .is('deleted_at', null);
        
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
      const barcodeMatch = item.barcode?.toLowerCase().includes(searchLower);

      return idMatch || nameMatch || typeMatch || barcodeMatch;
    })
    
    setFilteredInventories(filtered);
  }, [inventories, searchTerm]);

  return (
    <DashboardLayout>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventories.length > 0 ? (
                  filteredInventories.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell>{item.name || 'N/A'}</TableCell>
                      <TableCell>{item.type?.name || 'N/A'}</TableCell>
                      <TableCell>{item.price ? `RM ${item.price.toFixed(2)}` : 'N/A'}</TableCell>
                      <TableCell>{item.quantity || 0}</TableCell>
                      <TableCell>{item.barcode || 'N/A'}</TableCell>
                      <TableCell>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                      </TableCell>
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
    </DashboardLayout>
  );
};

export default Products;