
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PaginatedSelectExamples = () => {
  const [page, setPage] = useState(1);
  
  // Sample data - in a real app this would come from an API
  const totalPages = 5;
  const itemsPerPage = 5;
  
  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "mx", label: "Mexico" },
    { value: "br", label: "Brazil" },
    { value: "ar", label: "Argentina" },
    { value: "uk", label: "United Kingdom" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "it", label: "Italy" },
    { value: "es", label: "Spain" },
    { value: "jp", label: "Japan" },
    { value: "cn", label: "China" },
    { value: "in", label: "India" },
    { value: "au", label: "Australia" },
    { value: "nz", label: "New Zealand" },
    { value: "za", label: "South Africa" },
    { value: "ng", label: "Nigeria" },
    { value: "eg", label: "Egypt" },
    { value: "ru", label: "Russia" },
    { value: "kr", label: "South Korea" },
  ];
  
  // Get countries for current page
  const getPaginatedItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return countries.slice(startIndex, endIndex);
  };
  
  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const paginatedItems = getPaginatedItems();

  return (
    <div className="grid gap-8">
      {/* Basic Paginated Select */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Paginated Select Dropdown</h3>
        <div className="space-y-2 max-w-xs">
          <label className="text-sm font-medium">
            Select a Country (Page {page} of {totalPages})
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <div className="flex justify-between items-center p-1 border-b">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={prevPage}
                  disabled={page <= 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs">Page {page} of {totalPages}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={nextPage}
                  disabled={page >= totalPages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <SelectGroup>
                <SelectLabel>Countries</SelectLabel>
                {paginatedItems.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <div className="flex justify-center p-1 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={prevPage}
                  disabled={page <= 1}
                  className="mr-2"
                >
                  Previous
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={nextPage}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, countries.length)} of {countries.length} countries
          </p>
        </div>
      </div>
    </div>
  );
};

export const paginatedSelectCode = `// Paginated Select Dropdown
const [page, setPage] = useState(1);
const totalPages = 5;
const itemsPerPage = 5;

// Sample data array
const countries = [/* array of country objects */];

// Get countries for current page
const getPaginatedItems = () => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return countries.slice(startIndex, endIndex);
};

const nextPage = () => {
  if (page < totalPages) {
    setPage(page + 1);
  }
};

const prevPage = () => {
  if (page > 1) {
    setPage(page - 1);
  }
};

const paginatedItems = getPaginatedItems();

// Component JSX
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a country" />
  </SelectTrigger>
  <SelectContent>
    <div className="flex justify-between items-center p-1 border-b">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={prevPage}
        disabled={page <= 1}
        className="h-7 w-7 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs">Page {page} of {totalPages}</span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={nextPage}
        disabled={page >= totalPages}
        className="h-7 w-7 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
    <SelectGroup>
      <SelectLabel>Countries</SelectLabel>
      {paginatedItems.map((country) => (
        <SelectItem key={country.value} value={country.value}>
          {country.label}
        </SelectItem>
      ))}
    </SelectGroup>
    <div className="flex justify-center p-1 border-t">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={prevPage}
        disabled={page <= 1}
        className="mr-2"
      >
        Previous
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={nextPage}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  </SelectContent>
</Select>
<p className="text-sm text-muted-foreground">
  Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, countries.length)} of {countries.length} countries
</p>`;
