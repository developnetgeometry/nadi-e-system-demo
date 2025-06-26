// Cleaned up: removed unnecessary comments, improved formatting, grouped related logic, and ensured consistent style.
import React, { useState, useEffect, ReactElement, ReactNode } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft, ChevronRight, Pencil, Download, Trash2, FileText, View, ArrowUp, ArrowUpDown, X, CheckCircle, XCircle, Info as InfoIcon,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from "@/components/ui/command";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";

export interface Column {
  key: string | ((row: any, index: number) => any);
  header: string | React.ReactNode | any;
  width?: string;
  render?: (value: any, row: any, index: number) => React.ReactNode;
  filterable?: boolean;
  visible?: boolean;
  filterType?: "string" | "number" | "date" | "boolean";
  align?: "left" | "center" | "right";
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
  if (typeof element === 'string') return element;

  // If null or undefined, return empty string
  if (element == null) return '';

  // If it's a React element with props
  if (React.isValidElement(element)) {
    // Check for direct text children
    if (typeof element.props.children === 'string') return element.props.children;

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
          if (child == null) return;

          // Direct text nodes
          if (typeof child === 'string') textParts.push(child);
          // React elements - recursively extract text
          else if (React.isValidElement(child)) {
            const text = getTextFromReactElement(child);
            if (text) textParts.push(text);
          }
        });

        return textParts;
      };
      const textParts = extractTextFromChildren(element.props.children);
      if (textParts.length > 0) return textParts.join(' ').trim();
    }
  }

  // Couldn't extract text
  return '';
};

// Enhanced helper to get nested value from object using dot notation and array indices
function getNestedValue(obj: any, path: string): any {
  // Special handling for null/undefined objects
  if (obj === null || obj === undefined) {
    return null;
  }
  
  return path.split('.').reduce((acc, part) => {
    // Return null for undefined or null values to ensure consistent handling
    if (acc === null || acc === undefined) return null;
    
    // Handle array index, e.g. nd_phases_contract[0]
    const match = part.match(/^([a-zA-Z0-9_]+)\[(\d+)\]$/);
    if (match) {
      const prop = match[1];
      const idx = parseInt(match[2], 10);
      return acc[prop] && Array.isArray(acc[prop]) ? acc[prop][idx] : null;
    }
    // Handle numeric part (e.g. .0.)
    if (!isNaN(Number(part))) {
      return Array.isArray(acc) ? acc[Number(part)] : null;
    }
    
    // Check if property exists before accessing
    return acc.hasOwnProperty(part) ? acc[part] : null;
  }, obj);
}

const getCellValue = (column: Column, row: any, index: number) => {
  if (typeof column.key === "function") {
    return column.key(row, index);
  }
  if (typeof column.key === "string" && column.key.includes('.')) {
    return getNestedValue(row, column.key);
  }
  return row[column.key];
};

// Performant String Filter Component
interface StringFilterUIProps {
  column: Column;
  filterValues: any[];
  data: any[];
  handleFilterChange: (key: string, value: string | string[]) => void;
  setColumnFilters: React.Dispatch<React.SetStateAction<{ [key: string]: any[] }>>;
}

const StringFilterUI: React.FC<StringFilterUIProps> = ({
  column,
  filterValues,
  data,
  handleFilterChange,
  setColumnFilters
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [displayedCount, setDisplayedCount] = useState(50); // Items per page
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Get unique values with counts
  const uniqueValues = React.useMemo(() => {
    const valueCounts = new Map();
    data.forEach(row => {
      const val = getCellValue(column, row, 0);
      if (val !== null && val !== '') {
        valueCounts.set(val, (valueCounts.get(val) || 0) + 1);
      }
    });
    
    return Array.from(valueCounts.entries())
      .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
      .map(([value, count]) => ({ value, count }));
  }, [data, column]);

  // Filter values based on search
  const filteredValues = React.useMemo(() => {
    if (!debouncedSearchValue) return uniqueValues;
    const searchLower = debouncedSearchValue.toLowerCase();
    return uniqueValues.filter(({ value }) =>
      String(value).toLowerCase().includes(searchLower)
    );
  }, [uniqueValues, debouncedSearchValue]);

  // Get displayed values with pagination
  const displayedValues = React.useMemo(() => {
    return filteredValues.slice(0, displayedCount);
  }, [filteredValues, displayedCount]);

  // Load more function
  const loadMore = React.useCallback(() => {
    if (displayedCount < filteredValues.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayedCount(prev => Math.min(prev + 50, filteredValues.length));
        setIsLoadingMore(false);
      }, 150);
    }
  }, [filteredValues.length, displayedCount, isLoadingMore]);

  // Handle scroll events for infinite loading
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Load more when user scrolls to within 50px of the bottom
    const nearBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    if (nearBottom && displayedCount < filteredValues.length && !isLoadingMore) {
      loadMore();
    }
  }, [loadMore, displayedCount, filteredValues.length, isLoadingMore]);

  // Reset displayed count when search changes
  useEffect(() => {
    setDisplayedCount(50);
    setIsLoadingMore(false);
  }, [debouncedSearchValue]);

  // Check if there are null/empty values
  const hasNullValues = React.useMemo(() => {
    return data.some(row => getCellValue(column, row, 0) === null || getCellValue(column, row, 0) === '');
  }, [data, column]);

  const nullValueCount = React.useMemo(() => {
    return data.filter(row => getCellValue(column, row, 0) === null || getCellValue(column, row, 0) === '').length;
  }, [data, column]);

  return (
    <div className="p-2">
      <Command shouldFilter={false}>
        <CommandInput 
          placeholder="Search values..." 
          value={searchValue}
          onValueChange={setSearchValue}
        />
        
        <CommandList className="max-h-64 overflow-auto" onScroll={handleScroll}>
          <CommandEmpty>
            {searchValue !== debouncedSearchValue ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Searching...
              </div>
            ) : (
              "No values found."
            )}
          </CommandEmpty>
          
          <CommandGroup>
            {/* Add a special option for NULL or empty string values */}
            {hasNullValues && (debouncedSearchValue === "" || "not set".includes(debouncedSearchValue.toLowerCase())) && (
              <CommandItem
                key="__null__"
                value="not-set-null-empty"
                onSelect={() => handleFilterChange(column.key as string, "Not Set")}
              >
                <input
                  type="checkbox"
                  checked={filterValues.includes("Not Set")}
                  readOnly
                  className="mr-2"
                />
                <span className="flex-1">Not Set</span>
                <span className="text-xs text-gray-500">({nullValueCount})</span>
              </CommandItem>
            )}
            
            {/* List filtered and paginated values */}
            {displayedValues.map(({ value, count }) => (
              <CommandItem
                key={String(value)}
                value={String(value)}
                onSelect={() => handleFilterChange(column.key as string, value)}
              >
                <input
                  type="checkbox"
                  checked={filterValues.includes(value)}
                  readOnly
                  className="mr-2"
                />
                <span className="flex-1">{String(value)}</span>
                <span className="text-xs text-gray-500">({count})</span>
              </CommandItem>
            ))}
            
            {/* Loading More Indicator */}
            {isLoadingMore && (
              <div className="border-t border-gray-200 p-2">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Loading more values...
                </div>
              </div>
            )}
            
            {/* Show remaining count if there are more items */}
            {!isLoadingMore && displayedCount < filteredValues.length && (
              <div className="border-t border-gray-200 p-2">
                <div className="text-center text-sm text-gray-500">
                  Showing {displayedCount} of {filteredValues.length} values
                  <br />
                  <span className="text-xs">Scroll down to load more</span>
                </div>
              </div>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
      
      {filterValues.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={() => setColumnFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[column.key as string];
            return newFilters;
          })}
        >
          Clear Filter
        </Button>
      )}
    </div>
  );
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
    direction: "asc" | "desc";
    priority: number;
  }[]>([]);
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: any[] }>({});

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const visibleColumns = columns.filter((column) => column.visible !== false);
  const filteredData = data
    .filter((row) =>
      columns.every((column) => {
        // Skip filtering if column is not filterable or if key is a function
        if (column.filterable !== true || typeof column.key === "function") {
          return true;
        }        const cellValue = getCellValue(column, row, 0); 
        const filterValues = columnFilters[column.key] || []; 
        
        if (filterValues.length > 0) {          // Special handling for null or empty string values
          if (cellValue === null || cellValue === '') {
            // For date columns, always exclude null/empty values when filter is applied
            if (column.filterType === "date") {
              // Include null values only if date filter is completely cleared
              return filterValues[0] === "" && filterValues[1] === "";
            }
            
            // For boolean columns, check if "Not Set" is selected
            if (column.filterType === "boolean") {
              return filterValues.some(v => {
                if (typeof v !== 'string') return false;
                const lowerVal = v.toLowerCase();
                return lowerVal === "not set" || lowerVal === "unknown" || lowerVal === "null";
              });
            }              // For string columns, check if "Not Set" is selected
            if (column.filterType === "string") {
              return filterValues.some(v => {
                if (typeof v !== 'string') return false;
                const lowerVal = v.toLowerCase();
                return lowerVal === "unknown" || lowerVal === "not set" || lowerVal === "null";
              });
            }
            
            // Special handling for nested keys that might be null at parent level
            if (column.key.includes('.')) {
              return filterValues.some(v => {
                if (typeof v !== 'string') return false;
                const lowerVal = v.toLowerCase();
                return lowerVal === "unknown" || lowerVal === "not set" || lowerVal === "null";
              });
            }

            // Otherwise, null values don't match any filter
            return false;
          }switch (column.filterType) {            case "boolean":
              // Handle boolean values
              return filterValues.some((filterValue) => {
                // Make sure we're dealing with strings before using toLowerCase
                if (typeof filterValue !== 'string') return false;
                
                // Map filter values to boolean for comparison
                const lowerFilterValue = filterValue.toLowerCase();
                if (lowerFilterValue === "active" && cellValue === true) return true;
                if (lowerFilterValue === "inactive" && cellValue === false) return true;
                if (lowerFilterValue === "not set" && (cellValue === null || cellValue === undefined || cellValue === '')) return true;
                return false;
              });
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
              return true; case "date":
              // Null values are already handled in the top-level condition
              // This code will only run for non-null date values
              return filterValues.every((filterValue, index) => {
                if (index === 0 && filterValue !== "") {
                  // For start date comparison, set time to 00:00:00
                  const startDate = new Date(filterValue);
                  startDate.setHours(0, 0, 0, 0);

                  // Convert cell value to date and compare dates only, ignoring time component
                  const cellDate = new Date(cellValue);
                  return cellDate >= startDate;
                }
                if (index === 1 && filterValue !== "") {
                  // For end date comparison, set time to 23:59:59
                  const endDate = new Date(filterValue);
                  endDate.setHours(23, 59, 59, 999);

                  // Convert cell value to date and compare
                  const cellDate = new Date(cellValue);
                  return cellDate <= endDate;
                }
                return true;              }); case "string":
            default:              // For regular string values
              return filterValues.some((filterValue) => {
                // Make sure filterValue is a string
                if (typeof filterValue !== 'string') return false;

                // Special case for "Not Set" filter value with null/empty cell values
                if (filterValue === "Not Set" && (cellValue === null || cellValue === '')) return true;

                // Skip this filterValue if it's "Not Set" but the cell has a non-empty value
                if (filterValue === "Not Set" && cellValue !== null && cellValue !== '') return false;

                // Regular string comparison - safely convert cell value to string first
                try {
                  const cellString = String(cellValue).toLowerCase();
                  const filterString = filterValue.toLowerCase();
                  return cellString.includes(filterString);
                } catch (e) {
                  // If conversion fails for any reason, don't match
                  return false;
                }
              });
          }
        }
        return true;
      })
    ).filter((row) =>
      visibleColumns.some((column) => {
        const cellValue =
          typeof column.key === "function"
            ? column.key(row, 0)
            : getCellValue(column, row, 0);

        // Handle different value types for search
        if (cellValue === null || cellValue === undefined) {
          return false;
        }
        // Handle boolean values specially for search
        if (typeof cellValue === "boolean") {
          const booleanAsString = cellValue ? "active" : "inactive";
          return booleanAsString.includes(searchQuery.toLowerCase());
        }

        // Handle null values for search
        if (cellValue === null) {
          const nullSearchTerms = ["null", "not set", "unknown", "missing"];
          return nullSearchTerms.some(term => term.includes(searchQuery.toLowerCase()));
        }
        // Default string comparison - safely convert to string
        try {
          return String(cellValue)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        } catch (e) {
          // If string conversion fails, don't match
          return false;
        }
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
        // Find the corresponding column for this key
        const column = columns.find(col => col.key === config.key);
        if (!column) continue;
        const aValue = getCellValue(column, a, 0);
        const bValue = getCellValue(column, b, 0);

        // Normalize undefined/null to empty string for comparison
        const aComp = aValue === null || aValue === undefined ? '' : aValue;
        const bComp = bValue === null || bValue === undefined ? '' : bValue;

        // Skip only if values are equal
        if (aComp === bComp) continue;

        // Handle cases where either value is empty string
        if (aComp === '' && bComp !== '') {
          return config.direction === "asc" ? -1 : 1;
        }
        if (aComp !== '' && bComp === '') {
          return config.direction === "asc" ? 1 : -1;
        }

        // Special handling for boolean values (true sorts first in asc, false sorts first in desc)
        if (typeof aComp === "boolean" && typeof bComp === "boolean") {
          if (config.direction === "asc") {
            return aComp ? 1 : -1;
          } else {
            return aComp ? -1 : 1;
          }
        }

        // Compare as strings for consistency
        if (String(aComp) < String(bComp)) return config.direction === "asc" ? -1 : 1;
        if (String(aComp) > String(bComp)) return config.direction === "asc" ? 1 : -1;
      }

      // If we've compared all sort configs and values are equal, return 0
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  
  // Reset to first page if current page becomes invalid after filtering/sorting
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

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
              cellValue = getCellValue(col, row, rowIndex);
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

  const handleSort = (key: string, event?: React.MouseEvent) => {
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

    // Reset to first page when sorting is applied
    setCurrentPage(1);
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

        // Special handling for "Not Set" filter which includes both null and empty values
        if (value === "Not Set") {
          if (currentValues.includes("Not Set")) {
            // Remove the Not Set value if it already exists
            newFilters[key] = currentValues.filter((v: string) => v !== "Not Set");
          } else {
            // Add Not Set but remove any empty string values that might be in the filter
            newFilters[key] = [...currentValues.filter((v: string) => v !== ""), "Not Set"];
          }
        } else {
          if (currentValues.includes(value)) {
            // Remove the value if it already exists
            newFilters[key] = currentValues.filter((v: string) => v !== value);
          } else {
            // Add the value if it doesn't exist
            newFilters[key] = [...currentValues, value];
          }
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
    const filterValues = columnFilters[column.key as string] || [];    switch (column.filterType) {      case "boolean":
        // Boolean filter UI with value counts
        return (
          <div className="p-2">
            <Command>
              <CommandInput placeholder={`Search...`} />
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {["Active", "Inactive", "Not Set"].map((label) => {
                    // Calculate the count of items matching this filter value
                    let count = 0;
                    if (label === "Active") {
                      count = data.filter(row => getCellValue(column, row, 0) === true).length;
                    } else if (label === "Inactive") {
                      count = data.filter(row => getCellValue(column, row, 0) === false).length;
                    } else { // "Not Set"
                      count = data.filter(row => 
                        getCellValue(column, row, 0) === null || 
                        getCellValue(column, row, 0) === undefined || 
                        getCellValue(column, row, 0) === '').length;
                    }

                    return (
                      <CommandItem
                        key={label}
                        onSelect={() =>
                          handleFilterChange(column.key as string, label)
                        }
                      >
                        <input
                          type="checkbox"
                          checked={filterValues.includes(label)}
                          readOnly
                          className="mr-2"
                        />
                        <span className="flex-1">{label}</span>
                        <span className="text-xs text-gray-500">({count})</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
            {filterValues.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => setColumnFilters(prev => {
                  const newFilters = { ...prev };
                  delete newFilters[column.key as string];
                  return newFilters;
                })}
              >
                Clear Filter
              </Button>
            )}
          </div>
        );
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
        return (<div className="flex flex-col items-center p-2">
          {/* <div className="mb-2 text-xs text-gray-500 flex items-center">
            <InfoIcon className="w-3 h-3 mr-1" />
            When filtering dates, start date is set to 00:00:00 and end date to 23:59:59
          </div>
          {(filterValues[0] || filterValues[1]) && filterValues[2] !== "include-null" && (
            <div className="mb-2 text-xs text-gray-500">
              Note: Empty date values are filtered out. Use the checkbox below to include them.
            </div>
          )} */}
          <Calendar
            mode="range"
            selected={{
              from: filterValues[0] ? new Date(filterValues[0]) : undefined,
              to: filterValues[1] ? new Date(filterValues[1]) : undefined,
            }}            onSelect={(selectedRange) => {
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
                
              // Otherwise, proceed with the normal date selection
              // Format dates in ISO format for consistent storage
              let fromDate = selectedRange?.from ? new Date(selectedRange.from) : null;
              let toDate = selectedRange?.to ? new Date(selectedRange.to) : null;

              handleFilterChange(column.key as string, [
                fromDate ? format(fromDate, "yyyy-MM-dd") : "",
                toDate ? format(toDate, "yyyy-MM-dd") : ""
              ]);
            }}            initialFocus
            className="p-3 pointer-events-auto w-full"
          />          {(filterValues[0] || filterValues[1]) && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => handleFilterChange(column.key as string, ["", ""])}
            >
              Clear Filter
            </Button>
          )}
        </div>        );      case "string":
      default:
        // Performant string filter UI with search, pagination, and debouncing
        return <StringFilterUI column={column} filterValues={filterValues} data={data} handleFilterChange={handleFilterChange} setColumnFilters={setColumnFilters} />;
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
                      <span>                        {columnFilters[column.key as string][0] &&
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
                            )}                            {/* Show selected values for string and boolean filters */}
                            {(column.filterType === "string" || column.filterType === "boolean") && columnFilters[column.key as string].length > 0 && (
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
                                e.stopPropagation();                                if (column.filterType === "string" || column.filterType === "boolean") {
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
                    >                      {column.render
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
            {/* First Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="h-9 px-3 border-gray-200"
            >
              First
            </Button>
            {/* Previous Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0 border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Smart Pagination Logic */}
            {(() => {
              const delta = 2; // Number of pages to show around current page
              const left = currentPage - delta;
              const right = currentPage + delta + 1;
              const range = [];
              const rangeWithDots = [];

              // Generate page numbers that should be visible
              for (let i = Math.max(2, left); i < Math.min(totalPages, right); i++) {
                range.push(i);
              }

              // Always show page 1
              if (currentPage === 1) {
                rangeWithDots.push(1);
              } else {
                rangeWithDots.push(1);
                if (left > 2) {
                  rangeWithDots.push('...');
                }
              }

              // Add the middle range
              rangeWithDots.push(...range);

              // Add last page if needed
              if (right < totalPages) {
                rangeWithDots.push('...');
                rangeWithDots.push(totalPages);
              } else if (range[range.length - 1] !== totalPages) {
                rangeWithDots.push(totalPages);
              }

              return rangeWithDots.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`dots-${index}`} className="px-2 py-1 text-gray-500">
                      ...
                    </span>
                  );
                }
                
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`h-9 w-9 p-0 ${
                      currentPage === page ? "bg-blue-600" : "border-gray-200"
                    }`}
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </Button>
                );
              });
            })()}

            {/* Next Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0 border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {/* Last Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-9 px-3 border-gray-200"
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
