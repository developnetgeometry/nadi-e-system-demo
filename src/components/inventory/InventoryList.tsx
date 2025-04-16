import { Button } from "@/components/ui/button";
import { useInventories } from "@/hooks/use-inventories";
import { useOrganizations } from "@/hooks/use-organizations";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { Inventory } from "@/types/inventory";
import { useQuery } from "@tanstack/react-query";
import { Search, Table } from "lucide-react";
import { useState } from "react";
import { fetchSites } from "../site/component/site-utils";
import { Input } from "../ui/input";
import { PaginationComponent } from "../ui/PaginationComponent";
import { Skeleton } from "../ui/skeleton";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { InventoryDetailsDialog } from "./InventoryDetailsDialog";

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
      </div>
      <div className="rounded-md border">
        {isLoadingSites ? (
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
                <TableHead>Nadi Center</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInventories.map((inventory, index) => {
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
                    <TableCell>{inventory?.site.sitename || ""}</TableCell>
                    <TableCell>{requestDate || ""}</TableCell>
                    <TableCell>{"Status"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsViewDetailsDialogOpen(true);
                            setSelectedItem(inventory);
                          }}
                        >
                          View Detail
                        </Button>
                        <Button variant="default" onClick={() => {}}>
                          Generate Report
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
    </div>
  );
};
