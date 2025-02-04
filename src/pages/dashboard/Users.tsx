import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Table, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { UserTableHeader } from "@/components/users/UserTableHeader";
import { UserTableRow } from "@/components/users/UserTableRow";
import { UserToolbar } from "@/components/users/UserToolbar";
import { fetchUsers, deleteUsers, exportUsersToCSV } from "@/utils/users-utils";
import type { Profile, UserType } from "@/types/auth";

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

  const userTypes: UserType[] = [
    "member",
    "vendor",
    "tp",
    "sso",
    "dusp",
    "super_admin",
    "medical_office",
    "staff_internal",
    "staff_external"
  ];

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={userTypeFilter}
            onValueChange={setUserTypeFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {userTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, ' ').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <UserToolbar
          selectedCount={selectedUsers.length}
          onExport={handleExportUsers}
          onDelete={handleDeleteSelected}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <UserTableHeader
            onSelectAll={handleSelectAll}
            allSelected={users?.length ? selectedUsers.length === users.length : false}
          />
          <TableBody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  Loading users...
                </td>
              </tr>
            ) : users?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  No users found
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isSelected={selectedUsers.includes(user.id)}
                  onSelect={handleSelectUser}
                  onEdit={(user) => {
                    setUserToEdit(user);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={(userId) => deleteUsersMutation.mutate([userId])}
                />
              ))
            )}
          </TableBody>
        </Table>
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