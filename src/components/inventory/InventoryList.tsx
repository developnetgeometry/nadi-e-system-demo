import { Button } from "@/components/ui/button";
import { useInventories } from "@/hooks/use-inventories";
import { useOrganizations } from "@/hooks/use-organizations";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { Inventory } from "@/types/inventory";
import { useQuery } from "@tanstack/react-query";
import { Download, Search, Settings, Trash2 } from "lucide-react";
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
    queryFn: () => fetchSites(organizationId, isTPUser, isDUSPUser),
    enabled: !!organizationId || isSuperAdmin || isDUSPUser || isTPUser,
  });

  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [duspFilter, setDuspFilter] = useState<string>("");
  const [tpFilter, setTpFilter] = useState<string>("");
  const [siteFilter, setSiteFilter] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: inventoryTypes = [], isLoading: isLoadingInventoryType } =
    useInventoryTypesQuery();

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
    .filter((inventory) =>
      inventory.name.toLowerCase().includes(filter.toLowerCase())
    )
    .filter((inventory) =>
      typeFilter ? String(inventory?.type.id) === String(typeFilter) : true
    )
    .filter((inventory) =>
      duspFilter
        ? String(inventory?.site?.dusp_tp.parent.id) === String(duspFilter)
        : true
    )
    .filter((inventory) =>
      tpFilter ? String(inventory?.site?.dusp_tp_id) === String(tpFilter) : true
    )
    .filter((inventory) =>
      siteFilter ? String(inventory?.site.id) === String(siteFilter) : true
    );

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
      <div className="relative mb-4 flex space-x-4">
        <Input
          placeholder="Search inventory.."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">All</option>
            {inventoryTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        {isSuperAdmin && (
          <div className="relative">
            <select
              value={duspFilter}
              onChange={(e) => setDuspFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isLoadingDusps}
            >
              <option value="">All DUSP</option>
              {dusps.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {(isSuperAdmin || isDUSPUser) && (
          <div className="relative">
            <select
              value={tpFilter}
              onChange={(e) => setTpFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isLoadingTPs}
            >
              <option value="">All TP</option>
              {tps.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {(isSuperAdmin || isDUSPUser || isTPUser) && (
          <div className="relative">
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isLoadingSites}
            >
              <option value="">All Sites</option>
              {sites.map((site) => (
                <option key={site?.id} value={site?.id}>
                  {site?.sitename}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="relative">
          <Button disabled={isLoadingSites} onClick={handleExportInventories}>
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        {isLoadingInventories ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Nadi Center</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
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
                <TableHead>Item Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                {/* Add DUSP TP column for super admin */}
                {isSuperAdmin && <TableHead>TP (DUSP)</TableHead>}
                <TableHead>Nadi Center</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
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
                      <TableCell>{inventory?.type?.name || ""}</TableCell>
                      <TableCell>{inventory?.quantity || ""}</TableCell>
                      {isSuperAdmin && (
                        <TableCell>
                          {inventory?.site?.dusp_tp_id_display || "N/A"}
                        </TableCell>
                      )}
                      <TableCell>{inventory?.site.sitename || ""}</TableCell>
                      <TableCell>{requestDate || ""}</TableCell>
                      <TableCell>{"Status"}</TableCell>
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
