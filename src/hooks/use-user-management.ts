
import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchUsers, deleteUsers } from "@/utils/users-utils";
import type { Profile } from "@/types/auth";

export type SortDirection = "asc" | "desc" | null;
export type SortField = "name" | "email" | "phone" | "status" | "site" | "phase" | "state" | "created_at" | null;

export function useUserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("");
  const [siteFilter, setSiteFilter] = useState<string>("all_sites");
  const [phaseFilter, setPhaseFilter] = useState<string>("all_phases");
  const [stateFilter, setStateFilter] = useState<string>("all_states");
  const [dateFilter, setDateFilter] = useState<string>("all_dates");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Set page size to 20
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users with search query and user type filter
  const { data: fetchedUsers = [], isLoading } = useQuery({
    queryKey: ["users", searchQuery, userTypeFilter],
    queryFn: () => fetchUsers(searchQuery, userTypeFilter),
  });

  // Apply frontend filtering based on additional filters
  const users = fetchedUsers.filter(user => {
    // Add filtering logic here when we have actual data with these fields
    return true;
  });

  // Apply sorting to the filtered users
  const sortedUsers = useMemo(() => {
    if (!sortField || !sortDirection) return users;
    
    return [...users].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case "name":
          aValue = a.full_name || "";
          bValue = b.full_name || "";
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "phone":
          aValue = a.phone_number || "";
          bValue = b.phone_number || "";
          break;
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          // For mock data fields (status, site, phase, state)
          return 0;
      }
      
      const compareResult = typeof aValue === 'number' && typeof bValue === 'number'
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue));
        
      return sortDirection === "asc" ? compareResult : -compareResult;
    });
  }, [users, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, userTypeFilter, siteFilter, phaseFilter, stateFilter, dateFilter]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      // Toggle direction or clear sort
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      // New sort field
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField, sortDirection]);

  // Delete users mutation
  const deleteUsersMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUsers([]);
      toast({
        title: "Success",
        description: "Users deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting users:", error);
      toast({
        title: "Error",
        description: "Failed to delete users",
        variant: "destructive",
      });
    },
  });

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedUsers(checked ? paginatedUsers.map((user) => user.id) : []);
  }, [paginatedUsers]);

  const handleSelectUser = useCallback((userId: string, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedUsers.length > 0) {
      deleteUsersMutation.mutate(selectedUsers);
    }
  }, [selectedUsers, deleteUsersMutation]);

  const handleApplyFilters = useCallback(() => {
    console.log("Applied filters:", {
      searchQuery,
      userTypeFilter,
      siteFilter,
      phaseFilter,
      stateFilter,
      dateFilter
    });
    
    toast({
      title: "Filters Applied",
      description: "User list has been filtered",
    });
  }, [searchQuery, userTypeFilter, siteFilter, phaseFilter, stateFilter, dateFilter, toast]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setUserTypeFilter("");
    setSiteFilter("all_sites");
    setPhaseFilter("all_phases");
    setStateFilter("all_states");
    setDateFilter("all_dates");
    setCurrentPage(1);
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  }, [toast]);

  return {
    // State
    searchQuery,
    userTypeFilter,
    siteFilter,
    phaseFilter,
    stateFilter, 
    dateFilter,
    selectedUsers,
    currentPage,
    totalPages,
    sortField,
    sortDirection,
    isLoading,
    
    // Data
    users: paginatedUsers,
    
    // Actions
    setSearchQuery,
    setUserTypeFilter,
    setSiteFilter,
    setPhaseFilter,
    setStateFilter,
    setDateFilter,
    setCurrentPage,
    handleSort,
    handleSelectAll,
    handleSelectUser,
    handleDeleteSelected,
    handleApplyFilters,
    handleResetFilters,
    
    // Mutations
    deleteUsersMutation
  };
}
