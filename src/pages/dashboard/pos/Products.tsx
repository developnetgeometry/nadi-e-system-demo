import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import { FileDown, Filter, Search, Check, Edit, ChevronsUpDown, RotateCcw, X, Package, Box, FileText } from "lucide-react";
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

  // Sorting states
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  // Selected filters (pending application)
  const [selectedProductIdFilters, setSelectedProductIdFilters] = useState<string[]>([]);
  const [selectedNameFilters, setSelectedNameFilters] = useState<string[]>([]);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<string[]>([]);
  const [selectedPriceFilters, setSelectedPriceFilters] = useState<string[]>([]);
  const [selectedStockFilters, setSelectedStockFilters] = useState<string[]>([]);
  const [selectedBarcodeFilters, setSelectedBarcodeFilters] = useState<string[]>([]);

  // Applied filters (used in actual filtering)
  const [appliedProductIdFilters, setAppliedProductIdFilters] = useState<string[]>([]);
  const [appliedNameFilters, setAppliedNameFilters] = useState<string[]>([]);
  const [appliedCategoryFilters, setAppliedCategoryFilters] = useState<string[]>([]);
  const [appliedPriceFilters, setAppliedPriceFilters] = useState<string[]>([]);
  const [appliedStockFilters, setAppliedStockFilters] = useState<string[]>([]);
  const [appliedBarcodeFilters, setAppliedBarcodeFilters] = useState<string[]>([]);

  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPUser =
    parsedMetadata?.user_group_name === "TP" &&
    !!parsedMetadata?.organization_id;

  const formatProductId = (item) => {
    const date = new Date(item.created_at);
    const timestamp = Math.floor(date.getTime() / 1000); // Unix timestamp
    return `p${timestamp}`;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedProductIdFilters([]);
    setSelectedNameFilters([]);
    setSelectedCategoryFilters([]);
    setSelectedPriceFilters([]);
    setSelectedStockFilters([]);
    setSelectedBarcodeFilters([]);
    setAppliedProductIdFilters([]);
    setAppliedNameFilters([]);
    setAppliedCategoryFilters([]);
    setAppliedPriceFilters([]);
    setAppliedStockFilters([]);
    setAppliedBarcodeFilters([]);
    setSortField(null);
    setSortDirection(null);
    
    toast({
      title: "Filters reset",
      description: "All filters have been cleared.",
    });
  };

  const hasActiveFilters = 
    appliedProductIdFilters.length > 0 ||
    appliedNameFilters.length > 0 ||
    appliedCategoryFilters.length > 0 ||
    appliedPriceFilters.length > 0 ||
    appliedStockFilters.length > 0 ||
    appliedBarcodeFilters.length > 0;

  const getActiveFilterCount = () => {
    return (
      appliedProductIdFilters.length +
      appliedNameFilters.length +
      appliedCategoryFilters.length +
      appliedPriceFilters.length +
      appliedStockFilters.length +
      appliedBarcodeFilters.length
    );
  };

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
    if (!inventories) {
      setFilteredInventories([]);
      return;
    }

    let filtered = [...inventories];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const productIdMatch = formatProductId(item).toLowerCase().includes(searchLower);
        const nameMatch = item.name?.toLowerCase().includes(searchLower);
        const typeMatch = item.type?.name?.toLowerCase().includes(searchLower);
        const categoryMatch = item.category?.name?.toLowerCase().includes(searchLower);
        const barcodeMatch = item.barcode?.toLowerCase().includes(searchLower);
        const priceMatch = item.price?.toString().includes(searchTerm);
        const stockMatch = item.quantity?.toString().includes(searchTerm);

        return productIdMatch || nameMatch || typeMatch || barcodeMatch || categoryMatch || priceMatch || stockMatch;
      });
    }

    // Apply dropdown filters
    filtered = filtered.filter(item => {
      const productIdMatch = appliedProductIdFilters.length > 0
        ? appliedProductIdFilters.includes(formatProductId(item))
        : true;
      
      const nameMatch = appliedNameFilters.length > 0
        ? appliedNameFilters.includes(item.name || "")
        : true;
      
      const categoryMatch = appliedCategoryFilters.length > 0
        ? appliedCategoryFilters.includes(item.category?.name || "")
        : true;
      
      const priceMatch = appliedPriceFilters.length > 0
        ? appliedPriceFilters.includes(item.price?.toFixed(2) || "")
        : true;
      
      const stockMatch = appliedStockFilters.length > 0
        ? appliedStockFilters.includes(item.quantity?.toString() || "")
        : true;
      
      const barcodeMatch = appliedBarcodeFilters.length > 0
        ? appliedBarcodeFilters.includes(item.barcode || "")
        : true;

      return productIdMatch && nameMatch && categoryMatch && priceMatch && stockMatch && barcodeMatch;
    });

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let valueA, valueB;

        switch (sortField) {
          case "productId":
            valueA = formatProductId(a);
            valueB = formatProductId(b);
            break;
          case "name":
            valueA = a.name || "";
            valueB = b.name || "";
            break;
          case "category":
            valueA = a.category?.name || "";
            valueB = b.category?.name || "";
            break;
          case "price":
            valueA = a.price || 0;
            valueB = b.price || 0;
            break;
          case "quantity":
            valueA = a.quantity || 0;
            valueB = b.quantity || 0;
            break;
          case "barcode":
            valueA = a.barcode || "";
            valueB = b.barcode || "";
            break;
          case "created_at":
            valueA = new Date(a.created_at);
            valueB = new Date(b.created_at);
            break;
          default:
            valueA = a[sortField] || "";
            valueB = b[sortField] || "";
        }

        if (sortDirection === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }
    
    setFilteredInventories(filtered);
  }, [inventories, searchTerm, appliedProductIdFilters, appliedNameFilters, appliedCategoryFilters, appliedPriceFilters, appliedStockFilters, appliedBarcodeFilters, sortField, sortDirection]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your inventory</p>
        </div>
      </div>

      {/* Search and Filter Section */}
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

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Product ID Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <FileText className="h-4 w-4 text-gray-500" />
                Product ID
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search product IDs..." />
                <CommandList>
                  <CommandEmpty>No product IDs found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {inventories && Array.from(
                      new Set(inventories.map(item => formatProductId(item)))
                    ).sort().map((productId) => (
                      <CommandItem
                        key={productId}
                        onSelect={() => {
                          setSelectedProductIdFilters(
                            selectedProductIdFilters.includes(productId)
                              ? selectedProductIdFilters.filter(item => item !== productId)
                              : [...selectedProductIdFilters, productId]
                          );
                        }}
                      >
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                          selectedProductIdFilters.includes(productId)
                            ? "bg-primary border-primary"
                            : "opacity-50"
                        )}>
                          {selectedProductIdFilters.includes(productId) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {productId}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Product Name Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <Package className="h-4 w-4 text-gray-500" />
                Name
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search names..." />
                <CommandList>
                  <CommandEmpty>No names found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {inventories && Array.from(
                      new Set(inventories.map(item => item.name).filter(Boolean))
                    ).sort().map((name) => (
                      <CommandItem
                        key={name}
                        onSelect={() => {
                          setSelectedNameFilters(
                            selectedNameFilters.includes(name)
                              ? selectedNameFilters.filter(item => item !== name)
                              : [...selectedNameFilters, name]
                          );
                        }}
                      >
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                          selectedNameFilters.includes(name)
                            ? "bg-primary border-primary"
                            : "opacity-50"
                        )}>
                          {selectedNameFilters.includes(name) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Category Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <Box className="h-4 w-4 text-gray-500" />
                Category
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandList>
                  <CommandEmpty>No categories found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {inventories && Array.from(
                      new Set(inventories.map(item => item.category?.name).filter(Boolean))
                    ).sort().map((category) => (
                      <CommandItem
                        key={category}
                        onSelect={() => {
                          setSelectedCategoryFilters(
                            selectedCategoryFilters.includes(category)
                              ? selectedCategoryFilters.filter(item => item !== category)
                              : [...selectedCategoryFilters, category]
                          );
                        }}
                      >
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                          selectedCategoryFilters.includes(category)
                            ? "bg-primary border-primary"
                            : "opacity-50"
                        )}>
                          {selectedCategoryFilters.includes(category) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {category}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            className="flex items-center gap-2 h-10"
            onClick={handleResetFilters}
          >
            <RotateCcw className="h-4 w-4 text-gray-500" />
            Reset
          </Button>
        </div>

        <Button
          variant="secondary"
          className="flex items-center gap-2 ml-auto"
          onClick={() => {
            setAppliedProductIdFilters(selectedProductIdFilters);
            setAppliedNameFilters(selectedNameFilters);
            setAppliedCategoryFilters(selectedCategoryFilters);
            setAppliedPriceFilters(selectedPriceFilters);
            setAppliedStockFilters(selectedStockFilters);
            setAppliedBarcodeFilters(selectedBarcodeFilters);

            toast({
              title: "Filters applied",
              description: `${getActiveFilterCount()} filters applied`,
            });
          }}
        >
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center mb-4">
          {appliedProductIdFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>Product ID: {appliedProductIdFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedProductIdFilters([]);
                  setSelectedProductIdFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedNameFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>Name: {appliedNameFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedNameFilters([]);
                  setSelectedNameFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedCategoryFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>Category: {appliedCategoryFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedCategoryFilters([]);
                  setSelectedCategoryFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

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
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("productId")}
                  >
                    <div className="flex items-center">
                      Product ID
                      {sortField === "productId" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Product Name
                      {sortField === "name" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {sortField === "category" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center">
                      Price
                      {sortField === "price" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortField === "quantity" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("barcode")}
                  >
                    <div className="flex items-center">
                      Barcode
                      {sortField === "barcode" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center">
                      Created At
                      {sortField === "created_at" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  {isSuperAdmin && (
                    <TableHead>Action</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventories.length > 0 ? (
                  filteredInventories.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{formatProductId(item)}</TableCell>
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