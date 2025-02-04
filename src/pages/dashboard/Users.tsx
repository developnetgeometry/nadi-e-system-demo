import { useState, useCallback } from "react";
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userToEdit, setUserToEdit] = useState<Profile | undefined>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", searchQuery, userTypeFilter],
    queryFn: () => fetchUsers(),
  });

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
    setSelectedUsers(checked ? users.map((user) => user.id) : []);
  }, [users]);

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

  return (
    <DashboardLayout>
      <UserHeader onCreateUser={() => setIsCreateDialogOpen(true)} />

      <div className="flex flex-col gap-4 mb-6">
        <UserSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userTypeFilter={userTypeFilter}
          onUserTypeFilterChange={setUserTypeFilter}
        />

        <UserToolbar
          selectedCount={selectedUsers.length}
          onExport={handleExportUsers}
          onDelete={handleDeleteSelected}
        />
      </div>

      <UserTable
        users={users}
        isLoading={isLoading}
        selectedUsers={selectedUsers}
        onSelectAll={handleSelectAll}
        onSelectUser={handleSelectUser}
        onEditUser={(user) => {
          setUserToEdit(user);
          setIsEditDialogOpen(true);
        }}
        onDeleteUser={(userId) => deleteUsersMutation.mutate([userId])}
      />

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