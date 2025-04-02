import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/ui/PaginationComponent";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAssets } from "@/hooks/use-assets";

export const AssetDetailsList = () => {
  const { useAssetsQuery, useAssetTypesQuery } = useAssets();

  const { data: assets, isLoading, error } = useAssetsQuery();
  console.log("assets", assets);

  // Hooks must be called unconditionally
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<number | string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: assetTypes = [], isLoading: isLoadingAssetType } =
    useAssetTypesQuery();

  if (error) {
    console.error("Error fetching assets:", error);
    return <div>Error fetching assets</div>;
  }

  const filteredAssets = assets
    .filter((asset) => asset.name.toLowerCase().includes(filter.toLowerCase()))
    .filter((asset) => (typeFilter ? asset.type.id === typeFilter : true));

  const paginatedSites = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredAssets.length);

  return (
    <div className="space-y-4">
      <div className="relative mb-4 flex space-x-4">
        <Input
          placeholder="Search asset.."
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
            {assetTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-md border">
        {isLoading ? (
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
              {paginatedSites.map((asset, index) => {
                return (
                  <TableRow key={asset.id}>
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{asset?.name || ""}</TableCell>
                    <TableCell>{asset?.type.name || ""}</TableCell>
                    <TableCell>{asset?.qty_unit || ""}</TableCell>
                    <TableCell>{asset?.location_id || ""}</TableCell>
                    <TableCell>{asset?.created_at || ""}</TableCell>
                    <TableCell>
                      {asset?.is_active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => {}}>
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
          totalItems={filteredAssets.length}
        />
      )}

      {/* <SiteFormDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        asset={siteToEdit} // Pass the asset to edit
      /> */}
    </div>
  );
};
