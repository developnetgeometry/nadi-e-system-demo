import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Download,
  Trash2,
  FileText,
  View,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar2 } from "@/components/ui/calendar-2";

export interface Column {
  key: string | ((row: any, index: number) => any); // Dynamic key or accessor function
  header: string;
  width?: string; // Optional column width
  render?: (value: any, row: any, index: number) => React.ReactNode; // Custom cell renderer
  filterable?: boolean; // Indicates if the column is filterable
  visible?: boolean; // Indicates if the column is visible (default: true)
  filterType?: "string" | "number" | "date"; // Type of filter (default: string)
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (row: any) => void;
  pageSize?: number;
  onRowClick?: (row: any) => void;
  onDelete?: (row: any) => void;
  onExport?: () => void;
  onViewDetails?: (row: any) => void;
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data = [],
  columns = [],
  pageSize = 10,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  } | null>(null);
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: any[] }>(
    {}
  );

  const visibleColumns = columns.filter((column) => column.visible !== false);

  const filteredData = data
    .filter((row) =>
      columns.every((column) => {
        const cellValue =
          typeof column.key === "function"
            ? column.key(row, 0)
            : row[column.key];

        const filterValues = columnFilters[column.key as string] || [];
        if (filterValues.length > 0 && cellValue != null) {
          switch (column.filterType) {
            case "number":
              return filterValues.every((filterValue, index) => {
                if (index === 0 && filterValue !== "") {
                  return cellValue >= Number(filterValue);
                }
                if (index === 1 && filterValue !== "") {
                  return cellValue <= Number(filterValue);
                }
                return true;
              });
            case "date":
              return filterValues.every((filterValue, index) => {
                if (index === 0 && filterValue !== "") {
                  return new Date(cellValue) >= new Date(filterValue);
                }
                if (index === 1 && filterValue !== "") {
                  return new Date(cellValue) <= new Date(filterValue);
                }
                return true;
              });
            case "string":
            default:
              return filterValues.some((filterValue) =>
                cellValue
                  .toString()
                  .toLowerCase()
                  .includes(filterValue.toLowerCase())
              );
          }
        }
        return true;
      })
    )
    .filter((row) =>
      visibleColumns.some((column) => {
        const cellValue =
          typeof column.key === "function"
            ? column.key(row, 0)
            : row[column.key];
        return cellValue
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
    );

  const sortedData = React.useMemo(() => {
    if (!sortConfig || !sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue =
        typeof sortConfig.key === "string" ? a[sortConfig.key] : null;
      const bValue =
        typeof sortConfig.key === "string" ? b[sortConfig.key] : null;

      if (aValue == null || bValue == null) return 0;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const currentData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (rowToDelete) {
      setIsDeleteLoading(true);
      try {
        // Simulate delete action
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error("Error deleting item");
      } finally {
        setIsDeleteLoading(false);
        setDeleteDialogOpen(false);
        setRowToDelete(null);
      }
    }
  };

  const handleExport = () => {
    const headers = columns.map((col) => col.header).join(",");
    const rows = filteredData
      .map((row) =>
        columns
          .map((col) => {
            if (typeof col.key === "function") {
              return col.key(row, data.indexOf(row));
            }
            return row[col.key];
          })
          .join(",")
      )
      .join("\n");

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCellValue = (column: Column, row: any, index: number) => {
    if (typeof column.key === "function") {
      return column.key(row, index);
    }
    return row[column.key];
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return null; // Reset to default
        return { key, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (sortDirection: "asc" | "desc" | null) => {
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 text-gray-500 ml-2" />;
    } else if (sortDirection === "desc") {
      return <ArrowUp className="h-4 w-4 rotate-180 text-gray-500 ml-2" />;
    } else {
      return null; // No icon for unsorted columns
    }
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    setColumnFilters((prev) => {
      const currentValues = prev[key] || [];

      if (Array.isArray(value)) {
        // For range-based filters (number, date)
        return { ...prev, [key]: value };
      } else {
        if (currentValues.includes(value)) {
          // Remove the value if it already exists
          return { ...prev, [key]: currentValues.filter((v: string) => v !== value) };
        } else {
          // Add the value if it doesn't exist
          return { ...prev, [key]: [...currentValues, value] };
        }
      }
    });
    setCurrentPage(1); // Reset to the first page whenever a filter is applied
  };

  const clearAllFilters = () => {
    setColumnFilters({});
    setSearchQuery("");
    setSortConfig(null); // Reset the sorting configuration
  };

  const renderFilterIndicator = (columnKey: string) => {
    return columnFilters[columnKey] ? (
      <span className="ml-2 text-xs text-blue-500">(Filtered)</span>
    ) : null;
  };

  const renderFilterUI = (column: Column) => {
    const filterValues = columnFilters[column.key as string] || [];

    switch (column.filterType) {
      case "number":
        return (
          <div className="flex flex-col gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filterValues[0] || ""}
              onChange={(e) =>
                handleFilterChange(column.key as string, [e.target.value, filterValues[1]])
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={filterValues[1] || ""}
              onChange={(e) =>
                handleFilterChange(column.key as string, [filterValues[0], e.target.value])
              }
            />
          </div>
        );
      case "date":
        return (
          <div
            className="flex flex-col items-center p-1 border rounded-md shadow-md bg-white"
            style={{ width: "fit-content", height: "fit-content" }}
          >
            <Calendar2
              mode="range"
              selected={{
                from: filterValues[0] ? new Date(filterValues[0]) : undefined,
                to: filterValues[1] ? new Date(filterValues[1]) : undefined,
              }}
              onSelect={({ from, to }) =>
                handleFilterChange(column.key as string, [
                  from ? `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}` : "",
                  to ? `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, "0")}-${String(to.getDate()).padStart(2, "0")}` : "",
                ])
              }
              initialFocus
              className="p-3 pointer-events-auto w-full"
            />
          </div>
        );
      case "string":
      default:
        return (
          <Command>
            <CommandInput placeholder={`Search ${column.header}...`} />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {[...new Set(data.map((row) => row[column.key as string]))]
                  .filter((value) => value != null)
                  .map((value) => (
                    <CommandItem
                      key={value}
                      onSelect={() =>
                        handleFilterChange(column.key as string, value)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={filterValues.includes(value)}
                        readOnly
                        className="mr-2"
                      />
                      {value}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        );
    }
  };

  const isFilterApplied =
    Object.keys(columnFilters).length > 0 ||
    sortConfig !== null ||
    searchQuery.trim() !== "";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          {columns.map((column) =>
            column.filterable ? (
              <Popover key={column.key as string}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Filter {column.header}
                    {columnFilters[column.key as string]?.length > 0 && (
                      <span className="text-blue-500">
                        (Filtered: {columnFilters[column.key as string].join(", ")})
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0">
                  {renderFilterUI(column)}
                </PopoverContent>
              </Popover>
            ) : null
          )}
        </div>
        <div className="flex gap-2">
          {isFilterApplied && (
            <Button
              onClick={clearAllFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Clear Filters
            </Button>
          )}
          <Button
            onClick={handleExport}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                {visibleColumns.map((column, colIndex) => (
                  <TableHead
                    key={colIndex}
                    style={{ width: column.width }}
                    className="py-3 px-6 text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() =>
                      handleSort(typeof column.key === "string" ? column.key : "")
                    }
                  >
                    <div className="flex items-center">
                      {column.header}
                      {renderSortIcon(
                        sortConfig?.key === column.key
                          ? sortConfig.direction
                          : null
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                      <span className="text-gray-500">Loading data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className={`border-t border-gray-100 ${
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {visibleColumns.map((column, colIndex) => (
                      <TableCell
                        key={`${rowIndex}-${colIndex}`}
                        className="py-4 px-6 text-sm text-gray-900"
                      >
                        {column.render
                          ? column.render(
                              getCellValue(column, row, rowIndex),
                              row,
                              rowIndex
                            )
                          : getCellValue(column, row, rowIndex)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {filteredData.length > pageSize && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0 border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={`h-9 w-9 p-0 ${
                  currentPage === page ? "bg-blue-600" : "border-gray-200"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0 border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
