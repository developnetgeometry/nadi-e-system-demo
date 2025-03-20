
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserGroup } from "./types";
import { Edit, Trash2, Plus } from "lucide-react";
import { UserGroupDialog } from "./UserGroupDialog";
import { DeleteUserGroupDialog } from "./DeleteUserGroupDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import { UserTypeChips } from "./UserTypeChips";

export const UserGroupList = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);

  const { data: userGroups = [], isLoading } = useQuery({
    queryKey: ["user-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nd_user_group")
        .select("*")
        .order("group_name");

      if (error) {
        toast.error("Failed to fetch user groups");
        throw error;
      }

      return data as UserGroup[];
    },
  });

  const handleEdit = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="py-4">Loading user groups...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Groups</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </Button>
      </div>

      {userGroups.length === 0 ? (
        <EmptyState
          title="No user groups"
          description="Start by creating your first user group."
          action={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          }
        />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User Types</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.group_name}</TableCell>
                  <TableCell>{group.description || "—"}</TableCell>
                  <TableCell>
                    <UserTypeChips userTypes={group.user_types} />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(group)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(group)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <UserGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userGroup={null}
      />

      {selectedGroup && (
        <>
          <UserGroupDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            userGroup={selectedGroup}
          />

          <DeleteUserGroupDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            userGroup={selectedGroup}
          />
        </>
      )}
    </div>
  );
};
