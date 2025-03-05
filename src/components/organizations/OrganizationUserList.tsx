
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrganizations } from "@/hooks/use-organizations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, UserPlus, X, Search } from "lucide-react";
import { OrganizationUser } from "@/types/organization";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserType } from "@/types/auth";

export const OrganizationUserList = () => {
  // Get organization ID from route params
  const { id } = useParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [filterUserType, setFilterUserType] = useState<string>("all");

  const { 
    useOrganizationQuery,
    useOrganizationUsersQuery, 
    useEligibleUsersQuery,
    useAddUserToOrganizationMutation,
    useRemoveUserFromOrganizationMutation 
  } = useOrganizations();

  // Fetch organization to determine eligible user types
  const { data: organization } = useOrganizationQuery(id!);

  // Get eligible user types based on organization type
  const eligibleUserTypes: UserType[] = organization?.type === "dusp" 
    ? ["dusp", "tp_admin", "tp"] 
    : ["tp_admin", "tp"];

  // Fetch users already in the organization
  const { 
    data: orgUsers = [], 
    isLoading: loadingOrgUsers, 
    error: orgUsersError 
  } = useOrganizationUsersQuery(id!);

  // Fetch all available users of eligible types
  const { 
    data: eligibleUsers = [], 
    isLoading: loadingEligibleUsers
  } = useEligibleUsersQuery(eligibleUserTypes);

  // Filter users not already in the organization
  const availableUsers = eligibleUsers.filter(
    (user) => !orgUsers.some((orgUser) => orgUser.user_id === user.id)
  );

  // Filter available users by search term and selected user type
  const filteredAvailableUsers = availableUsers.filter(
    (user) => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = 
        filterUserType === "all" || 
        user.user_type === filterUserType;
      
      return matchesSearch && matchesType;
    }
  );

  // Mutations
  const addUserMutation = useAddUserToOrganizationMutation();
  const removeUserMutation = useRemoveUserFromOrganizationMutation();

  // Add user to organization
  const handleAddUser = (userId: string) => {
    addUserMutation.mutate({ 
      organization_id: id!, 
      user_id: userId,
      role: selectedRole 
    });
  };

  // Remove user from organization
  const handleRemoveUser = (userId: string) => {
    removeUserMutation.mutate({ 
      organizationId: id!, 
      userId 
    });
  };

  if (orgUsersError) {
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
          <CardTitle className="flex items-center justify-between">
            <span>Organization Members</span>
            <Badge variant="outline">
              {orgUsers.length} {orgUsers.length === 1 ? 'Member' : 'Members'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingOrgUsers ? (
            <div className="flex justify-center py-4">Loading members...</div>
          ) : orgUsers && orgUsers.length > 0 ? (
            <div className="space-y-4">
              {orgUsers.map((orgUser) => {
                // Find the user profile for this organization user
                const userProfile = orgUser.profiles;
                
                return (
                  <div key={orgUser.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
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
                      <Badge variant="outline" className="capitalize">
                        {userProfile?.user_type || "unknown"}
                      </Badge>
                      <Badge>{orgUser.role}</Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveUser(orgUser.user_id)}
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
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-40">
                <Select
                  value={filterUserType}
                  onValueChange={setFilterUserType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {eligibleUserTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Assign Role
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Available Users</h4>
            
            {loadingEligibleUsers ? (
              <div className="flex justify-center py-4">Loading users...</div>
            ) : filteredAvailableUsers.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
                {filteredAvailableUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{user.full_name?.substring(0, 2) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.full_name || "Unknown User"}</div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <Badge variant="outline" className="text-xs capitalize">{user.user_type}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAddUser(user.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground border rounded-md">
                {searchTerm || filterUserType !== "all" 
                  ? "No users match your search criteria." 
                  : "No users available to add."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
