import React, { useState, ReactElement, ReactNode } from "react";
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
  X,
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
import { format } from "date-fns";

export interface Column {
  key: string | ((row: any, index: number) => any); // Dynamic key or accessor function
  header: string | React.ReactNode | any;  // Header text or custom React component
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

// Helper function to extract text from React elements
const getTextFromReactElement = (element: React.ReactNode): string => {
  // If it's a string, return it directly
  if (typeof element === 'string') {
    return element;
  }
  
  // If null or undefined, return empty string
  if (element === null || element === undefined) {
    return '';
  }
  
  // If it's a React element with props
  if (React.isValidElement(element)) {
    // Check for direct text children
    if (typeof element.props.children === 'string') {
      return element.props.children;
    }
    
    // For nested elements, recursively extract text
    if (element.props.children) {
      const extractTextFromChildren = (children: React.ReactNode): string[] => {
        const textParts: string[] = [];
        
        // Handle single child
        if (!Array.isArray(children)) {
          const text = getTextFromReactElement(children);
          if (text) textParts.push(text);
          return textParts;
        }
        
        // Handle array of children
        React.Children.forEach(children, (child) => {
          // Skip null/undefined
          if (child === null || child === undefined) return;
          
          // Direct text nodes
          if (typeof child === 'string') {
            textParts.push(child);
          } 
          // React elements - recursively extract text
          else if (React.isValidElement(child)) {
            const text = getTextFromReactElement(child);
            if (text) textParts.push(text);
          }
        });
        
        return textParts;
      };
      
      const textParts = extractTextFromChildren(element.props.children);
      if (textParts.length > 0) {
        return textParts.join(' ').trim();
      }
    }
  }
  
  // Couldn't extract text
  return '';
};

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
          switch (column.filterType) {            case "number":              // Handle case when only min or max is provided
              const minValue = filterValues[0];
              const maxValue = filterValues[1];
              const numericValue = Number(cellValue);
              const numericMin = minValue !== "" ? Number(minValue) : null;
              const numericMax = maxValue !== "" ? Number(maxValue) : null;
              
              // Check if the cell value is a valid number
              if (isNaN(numericValue)) {
                return false; // Filter out non-numeric values when number filter is applied
              }
              
              // If both min and max are provided
              if (numericMin !== null && numericMax !== null) {
                return numericValue >= numericMin && numericValue <= numericMax;
              }
              // If only min is provided
              else if (numericMin !== null) {
                return numericValue >= numericMin;
              }
              // If only max is provided
              else if (numericMax !== null) {
                return numericValue <= numericMax;
              }
              // If no filter is applied
              return true;
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
  };  // Helper function to escape CSV values
  const escapeCsvValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // If the value contains quotes, commas, or newlines, it needs special handling
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      // Escape quotes by doubling them and wrap in quotes
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };

  const handleExport = () => {
    // Extract header text - handle both string and React elements
    const headers = columns.map((col) => {
      // If header is a string, use it directly
      if (typeof col.header === 'string') {
        return escapeCsvValue(col.header);
      }
      
      // For React elements, try to extract text content
      if (col.header && typeof col.header === 'object') {
        // Extract text from React elements
        const spanContent = getTextFromReactElement(col.header);
        if (spanContent) return escapeCsvValue(spanContent);
        
        // Fallback to column key as header if we can't extract text
        return escapeCsvValue(typeof col.key === 'string' ? col.key : `Column ${columns.indexOf(col) + 1}`);
      }
      
      // Default fallback
      return escapeCsvValue(typeof col.key === 'string' ? col.key : `Column ${columns.indexOf(col) + 1}`);
    }).join(",");
    
    const rows = filteredData
      .map((row) =>
        columns
          .map((col) => {
            let cellValue;
            if (typeof col.key === "function") {
              cellValue = col.key(row, data.indexOf(row));
            } else {
              cellValue = row[col.key];
            }
            return escapeCsvValue(cellValue);
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
  };  const renderFilterUI = (column: Column) => {
    const filterValues = columnFilters[column.key as string] || [];

    switch (column.filterType) {      case "number":
        return (
          <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-gray-500 w-8">Min:</span>
              <Input
                type="number"
                placeholder="Min"
                value={filterValues[0] || ""}
                onChange={(e) => {
                  const newMin = e.target.value;
                  const currentMax = filterValues[1] || "";
                  
                  // Validate: if max exists, ensure min <= max
                  if (currentMax !== "" && newMin !== "" && Number(newMin) > Number(currentMax)) {
                    // If min > max, set max equal to min
                    handleFilterChange(column.key as string, [newMin, newMin]);
                  } else {
                    handleFilterChange(column.key as string, [newMin, currentMax]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
                    handleFilterChange(column.key as string, ["", filterValues[1] || ""]);
                  }
                }}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-gray-500 w-8">Max:</span>
              <Input
                type="number"
                placeholder="Max"
                value={filterValues[1] || ""}
                onChange={(e) => {
                  const currentMin = filterValues[0] || "";
                  const newMax = e.target.value;
                  
                  // Validate: if min exists, ensure max >= min
                  if (currentMin !== "" && newMax !== "" && Number(newMax) < Number(currentMin)) {
                    // If max < min, set min equal to max
                    handleFilterChange(column.key as string, [newMax, newMax]);
                  } else {
                    handleFilterChange(column.key as string, [currentMin, newMax]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
                    handleFilterChange(column.key as string, [filterValues[0] || "", ""]);
                  }
                }}
              />
            </div>
            {(filterValues[0] || filterValues[1]) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => handleFilterChange(column.key as string, ["", ""])}
              >
                Clear
              </Button>
            )}
          </div>
        );case "date":
        return (
          <div className="flex flex-col items-center p-2">
            <Calendar2
              mode="range"
              selected={{
                from: filterValues[0] ? new Date(filterValues[0]) : undefined,
                to: filterValues[1] ? new Date(filterValues[1]) : undefined,
              }}              onSelect={(selectedRange) => {
                // If no range is selected, clear the filter
                if (!selectedRange || (!selectedRange.from && !selectedRange.to)) {
                  handleFilterChange(column.key as string, ["", ""]);
                  return;
                }
                
                // Get the current selection
                const currentFrom = filterValues[0] ? new Date(filterValues[0]) : undefined;
                const currentTo = filterValues[1] ? new Date(filterValues[1]) : undefined;
                
                // Check if the user clicked the same date to reset
                const isResetFrom = currentFrom && selectedRange?.from && 
                  currentFrom.getFullYear() === selectedRange.from.getFullYear() && 
                  currentFrom.getMonth() === selectedRange.from.getMonth() && 
                  currentFrom.getDate() === selectedRange.from.getDate() &&
                  !selectedRange.to;
                  
                const isResetTo = currentTo && selectedRange?.to && 
                  currentTo.getFullYear() === selectedRange.to.getFullYear() && 
                  currentTo.getMonth() === selectedRange.to.getMonth() && 
                  currentTo.getDate() === selectedRange.to.getDate() &&
                  currentFrom && selectedRange.from &&
                  currentFrom.getFullYear() === selectedRange.from.getFullYear() && 
                  currentFrom.getMonth() === selectedRange.from.getMonth() && 
                  currentFrom.getDate() === selectedRange.from.getDate();
                
                // If it's the same date being selected twice, reset the value
                if (isResetFrom || isResetTo) {
                  handleFilterChange(column.key as string, ["", ""]);
                  return;
                }
                
                // Otherwise, proceed with the normal date selection                // Format dates in ISO format for consistent storage
                handleFilterChange(column.key as string, [
                  selectedRange?.from ? format(selectedRange.from, "yyyy-MM-dd") : "",
                  selectedRange?.to ? format(selectedRange.to, "yyyy-MM-dd") : "",
                ]);
              }}
              initialFocus
              className="p-3 pointer-events-auto w-full"
            />
          </div>
        );
      case "string":
      default:
        return (          <Command>
            <CommandInput placeholder={`Search...`} />
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
    (Object.keys(columnFilters).length > 0 && 
     Object.values(columnFilters).some(values => values.some(v => v !== ""))) ||
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
      <div className="flex justify-between items-center mb-4">        <div className="flex flex-wrap gap-4 items-center">
          {columns.map((column) =>
            column.filterable ? (
              <div key={column.key as string} className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`flex items-center gap-2 ${
                        columnFilters[column.key as string]?.length > 0 && 
                        columnFilters[column.key as string].some(val => val !== "") 
                          ? 'text-blue-500 border-blue-500' 
                          : ''
                      }`}
                    >                      {column.filterType === "date" && 
                       columnFilters[column.key as string]?.length > 0 && 
                       (columnFilters[column.key as string][0] !== "" || columnFilters[column.key as string][1] !== "") ? (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {columnFilters[column.key as string][0] && 
                             columnFilters[column.key as string][1] ? (
                              <>
                                {format(new Date(columnFilters[column.key as string][0]), "MMM dd, yyyy")} - 
                                {format(new Date(columnFilters[column.key as string][1]), "MMM dd, yyyy")}
                              </>
                            ) : columnFilters[column.key as string][0] ? (
                              <>From: {format(new Date(columnFilters[column.key as string][0]), "MMM dd, yyyy")}</>
                            ) : (
                              <>To: {format(new Date(columnFilters[column.key as string][1]), "MMM dd, yyyy")}</>
                            )}
                          </span>
                          
                          {/* X button inside date filter */}
                          <span 
                            className="ml-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFilterChange(column.key as string, ["", ""]);
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      ) : (
                        <>
                          {column?.header}
                          {columnFilters[column.key as string]?.length > 0 && 
                           columnFilters[column.key as string].some(val => val !== "") && (
                             <>
                              <div className="w-2 h-2 rounded-full bg-blue-500 ml-1"></div>
                              {column.filterType === "number" && (
                                <span className="ml-1 text-xs">
                                  {columnFilters[column.key as string][0] && columnFilters[column.key as string][1] 
                                    ? `${columnFilters[column.key as string][0]}-${columnFilters[column.key as string][1]}`
                                    : columnFilters[column.key as string][0] 
                                      ? `≥ ${columnFilters[column.key as string][0]}` 
                                      : `≤ ${columnFilters[column.key as string][1]}`}
                                </span>
                              )}
                              {column.filterType === "string" && columnFilters[column.key as string].length > 0 && (
                                <span className="ml-1 text-xs">
                                  {columnFilters[column.key as string].length > 5
                                    ? `(${columnFilters[column.key as string].length} selected)`
                                    : `(${columnFilters[column.key as string].join(", ")})`}
                                </span>
                              )}
                              
                              {/* X button for string and number filters */}
                              <span 
                                className="ml-1 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (column.filterType === "string") {
                                    handleFilterChange(column.key as string, []);
                                  } else {
                                    handleFilterChange(column.key as string, ["", ""]);
                                  }
                                }}
                              >
                                <X className="h-3.5 w-3.5" />
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={`p-0 ${column.filterType === 'date' ? 'w-auto' : 'w-[220px]'}`}>
                    {renderFilterUI(column)}
                  </PopoverContent>                </Popover>
              </div>
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
