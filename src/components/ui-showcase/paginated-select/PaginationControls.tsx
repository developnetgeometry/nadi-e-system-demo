
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
  className?: string;
}

export const PaginationControlsHeader: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="flex justify-between items-center p-1 border-b">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onPrevious}
        disabled={page <= 1}
        className="h-7 w-7 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs">Page {page} of {totalPages}</span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onNext}
        disabled={page >= totalPages}
        className="h-7 w-7 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const PaginationControlsFooter: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onNext,
  onPrevious,
  className,
}) => {
  return (
    <div className={`flex justify-center p-1 border-t ${className || ""}`}>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onPrevious}
        disabled={page <= 1}
        className="mr-2"
      >
        Previous
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onNext}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};
