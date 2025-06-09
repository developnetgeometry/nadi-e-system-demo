import React, { useState, useMemo } from "react";
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
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/ui/PaginationComponent";
import { exportToCSV } from "@/utils/export-utils";
import { Eye } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import ClaimStatusDescriptionDialog from "../component/ClaimStatusLegend";
import { useFetchClaimDUSP } from "./hooks/fetch-claim-dusp";
import { useNavigate } from "react-router-dom";

export function ClaimListDusp() {
  const { data: claimDUSPData, isLoading: isClaimDUSPLoading } = useFetchClaimDUSP();
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedClaim, setSelectedClaim] = useState<number | null>(null);
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string>("year");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter states
  const [search, setSearch] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleOpenDescriptionDialog = (status: string) => {
    setSelectedStatus(status);
    setIsDescriptionDialogOpen(true);
  };

  const handleView = (claimId: number) => {
    navigate(`/claim/report?id=${claimId}`);
  };

  const handleExport = () => {
    if (!filteredClaims) return;

    const exportData = filteredClaims.map((claim) => ({
      TP: claim.tp_dusp_id.name,
      ReferenceNumber: claim.ref_no,
      Year: claim.year,
      Month: claim.month
        ? new Date(0, claim.month - 1).toLocaleString("default", { month: "long" })
        : "N/A",
      Status: claim.claim_status.name,
      PaymentStatus: claim.payment_status ? "Paid" : "Unpaid",
    }));

    exportToCSV(exportData, `claim_list_dusp_${new Date().toISOString().split("T")[0]}`);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredClaims = useMemo(() => {
    let claims = claimDUSPData?.filter((claim) => {
      return (
        (!search ||
          claim.tp_dusp_id.name?.toLowerCase().includes(search.toLowerCase()) ||
          claim.ref_no?.toLowerCase().includes(search.toLowerCase())) &&
        (!filterYear || claim.year?.toString() === filterYear) &&
        (!filterMonth ||
          (claim.month &&
            new Date(0, claim.month - 1)
              .toLocaleString("default", { month: "long" })
              .includes(filterMonth))) &&
        (!filterStatus || claim.claim_status.name === filterStatus) &&
        (!filterPaymentStatus ||
          (filterPaymentStatus === "Paid" && claim.payment_status) ||
          (filterPaymentStatus === "Unpaid" && !claim.payment_status))
      );
    }) ?? [];

    // Sorting
    if (sortField) {
      claims = [...claims].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        if (sortField === "status") {
          aValue = a.claim_status.name;
          bValue = b.claim_status.name;
        }
        if (sortField === "tp") {
          aValue = a.tp_dusp_id.name;
          bValue = b.tp_dusp_id.name;
        }
        if (aValue === undefined || bValue === undefined) return 0;
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return sortOrder === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
    }

    return claims;
  }, [claimDUSPData, search, filterYear, filterMonth, filterStatus, filterPaymentStatus, sortField, sortOrder]);

  const paginatedClaims = useMemo(() => {
    return filteredClaims?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredClaims, currentPage, itemsPerPage]);

  const totalPages = Math.ceil((filteredClaims?.length || 0) / itemsPerPage);

  if (isClaimDUSPLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DRAFTED":
        return "default";
      case "SUBMITTED":
        return "info";
      case "PROCESSING":
        return "warning";
      case "COMPLETED":
        return "success";
      default:
        return "secondary";
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  return (
    <div className="rounded-md border p-4 space-y-4">
      <h2 className="text-xl font-bold">Claim List (DUSP)</h2>

      {/* Search and Export */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by TP or Reference Number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mr-4"
        />
        <Button variant="outline" onClick={handleExport}>
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Year Filter */}
        <Select onValueChange={(value) => setFilterYear(value === "all" ? null : value)} value={filterYear || "all"}>
          <SelectTrigger className="w-[200px]">
            <span>Filter by Year</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {[...new Set(claimDUSPData?.map((claim) => claim.year))].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month Filter */}
        <Select onValueChange={(value) => setFilterMonth(value === "all" ? null : value)} value={filterMonth || "all"}>
          <SelectTrigger className="w-[200px]">
            <span>Filter by Month</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.label}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select onValueChange={(value) => setFilterStatus(value === "all" ? null : value)} value={filterStatus || "all"}>
          <SelectTrigger className="w-[200px]">
            <span>Filter by Status</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {[...new Set(claimDUSPData?.map((claim) => claim.claim_status.name))].map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Payment Status Filter */}
        <Select onValueChange={(value) => setFilterPaymentStatus(value === "all" ? null : value)} value={filterPaymentStatus || "all"}>
          <SelectTrigger className="w-[200px]">
            <span>Filter by Payment Status</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Statuses</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">No.</TableHead>
            <TableHead sortable
              sorted={sortField === "tp" ? sortOrder : null}
              onSort={() => handleSort("tp")}>TP Name</TableHead>
            <TableHead sortable
              sorted={sortField === "ref_no" ? sortOrder : null}
              onSort={() => handleSort("ref_no")}>Reference Number</TableHead>
            <TableHead sortable
              sorted={sortField === "year" ? sortOrder : null}
              onSort={() => handleSort("year")}>Year</TableHead>
            <TableHead sortable
              sorted={sortField === "month" ? sortOrder : null}
              onSort={() => handleSort("month")}>Month</TableHead>
            <TableHead sortable
              sorted={sortField === "status" ? sortOrder : null}
              onSort={() => handleSort("status")}>Status</TableHead>
            <TableHead sortable
              sorted={sortField === "payment_status" ? sortOrder : null}
              onSort={() => handleSort("payment_status")}>Payment Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedClaims?.length > 0 ? (
            paginatedClaims.map((claim, index) => (
              <TableRow key={claim.id}>
                <TableCell className="text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{claim.tp_dusp_id.name}</TableCell>
                <TableCell>{claim.ref_no}</TableCell>
                <TableCell>{claim.year}</TableCell>
                <TableCell>
                  {claim.month
                    ? new Date(0, claim.month - 1).toLocaleString("default", { month: "long" })
                    : "N/A"}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Badge className="min-w-[6rem] text-center" variant={getStatusBadgeVariant(claim.claim_status.name)}>
                    {claim.claim_status.name}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full p-0 w-6 h-6 flex items-center justify-center"
                    onClick={() => handleOpenDescriptionDialog(claim.claim_status.name)}
                  >
                    i
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge variant={claim.payment_status ? "success" : "warning"}>
                    {claim.payment_status ? "Paid" : "Unpaid"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => handleView(claim.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View</TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredClaims?.length || 0}
        />
      )}

      {/* Claim Status Description Dialog */}
      <ClaimStatusDescriptionDialog
        isOpen={isDescriptionDialogOpen}
        onClose={() => setIsDescriptionDialogOpen(false)}
        status={selectedStatus}
      />

    </div>
  );
}