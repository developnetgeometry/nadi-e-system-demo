
import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { InfiniteScrollSelect, SelectOption } from "@/components/ui/infinite-scroll-select";
import { Label } from "@/components/ui/label";

// Sample data for the dropdown
const generateOptions = (count: number, startIndex = 0): SelectOption[] => {
  return Array.from({ length: count }).map((_, i) => ({
    value: `option-${startIndex + i}`,
    label: `Option ${startIndex + i + 1}`,
    category: (startIndex + i) % 3 === 0 ? "Category A" : (startIndex + i) % 3 === 1 ? "Category B" : "Category C"
  }));
};

// Initial data set
const INITIAL_DATA = generateOptions(100);

export const FileUploadAndScrollSelectExamples = () => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>(generateOptions(15));
  const [allOptions, setAllOptions] = useState<SelectOption[]>(INITIAL_DATA);
  const [filter, setFilter] = useState("");
  
  // Handle file selection
  const handleFilesSelected = (files: File[]) => {
    console.log("Selected files:", files);
  };
  
  // Load more options when scrolling to bottom
  const handleLoadMore = () => {
    setIsLoading(true);
    
    // Simulate an API call with setTimeout
    setTimeout(() => {
      const currentLength = options.length;
      const nextBatch = allOptions.slice(currentLength, currentLength + 15);
      
      setOptions((prev) => [...prev, ...nextBatch]);
      setIsLoading(false);
    }, 800);
  };
  
  // Handle filtering
  const handleFilter = (query: string) => {
    setFilter(query);
    setIsLoading(true);
    
    // Simulate an API call with filtered results
    setTimeout(() => {
      if (!query.trim()) {
        // Reset to initial data set if query is empty
        setOptions(allOptions.slice(0, 15));
      } else {
        // Filter the data based on query
        const filtered = allOptions.filter(
          option => option.label.toLowerCase().includes(query.toLowerCase()) ||
                    option.category.toLowerCase().includes(query.toLowerCase())
        );
        setOptions(filtered.slice(0, 15));
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="grid gap-8">
      {/* File Upload Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">File Upload</h3>
        <div className="max-w-md">
          <Label htmlFor="file-upload" className="mb-2 block">Upload Files</Label>
          <FileUpload
            id="file-upload"
            maxFiles={3}
            acceptedFileTypes=".pdf,.jpg,.png,.doc,.docx"
            maxSizeInMB={10}
            buttonText="Choose Files"
            onFilesSelected={handleFilesSelected}
          />
        </div>
      </div>
      
      {/* Infinite Scroll Select Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Scrollable & Filterable Select</h3>
        <div className="max-w-md">
          <Label htmlFor="scroll-select" className="mb-2 block">Choose an option</Label>
          <InfiniteScrollSelect
            options={options}
            value={selectedValue}
            onValueChange={setSelectedValue}
            placeholder="Select an option..."
            emptyMessage="No matching options found"
            filterPlaceholder="Search by name or category..."
            pageSize={15}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
            onFilter={handleFilter}
          />
          {selectedValue && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected value: {selectedValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const fileUploadCode = `
// File Upload Component
<FileUpload
  maxFiles={3}
  acceptedFileTypes=".pdf,.jpg,.png,.doc,.docx"
  maxSizeInMB={10}
  buttonText="Choose Files"
  onFilesSelected={(files) => console.log(files)}
/>
`;

export const infiniteScrollSelectCode = `
// Infinite Scroll Select with Filtering
const [selectedValue, setSelectedValue] = useState<string>("");
const [options, setOptions] = useState<SelectOption[]>(initialOptions);
const [isLoading, setIsLoading] = useState(false);

const handleLoadMore = () => {
  setIsLoading(true);
  // Fetch more data from your API
  fetchMoreOptions().then(newOptions => {
    setOptions(prev => [...prev, ...newOptions]);
    setIsLoading(false);
  });
};

const handleFilter = (query: string) => {
  // Filter options based on search query
  // Can be implemented with API call or client-side filtering
};

<InfiniteScrollSelect
  options={options}
  value={selectedValue}
  onValueChange={setSelectedValue}
  placeholder="Select an option..."
  pageSize={15}
  isLoading={isLoading}
  onLoadMore={handleLoadMore}
  onFilter={handleFilter}
/>
`;
