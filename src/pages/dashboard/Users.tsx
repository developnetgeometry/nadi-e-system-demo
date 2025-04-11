import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Profile } from "@/types/auth";
import { Plus, User, UserPlus, UserCog, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { UserTable } from "@/components/users/UserTable";

type SortDirection = "asc" | "desc" | null;
type SortField = "name" | "email" | "phone" | "status" | "site" | "phase" | "state" | "created_at" | null;

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pageSize = 20;

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ["users", page, searchTerm, sortField, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .eq('user_type', 'member')
        .ilike('full_name', `%${searchTerm}%`)
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (sortField && sortDirection) {
        query = query.order(sortField, { ascending: sortDirection === "asc" });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error, count } = await query
        .returns<Profile[]>()
        .count();

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      return { data, count };
    },
    keepPreviousData: true,
  });

  const totalUsers = usersData?.count || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allUserIds = usersData?.data?.map((user) => user.id) || [];
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleEditUser = (user: Profile) => {
    // Implement edit functionality here
    toast({
      title: "Edit User",
      description: `Editing user: ${user.full_name}`,
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", userId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        refetch(); // Refresh the user list
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const deleteSelectedUsers = async (userIds: string[]) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .in("id", userIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Selected users deleted successfully",
      });
      refetch(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting selected users:", error);
      toast({
        title: "Error",
        description: "Failed to delete selected users",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelectedUsers = async () => {
    try {
      await deleteSelectedUsers(selectedUsers);
      setSelectedUsers([]); // Clear selected users after deletion
    } catch (error) {
      console.error("Error deleting selected users:", error);
      toast({
        title: "Error",
        description: "Failed to delete selected users",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelected = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to delete.",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedUsers.length} selected users?`)) {
      handleDeleteSelectedUsers();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <UserCog className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage users and their roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="search">Search:</Label>
                <Input
                  type="text"
                  id="search"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reset to first page on search
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <Button onClick={handleDeleteSelected} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              <UserTable
                users={usersData?.data || []}
                isLoading={isLoading}
                selectedUsers={selectedUsers}
                onSelectAll={handleSelectAll}
                onSelectUser={handleSelectUser}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Users;
