
import { useState, useCallback, useEffect } from "react";
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

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("");
  const [siteFilter, setSiteFilter] = useState<string>("");
  const [phaseFilter, setPhaseFilter] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userToEdit, setUserToEdit] = useState<Profile | undefined>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

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

  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, userTypeFilter, siteFilter, phaseFilter, stateFilter, dateFilter]);

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
    setSiteFilter("");
    setPhaseFilter("");
    setStateFilter("");
    setDateFilter("");
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
            siteFilter={siteFilter || "all_sites"}
            onSiteFilterChange={setSiteFilter}
            phaseFilter={phaseFilter || "all_phases"}
            onPhaseFilterChange={setPhaseFilter}
            stateFilter={stateFilter || "all_states"}
            onStateFilterChange={setStateFilter}
            dateFilter={dateFilter || "all_dates"}
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
