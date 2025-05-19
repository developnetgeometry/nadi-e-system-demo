import { useState } from "react";

export const usePaginationClient = (
    items: any[],
    itemsPerPage: number
) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        startIndex,
        currentItems,
        handlePageChange
    }
}