
import React, { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationControlsHeader, PaginationControlsFooter } from "./PaginationControls";
import { getPaginatedItems, countries, TOTAL_PAGES, ITEMS_PER_PAGE, CountryOption } from "./utils";

export const PaginatedSelect: React.FC = () => {
  const [page, setPage] = useState(1);
  
  const nextPage = () => {
    if (page < TOTAL_PAGES) {
      setPage(page + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const paginatedItems = getPaginatedItems(countries, page, ITEMS_PER_PAGE);
  
  return (
    <div className="space-y-2 max-w-xs">
      <label className="text-sm font-medium">
        Select a Country (Page {page} of {TOTAL_PAGES})
      </label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <PaginationControlsHeader 
            page={page} 
            totalPages={TOTAL_PAGES} 
            onNext={nextPage} 
            onPrevious={prevPage} 
          />
          <SelectGroup>
            <SelectLabel>Countries</SelectLabel>
            {paginatedItems.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <PaginationControlsFooter 
            page={page} 
            totalPages={TOTAL_PAGES} 
            onNext={nextPage} 
            onPrevious={prevPage} 
          />
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, countries.length)} of {countries.length} countries
      </p>
    </div>
  );
};
