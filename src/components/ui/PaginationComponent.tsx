import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    totalItems: number;
    startItem?: number;
    endItem?: number;
}

export const PaginationComponent = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    pageSize = 20,
    totalItems,
    startItem: customStartItem,
    endItem: customEndItem
}: PaginationProps) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const startItem = customStartItem !== undefined ? customStartItem : Math.min(((currentPage - 1) * pageSize) + 1, totalItems);
    const endItem = customEndItem !== undefined ? customEndItem : Math.min(currentPage * pageSize, totalItems);

    // Generate array of page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        
        // Always show first page
        pageNumbers.push(1);
        
        // Calculate range start and end
        let rangeStart = Math.max(2, currentPage - 1);
        let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
        
        // Adjust range to always show 3 pages if possible
        if (totalPages > 4) {
            if (rangeStart === 2) {
                rangeEnd = Math.min(4, totalPages - 1);
            }
            if (rangeEnd === totalPages - 1) {
                rangeStart = Math.max(2, totalPages - 3);
            }
        }
        
        // Add ellipsis before range if needed
        if (rangeStart > 2) {
            pageNumbers.push('ellipsis-start');
        }
        
        // Add range pages
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pageNumbers.push(i);
        }
        
        // Add ellipsis after range if needed
        if (rangeEnd < totalPages - 1) {
            pageNumbers.push('ellipsis-end');
        }
        
        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <span className="text-sm text-gray-600 order-2 sm:order-1">
                Showing {startItem}-{endItem} of {totalItems}
            </span>
            
            <div className="flex items-center space-x-2 order-1 sm:order-2">
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handlePrevious} 
                    disabled={currentPage === 1}
                    className="h-9 w-9"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {pageNumbers.map((page, i) => {
                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return (
                            <div key={`ellipsis-${i}`} className="flex items-center justify-center w-9 h-9">
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </div>
                        );
                    }
                    
                    return (
                        <Button
                            key={`page-${page}`}
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => onPageChange(page as number)}
                            className={`h-9 w-9 ${currentPage === page ? 'text-white' : ''}`}
                        >
                            {page}
                        </Button>
                    );
                })}
                
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleNext} 
                    disabled={currentPage === totalPages}
                    className="h-9 w-9"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
