import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { UserToolbar } from "@/components/users/UserToolbar";
import { fetchUsers, deleteUsers, exportUsersToCSV } from "@/utils/users-utils";
import type { Profile } from "@/types/auth";
import { UserHeader } from "@/components/users/UserHeader";
import { UserSearch } from "@/components/users/UserSearch";
import { UserTable } from "@/components/users/UserTable";

type SortDirection = "asc" | "desc" | null;
type SortField = "name" | "email" | "phone" | "status" | "site" | "phase" | "state" | "created_at" | null;

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("");
  const [siteFilter, setSiteFilter] = useState<string>("all_sites");
  const [phaseFilter, setPhaseFilter] = useState<string>("all_phases");
  const [stateFilter, setStateFilter] = useState<string>("all_states");
  const [dateFilter, setDateFilter] = useState<string>("all_dates");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userToEdit, setUserToEdit] = useState<Profile | undefined>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          // We'll just use alphabetical sorting since these are generated
          // In a real implementation, you'd use actual field values
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

  const handleExportUsers = useCallback(() => {
    const csvContent = exportUsersToCSV(users);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [users]);

  const handleApplyFilters = useCallback(() => {
    // This would typically send a request to the server with all filters
    // For now, we'll just log the filters to the console
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

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto">
        <UserHeader onCreateUser={() => setIsCreateDialogOpen(true)} />

        <div className="flex flex-col gap-4 mb-6">
          <UserSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userTypeFilter={userTypeFilter}
            onUserTypeFilterChange={setUserTypeFilter}
            onExport={handleExportUsers}
            onApplyFilters={handleApplyFilters}
            siteFilter={siteFilter}
            onSiteFilterChange={setSiteFilter}
            phaseFilter={phaseFilter}
            onPhaseFilterChange={setPhaseFilter}
            stateFilter={stateFilter}
            onStateFilterChange={setStateFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            onReset={handleResetFilters}
          />

          {selectedUsers.length > 0 && (
            <UserToolbar
              selectedCount={selectedUsers.length}
              onExport={handleExportUsers}
              onDelete={handleDeleteSelected}
            />
          )}
        </div>

        <UserTable
          users={paginatedUsers}
          isLoading={isLoading}
          selectedUsers={selectedUsers}
          onSelectAll={handleSelectAll}
          onSelectUser={handleSelectUser}
          onEditUser={(user) => {
            setUserToEdit(user);
            setIsEditDialogOpen(true);
          }}
          onDeleteUser={(userId) => deleteUsersMutation.mutate([userId])}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 NADI. All rights reserved.
        </div>
      </div>

      <UserFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }}
      />

      <UserFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={userToEdit}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setUserToEdit(undefined);
        }}
      />
    </DashboardLayout>
  );
};

export default Users;
