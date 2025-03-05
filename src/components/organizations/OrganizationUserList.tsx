import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrganizations } from "@/hooks/use-organizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserType } from "@/types/auth";
import { EnhancedOrgUser } from "@/types/organization";
import { OrganizationMembersList } from "./users/OrganizationMembersList";
import { UserFilters } from "./users/UserFilters";
import { RoleSelector } from "./users/RoleSelector";
import { AvailableUsersList } from "./users/AvailableUsersList";

export const OrganizationUserList = () => {
  // Get organization ID from route params
  const { id } = useParams();
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
    ? ["dusp", "tp", "tp_admin"] 
    : ["tp", "tp_admin"];

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

  const enhancedOrgUsers = orgUsers as unknown as EnhancedOrgUser[];

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
          <OrganizationMembersList 
            orgUsers={enhancedOrgUsers}
            isLoading={loadingOrgUsers}
            onRemoveUser={handleRemoveUser}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <UserFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterUserType={filterUserType}
              onFilterChange={setFilterUserType}
              eligibleUserTypes={eligibleUserTypes}
            />

            <div className="flex items-center gap-4">
              <RoleSelector 
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
              />
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Available Users</h4>
            
            <AvailableUsersList 
              users={filteredAvailableUsers}
              searchTerm={searchTerm}
              filterUserType={filterUserType}
              isLoading={loadingEligibleUsers}
              onAddUser={handleAddUser}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
