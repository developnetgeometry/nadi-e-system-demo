import { Button } from "@/components/ui/button";
import { useInventories } from "@/hooks/use-inventories";
import { useOrganizations } from "@/hooks/use-organizations";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { Inventory } from "@/types/inventory";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchSites } from "../site/hook/site-utils";
import { Input } from "../ui/input";
import { PaginationComponent } from "../ui/PaginationComponent";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { InventoryDeleteDialog } from "./InventoryDeleteDialog";
import { InventoryDetailsDialog } from "./InventoryDetailsDialog";
import { InventoryFormDialog } from "./InventoryFormDialog";
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
import { Download, Search, Settings, Trash2, Filter, RotateCcw, Building, Box, CheckCircle, Check, ChevronsUpDown, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";


interface InventoryListProps {
  inventories: Inventory[];
  isLoadingInventories: boolean;
  refetch: () => void;
}
export const InventoryList = ({
  inventories,
  isLoadingInventories,
  refetch,
}: InventoryListProps) => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPUser =
    parsedMetadata?.user_group_name === "TP" &&
    !!parsedMetadata?.organization_id;
  const isDUSPUser =
    parsedMetadata?.user_group_name === "DUSP" &&
    !!parsedMetadata?.organization_id;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    (isTPUser || isDUSPUser) &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;
  const isTPSiteUser =
    parsedMetadata?.user_type === "tp_site";

  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { useInventoryTypesQuery } = useInventories();

  const { useOrganizationsByTypeQuery } = useOrganizations();

  const { data: dusps = [], isLoading: isLoadingDusps } =
    useOrganizationsByTypeQuery("dusp", isSuperAdmin);

  const { data: tps = [], isLoading: isLoadingTPs } =
    useOrganizationsByTypeQuery(
      "tp",
      isSuperAdmin || isDUSPUser,
      organizationId
    );

  const { data: sites = [], isLoading: isLoadingSites } = useQuery({
    queryKey: ["sites", organizationId],
    queryFn: () => fetchSites(organizationId, isTPUser, isDUSPUser, isTPSiteUser),
    enabled: !!organizationId || isSuperAdmin || isDUSPUser || isTPUser || isTPSiteUser,
  });

  const [searchInventory, setSearchInventory] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  // Selected filters (pending application)
  const [selectedItemFilters, setSelectedItemFilters] = useState<string[]>([]);
  const [selectedTPFilters, setSelectedTPFilters] = useState<string[]>([]);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<string[]>([]);
  const [selectedSiteFilters, setSelectedSiteFilters] = useState<string[]>([]);

  // Applied filters (used in actual filtering)
  const [appliedItemFilters, setAppliedItemFilters] = useState<string[]>([]);
  const [appliedTPFilters, setAppliedTPFilters] = useState<string[]>([]);
  const [appliedStatusFilters, setAppliedStatusFilters] = useState<string[]>([]);
  const [appliedSiteFilters, setAppliedSiteFilters] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleResetFilters = () => {
    setSearchInventory("");
    setSelectedItemFilters([]);
    setSelectedTPFilters([]);
    setSelectedSiteFilters([]);
    setSelectedStatusFilters([]);
    setAppliedItemFilters([]);
    setAppliedTPFilters([]);
    setAppliedStatusFilters([]);
    setAppliedSiteFilters([]);
    setSortField(null);
    setSortDirection(null);
  };

  const hasActiveFilters = 
    appliedItemFilters.length > 0 ||
    appliedTPFilters.length > 0 ||
    appliedSiteFilters.length > 0 ||
    appliedStatusFilters.length > 0;

  const handleInventoryChange = (value: string) => {
    setSearchInventory(value || "");
  };

  const { data: inventoryTypes = [], isLoading: isLoadingInventoryType } = useQuery({
    queryKey: ['inventory-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nd_inventory_type')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoadingInventories || isLoadingInventoryType) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const filteredInventories = (inventories ?? [])
  .filter((inventory) => {
    // Search filter
    if (searchInventory) {
      const searchLower = searchInventory.toLowerCase();
      const nameMatch = inventory.name?.toLowerCase().includes(searchLower);
      const typeMatch = inventory.type?.name?.toLowerCase().includes(searchLower);
      const siteMatch = inventory.site?.sitename?.toLowerCase().includes(searchLower);
      const quantityMatch = inventory.quantity?.toString().includes(searchInventory);
      
      if (!(nameMatch || typeMatch || siteMatch || quantityMatch)) {
        return false;
      }
    }

    // Item filter
    const itemMatch = appliedItemFilters.length > 0 
      ? appliedItemFilters.includes(inventory.name || "")
      : true;
    
    // TP filter (for TP DUSP display)
    const tpMatch = appliedTPFilters.length > 0
      ? appliedTPFilters.includes(inventory.site?.dusp_tp_id_display || "")
      : true;

    // Site filter (for site names)
    const siteMatch = appliedSiteFilters.length > 0
      ? appliedSiteFilters.includes(inventory.site?.sitename || "")
      : true;
    
    const statusMatch = appliedStatusFilters.length > 0
      ? appliedStatusFilters.includes("Active")
      : true;

    return itemMatch && tpMatch && siteMatch && statusMatch;
  })
  .sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    
    let valueA, valueB;
    
    switch (sortField) {
      case "name":
        valueA = a.name || "";
        valueB = b.name || "";
        break;
      case "quantity":
        valueA = a.quantity || 0;
        valueB = b.quantity || 0;
        break;
      case "type":
        valueA = a.type?.name || "";
        valueB = b.type?.name || "";
        break;
      case "site":
        valueA = a.site?.sitename || "";
        valueB = b.site?.sitename || "";
        break;
      case "tp":
        valueA = a.site?.dusp_tp_id_display || "";
        valueB = b.site?.dusp_tp_id_display || "";
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

  const paginatedInventories = filteredInventories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInventories.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    filteredInventories.length
  );

  const exportAssetsAsCSV = (inventories: Inventory[]) => {
    if (!inventories || inventories.length === 0) {
      console.warn("No inventories to export.");
      return;
    }

    const headers = [
      "No.",
      "Name",
      "Type",
      "Price",
      "Quantity",
      "Description",
      "NADI Centre",
    ];

    if (isSuperAdmin) {
      const insertIndex = headers.indexOf("NADI Centre");
      headers.splice(insertIndex, 0, "TP (DUSP)");
    }

    // Convert inventories to rows
    const rows = inventories.map((inventory, index) => {
      const row = [
        index + 1,
        inventory.name,
        inventory.type?.name ?? "",
        inventory.price ?? "",
        inventory.quantity ?? "",
        inventory.description ?? "",
        // we'll insert "TP (DUSP)" before sitename if isSuperAdmin is true
        inventory.site?.sitename ?? "",
      ];

      if (isSuperAdmin) {
        const insertIndex = row.length - 1; // before "NADI Centre"
        row.splice(insertIndex, 0, inventory.site?.dusp_tp_id_display ?? "");
      }

      return row;
    });
    const csvContent = [headers, ...rows]
      .map((e) => e.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const handleExportInventories = () => {
    const csvContent = exportAssetsAsCSV(filteredInventories);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventories.csv");
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button
          className="flex items-center gap-2 h-10"
          disabled={isLoadingSites}
          onClick={handleExportInventories}
        >
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            value={searchInventory}
            onChange={(e) => handleInventoryChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Item Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <Box className="h-4 w-4 text-gray-500" />
                Item
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search items..." />
                <CommandList>
                  <CommandEmpty>No items found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {inventories && Array.from(
                      new Set(inventories.map(inv => inv.name).filter(Boolean))
                    ).sort().map((itemName) => (
                      <CommandItem
                        key={itemName}
                        onSelect={() => {
                          setSelectedItemFilters(
                            selectedItemFilters.includes(itemName)
                              ? selectedItemFilters.filter(item => item !== itemName)
                              : [...selectedItemFilters, itemName]
                          );
                        }}
                      >
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                          selectedItemFilters.includes(itemName)
                            ? "bg-primary border-primary"
                            : "opacity-50"
                        )}>
                          {selectedItemFilters.includes(itemName) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {itemName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* TP (DUSP) Filter - For super admin and DUSP users */}
          {(isSuperAdmin || isDUSPUser) && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10"
                >
                  <Building className="h-4 w-4 text-gray-500" />
                  TP (DUSP)
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0">
                <Command>
                  <CommandInput placeholder="Search TP (DUSP)..." />
                  <CommandList>
                    <CommandEmpty>No TP (DUSP) found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {inventories && Array.from(
                        new Set(inventories.map(inv => inv.site?.dusp_tp_id_display).filter(Boolean))
                      ).sort().map((tpName) => (
                        <CommandItem
                          key={tpName}
                          onSelect={() => {
                            setSelectedTPFilters(
                              selectedTPFilters.includes(tpName)
                                ? selectedTPFilters.filter(item => item !== tpName)
                                : [...selectedTPFilters, tpName]
                            );
                          }}
                        >
                          <div className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                            selectedTPFilters.includes(tpName)
                              ? "bg-primary border-primary"
                              : "opacity-50"
                          )}>
                            {selectedTPFilters.includes(tpName) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          {tpName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {/* Site Filter - For super admin, DUSP users, and TP users */}
          {(isSuperAdmin || isDUSPUser || isTPUser  || isTPSiteUser) && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10"
                >
                  <Building className="h-4 w-4 text-gray-500" />
                  Site
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0">
                <Command>
                  <CommandInput placeholder="Search sites..." />
                  <CommandList>
                    <CommandEmpty>No sites found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {inventories && Array.from(
                        new Set(inventories.map(inv => inv.site?.sitename).filter(Boolean))
                      ).sort().map((siteName) => (
                        <CommandItem
                          key={siteName}
                          onSelect={() => {
                            setSelectedSiteFilters(
                              selectedSiteFilters.includes(siteName)
                                ? selectedSiteFilters.filter(item => item !== siteName)
                                : [...selectedSiteFilters, siteName]
                            );
                          }}
                        >
                          <div className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                            selectedSiteFilters.includes(siteName)
                              ? "bg-primary border-primary"
                              : "opacity-50"
                          )}>
                            {selectedSiteFilters.includes(siteName) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          {siteName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {/* Status Filter */}
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <CheckCircle className="h-4 w-4 text-gray-500" />
                Status
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search status..." />
                <CommandList>
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {["Active", "Inactive", "Out of Stock"].map((statusName) => (
                      <CommandItem
                        key={statusName}
                        onSelect={() => {
                          setSelectedStatusFilters(
                            selectedStatusFilters.includes(statusName)
                              ? selectedStatusFilters.filter(item => item !== statusName)
                              : [...selectedStatusFilters, statusName]
                          );
                        }}
                      >
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                          selectedStatusFilters.includes(statusName)
                            ? "bg-primary border-primary"
                            : "opacity-50"
                        )}>
                          {selectedStatusFilters.includes(statusName) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {statusName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover> */}

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
            setAppliedItemFilters(selectedItemFilters);
            setAppliedTPFilters(selectedTPFilters);
            setAppliedSiteFilters(selectedSiteFilters);
            setAppliedStatusFilters(selectedStatusFilters);
          }}
        >
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center mb-4">
          {appliedItemFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>Item: {appliedItemFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedItemFilters([]);
                  setSelectedItemFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedTPFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>TP: {appliedTPFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedTPFilters([]);
                  setSelectedTPFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedSiteFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>Site: {appliedSiteFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedSiteFilters([]);
                  setSelectedSiteFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedStatusFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>Status: {appliedStatusFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedStatusFilters([]);
                  setSelectedStatusFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      <div className="rounded-md border">
        {isLoadingInventories ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Site Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Item Name
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
                  onClick={() => handleSort("quantity")}
                >
                  <div className="flex items-center">
                    Quantity
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
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Type
                    {sortField === "type" ? (
                      <span className="ml-2">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    ) : (
                      <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </TableHead>
                {isSuperAdmin && (
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("tp")}
                  >
                    <div className="flex items-center">
                      TP (DUSP)
                      {sortField === "tp" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                )}
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("site")}
                >
                  <div className="flex items-center">
                    Site Name
                    {sortField === "site" ? (
                      <span className="ml-2">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    ) : (
                      <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInventories &&
                paginatedInventories.map((inventory, index) => {
                  const requestDate = inventory.created_at
                    ? inventory.created_at.split("T")[0]
                    : "";

                  return (
                    <TableRow key={inventory.id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{inventory?.name || ""}</TableCell>
                      <TableCell>{inventory?.quantity || "0"}</TableCell>
                      <TableCell>{inventory?.type?.name || ""}</TableCell>
                      {isSuperAdmin && (
                        <TableCell>
                          {inventory?.site?.dusp_tp_id_display || "N/A"}
                        </TableCell>
                      )}
                      <TableCell>{inventory?.site.sitename || ""}</TableCell>
                      <TableCell>{"Status"}</TableCell>
                      <TableCell>{requestDate || ""}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setIsEditDialogOpen(true);
                              setSelectedItem(inventory);
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              setIsDeleteDialogOpen(true);
                              setSelectedItem(inventory);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setIsViewDetailsDialogOpen(true);
                              setSelectedItem(inventory);
                            }}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </div>
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startItem={startItem}
          endItem={endItem}
          totalItems={filteredInventories.length}
        />
      )}

      <InventoryDetailsDialog
        open={isViewDetailsDialogOpen}
        onOpenChange={setIsViewDetailsDialogOpen}
        inventory={selectedItem}
      />
      {isEditDialogOpen && (
        <InventoryFormDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) refetch();
          }}
          inventory={selectedItem}
        />
      )}
      {isDeleteDialogOpen && (
        <InventoryDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) refetch();
          }}
          inventory={selectedItem}
        />
      )}
    </div>
  );
};
