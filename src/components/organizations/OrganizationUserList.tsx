
import { useState } from "react";
import { useOrganizations } from "@/hooks/use-organizations";
import { useUsers } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, UserRound } from "lucide-react";
import { Profile } from "@/types/auth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const userSchema = z.object({
  user_id: z.string().min(1, "User is required"),
  role: z.string().min(1, "Role is required"),
});

interface OrganizationUserListProps {
  organizationId: string;
}

export function OrganizationUserList({ organizationId }: OrganizationUserListProps) {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<{ id: string; name: string } | null>(null);
  
  const { useOrganizationUsersQuery, useAddUserToOrganizationMutation, useRemoveUserFromOrganizationMutation } = useOrganizations();
  const { useUsersQuery } = useUsers();
  
  const { data: organizationUsers = [], isLoading } = useOrganizationUsersQuery(organizationId);
  const { data: allUsers = [] } = useUsersQuery();
  
  const addUserMutation = useAddUserToOrganizationMutation();
  const removeUserMutation = useRemoveUserFromOrganizationMutation();

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      user_id: "",
      role: "member",
    },
  });

  const handleAddUser = (values: z.infer<typeof userSchema>) => {
    addUserMutation.mutate({
      organization_id: organizationId,
      user_id: values.user_id,
      role: values.role,
    }, {
      onSuccess: () => {
        setIsAddUserDialogOpen(false);
        form.reset();
      }
    });
  };

  const handleRemoveUser = () => {
    if (!userToRemove) return;
    
    removeUserMutation.mutate({
      organizationId,
      userId: userToRemove.id,
    }, {
      onSuccess: () => {
        setUserToRemove(null);
      }
    });
  };

  // Filter out users already in the organization
  const availableUsers = allUsers.filter(
    (user) => !organizationUsers.some((ou) => ou.user_id === user.id)
  );

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Organization Members</h3>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading members...</div>
      ) : organizationUsers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No members in this organization yet
        </div>
      ) : (
        <div className="space-y-2">
          {organizationUsers.map((userRole) => {
            // Get the full user data and role
            const userData = userRole.profiles as unknown as Profile;
            
            return (
              <div
                key={userRole.id}
                className="flex justify-between items-center p-3 rounded-md border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {userData?.avatar_url ? (
                      <img
                        src={userData.avatar_url}
                        alt={userData.full_name || ""}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{userData?.full_name || "Unknown User"}</p>
                    <p className="text-sm text-muted-foreground">{userData?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm px-2 py-1 rounded-full bg-muted">
                    {userRole.role}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setUserToRemove({ 
                      id: userRole.user_id, 
                      name: userData?.full_name || "this user" 
                    })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User to Organization</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableUsers.length === 0 ? (
                          <div className="p-2 text-center text-muted-foreground">
                            No available users
                          </div>
                        ) : (
                          availableUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name} ({user.email})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddUserDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={availableUsers.length === 0}>
                  Add User
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Remove User Confirmation Dialog */}
      <AlertDialog open={!!userToRemove} onOpenChange={(open) => !open && setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {userToRemove?.name} from this organization?
              This action can be reversed by adding the user again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
