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
  View, ArrowUp,
  ArrowUpDown,
  X,
  Info as InfoIcon,
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface Column {
  key: string | ((row: any, index: number) => any); // Dynamic key or accessor function
  header: string | React.ReactNode | any;  // Header text or custom React component
  width?: string; // Optional column width
  render?: (value: any, row: any, index: number) => React.ReactNode; // Custom cell renderer
  filterable?: boolean; // Indicates if the column is filterable
  visible?: boolean; // Indicates if the column is visible (default: true)
  filterType?: "string" | "number" | "date"; // Type of filter (default: string)
  align?: "left" | "center" | "right"; // Text alignment for the column (default: left)
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
  const [searchQuery, setSearchQuery] = useState("");  // Use an array to store sort configurations for multi-column sorting
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
    priority: number; // Lower number = higher priority
  }[]>([]);
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: any[] }>(
    {}
  );

  const visibleColumns = columns.filter((column) => column.visible !== false);
  const filteredData = data
    .filter((row) =>
      columns.every((column) => {
        // Skip filtering if column is not filterable or if key is a function
        if (column.filterable !== true || typeof column.key === "function") {
          return true;
        }

        const cellValue = row[column.key];

        const filterValues = columnFilters[column.key] || [];
        if (filterValues.length > 0 && cellValue != null) {
          switch (column.filterType) {
            case "number":              // Handle case when only min or max is provided
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
    if (!sortConfig.length) return filteredData;

    // Sort the sortConfig array by priority (lower number = higher priority)
    const sortConfigByPriority = [...sortConfig].sort((a, b) => a.priority - b.priority);

    const sorted = [...filteredData].sort((a, b) => {
      // Iterate through each sort config in order of priority
      for (const config of sortConfigByPriority) {
        if (typeof config.key !== "string") continue;

        const aValue = a[config.key];
        const bValue = b[config.key];

        // Skip this sort if the values are equal or null
        if (aValue == null || bValue == null || aValue === bValue) continue;

        // Compare values based on the sort direction
        if (aValue < bValue) return config.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return config.direction === "asc" ? 1 : -1;
      }

      // If we've compared all sort configs and values are equal, return 0
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
  }; const handleExport = () => {
    // Filter columns for export - include string keys and specific function keys (like numbering columns)
    const exportableColumns = columns.filter(col => {
      // Always include string keys
      if (typeof col.key === "string") return true;

      // Special case for numbering columns (like "No" column that uses index)
      // Detect columns that have a function key but a simple header like "No"
      const isNumberingColumn = typeof col.key === "function" &&
        (typeof col.header === "string" && ["No", "#", "Number"].includes(col.header));

      return isNumberingColumn;
    });

    // Extract header text - handle both string and React elements
    const headers = exportableColumns.map((col) => {
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
        return escapeCsvValue(typeof col.key === 'string' ? col.key : `Column ${exportableColumns.indexOf(col) + 1}`);
      }

      // Default fallback
      return escapeCsvValue(typeof col.key === 'string' ? col.key : `Column ${exportableColumns.indexOf(col) + 1}`);
    }).join(","); const rows = filteredData
      .map((row, rowIndex) =>
        exportableColumns
          .map((col) => {
            let cellValue;

            // Handle both string keys and function keys
            if (typeof col.key === "function") {
              // For function keys, evaluate the function
              cellValue = col.key(row, rowIndex);
            } else {
              // For string keys, get the value directly
              cellValue = row[col.key];
            }

            // For custom rendered cells, we should export the raw data value, not the rendered JSX
            // This ensures we get clean data in the CSV without HTML or React elements

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
  }; const handleSort = (key: string, event?: React.MouseEvent) => {
    // Only allow sorting on string column keys (not function keys)
    if (typeof key !== "string" || key === "") return;

    // Support multi-column sorting by default (no shift key required)
    setSortConfig((prev) => {
      // Find if this column is already being sorted
      const existingIndex = prev.findIndex(config => config.key === key);

      // Create a copy of the previous sort configurations
      const newSortConfig = [...prev];

      if (existingIndex !== -1) {
        // Store the priority that's being removed (if we're going to remove it)
        const priorityToRemove = newSortConfig[existingIndex].priority;

        // Toggle direction for an existing sort
        if (newSortConfig[existingIndex].direction === "asc") {
          newSortConfig[existingIndex].direction = "desc";
        } else {
          // Remove this sort configuration if it was already descending
          newSortConfig.splice(existingIndex, 1);

          // Adjust priorities of remaining sorts
          // This ensures that if we remove sort 2, sort 3 becomes sort 2, etc.
          newSortConfig.forEach((config) => {
            if (config.priority > priorityToRemove) {
              config.priority -= 1;
            }
          });
        }
      } else {
        // Add a new sort configuration (always keep existing sorts)
        // Add the new sort with the lowest priority (highest number)
        newSortConfig.push({
          key,
          direction: "asc",
          priority: newSortConfig.length
        });
      }

      return newSortConfig;
    });
  }; const renderSortIcon = (columnKey: string | ((row: any, index: number) => React.ReactNode)) => {
    if (typeof columnKey !== "string") return null;

    // Find if this column has an active sort
    const sortItem = sortConfig.find(config => config.key === columnKey);

    if (!sortItem) return null; // No sort for this column

    const { direction } = sortItem;

    return (
      <div className="flex items-center ml-2">
        <ArrowUp
          className={`h-4 w-4 ${direction === "desc" ? "rotate-180 text-orange-500" : "text-blue-500"}`}
        />
      </div>
    );
  }; const handleFilterChange = (key: string, value: string | string[]) => {
    setColumnFilters((prev) => {
      // Create a completely new object to avoid reference issues
      const newFilters = { ...prev };

      if (Array.isArray(value)) {
        // For number and date filters (arrays)
        // Always create a new array to ensure state updates properly
        newFilters[key] = [...value];
      } else {
        const currentValues = [...(prev[key] || [])];

        if (currentValues.includes(value)) {
          // Remove the value if it already exists
          newFilters[key] = currentValues.filter((v: string) => v !== value);
        } else {
          // Add the value if it doesn't exist
          newFilters[key] = [...currentValues, value];
        }
      }

      return newFilters;
    });

    setCurrentPage(1); // Reset to the first page whenever a filter is applied
  }; const clearAllFilters = () => {
    setColumnFilters({});
    setSearchQuery("");
    setSortConfig([]); // Reset to empty array for multi-column sorting
    setCurrentPage(1); // Reset to first page
  };

  const renderFilterIndicator = (columnKey: string) => {
    return columnFilters[columnKey] ? (
      <span className="ml-2 text-xs text-blue-500">(Filtered)</span>
    ) : null;
  }; const renderFilterUI = (column: Column) => {
    const filterValues = columnFilters[column.key as string] || [];

    switch (column.filterType) {
      case "number":
        // Using local state to manage inputs independently before sending to the main state
        return (
          <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-gray-500 w-8">Min:</span>
              <Input type="text"
                inputMode="decimal"
                placeholder="Min"
                value={filterValues[0] || ""}
                onChange={(e) => {
                  // Allow numeric input with decimal point and negative values
                  const value = e.target.value;
                  if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                    let minVal = value;
                    const maxVal = filterValues[1] || "";

                    // Only apply min/max constraint when both values exist and are valid numbers
                    if (maxVal !== "" && minVal !== "" &&
                      !isNaN(Number(minVal)) && !isNaN(Number(maxVal)) &&
                      Number(minVal) > Number(maxVal)) {
                      // We only show a warning instead of auto-changing values
                      toast.warning("Min value should not be greater than Max value");
                    }

                    // Always update with exactly what the user typed
                    handleFilterChange(column.key as string, [minVal, maxVal]);
                  }
                }} onKeyDown={(e) => {
                  // Handle special key presses for decimals and negative values
                  if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
                    const maxVal = filterValues[1] || "";
                    handleFilterChange(column.key as string, ["", maxVal]);
                  }
                }}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-gray-500 w-8">Max:</span>
              <Input type="text"
                inputMode="decimal"
                placeholder="Max"
                value={filterValues[1] || ""}
                onChange={(e) => {
                  // Allow numeric input with decimal point and negative values
                  const value = e.target.value;
                  if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                    const minVal = filterValues[0] || "";
                    let maxVal = value;

                    // Only apply min/max constraint when both values exist and are valid numbers
                    if (minVal !== "" && maxVal !== "" &&
                      !isNaN(Number(minVal)) && !isNaN(Number(maxVal)) &&
                      Number(maxVal) < Number(minVal)) {
                      // We only show a warning instead of auto-changing values
                      toast.warning("Max value should not be less than Min value");
                    }

                    // Always update with exactly what the user typed
                    handleFilterChange(column.key as string, [minVal, maxVal]);
                  }
                }} onKeyDown={(e) => {
                  // Handle special key presses for decimals and negative values
                  if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
                    const minVal = filterValues[0] || "";
                    handleFilterChange(column.key as string, [minVal, ""]);
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
        ); case "date":
        return (
          <div className="flex flex-col items-center p-2">
            <Calendar
              mode="range"
              selected={{
                from: filterValues[0] ? new Date(filterValues[0]) : undefined,
                to: filterValues[1] ? new Date(filterValues[1]) : undefined,
              }} onSelect={(selectedRange) => {
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
        return (<Command>
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
  }; const isFilterApplied =
    (Object.keys(columnFilters).length > 0 &&
      Object.values(columnFilters).some(values => values.some(v => v !== ""))) ||
    sortConfig.length > 0 ||
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
      </div>      <div className="flex justify-between items-center mb-4">        <div className="flex flex-wrap gap-4 items-center">
        {columns.map((column) =>
          column.filterable === true && typeof column.key === "string" ? (
            <div key={column.key as string} className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 ${columnFilters[column.key as string]?.length > 0 &&
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
                    className={`py-3 px-6 text-sm font-semibold text-gray-900 select-none text-center ${typeof column.key === "string" ? "cursor-pointer" : "cursor-default"}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      if (typeof column.key === "string") {
                        handleSort(column.key, e);
                      }
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {column.header}
                      {typeof column.key === "string" ? renderSortIcon(column.key) : null}
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
                    className={`border-t border-gray-100 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >{visibleColumns.map((column, colIndex) => (
                    <TableCell
                      key={`${rowIndex}-${colIndex}`}
                      className={`py-4 px-6 text-sm text-gray-900 ${column.align ? `text-${column.align}` : ''}`}
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
                className={`h-9 w-9 p-0 ${currentPage === page ? "bg-blue-600" : "border-gray-200"
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
