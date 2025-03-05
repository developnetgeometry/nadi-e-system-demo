
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, UserPlus, X } from "lucide-react";
import { OrganizationUser } from "@/types/organization";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const OrganizationUserList = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users already in the organization
  const { data: orgUsers, isLoading: loadingOrgUsers, error: orgUsersError } = useQuery({
    queryKey: ["organization-users", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_users")
        .select("*")
        .eq("organization_id", id);

      if (error) throw error;
      return data as OrganizationUser[];
    },
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching organization users:", error);
        toast({
          title: "Error",
          description: "Failed to load organization users",
          variant: "destructive",
        });
      }
    }
  });

  // Fetch all available users to add
  const { data: allUsers, isLoading: loadingAllUsers, error: allUsersError } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) throw error;
      return data;
    },
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching profiles:", error);
        toast({
          title: "Error",
          description: "Failed to load user profiles",
          variant: "destructive",
        });
      }
    }
  });

  // Filter users not already in the organization
  const availableUsers = allUsers?.filter(
    (user) => !orgUsers?.some((orgUser) => orgUser.user_id === user.id)
  );

  // Filter available users by search term
  const filteredAvailableUsers = availableUsers?.filter(
    (user) => user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add user to organization
  const addUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("organization_users")
        .insert([
          { 
            organization_id: id, 
            user_id: userId,
            role: "member" 
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-users", id] });
      toast({
        title: "Success",
        description: "User added to organization",
      });
    },
    onError: (error) => {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user to organization",
        variant: "destructive",
      });
    }
  });

  // Remove user from organization
  const removeUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("organization_users")
        .delete()
        .eq("organization_id", id)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-users", id] });
      toast({
        title: "Success",
        description: "User removed from organization",
      });
    },
    onError: (error) => {
      console.error("Error removing user:", error);
      toast({
        title: "Error",
        description: "Failed to remove user from organization",
        variant: "destructive",
      });
    }
  });

  if (orgUsersError || allUsersError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load users. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingOrgUsers ? (
            <div className="flex justify-center py-4">Loading members...</div>
          ) : orgUsers && orgUsers.length > 0 ? (
            <div className="space-y-4">
              {orgUsers.map((orgUser) => {
                // Find the user profile for this organization user
                const userProfile = allUsers?.find(profile => profile.id === orgUser.user_id);
                
                return (
                  <div key={orgUser.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{userProfile?.full_name?.substring(0, 2) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{userProfile?.full_name || "Unknown User"}</div>
                        <div className="text-sm text-muted-foreground">{userProfile?.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge>{orgUser.role}</Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeUserMutation.mutate(orgUser.user_id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No members in this organization yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-3 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loadingAllUsers ? (
            <div className="flex justify-center py-4">Loading users...</div>
          ) : filteredAvailableUsers && filteredAvailableUsers.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredAvailableUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{user.full_name?.substring(0, 2) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.full_name || "Unknown User"}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => addUserMutation.mutate(user.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No users available to add.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
