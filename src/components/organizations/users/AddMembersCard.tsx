
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserType } from "@/types/auth";
import { UserFilters } from "./UserFilters";
import { RoleSelector } from "./RoleSelector";
import { AvailableUsersList } from "./AvailableUsersList";

interface AddMembersCardProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterUserType: string;
  onFilterChange: (value: string) => void;
  eligibleUserTypes: UserType[];
  selectedRole: string;
  onRoleChange: (value: string) => void;
  users: any[];
  isLoading: boolean;
  onAddUser: (userId: string) => void;
}

export const AddMembersCard = ({
  searchTerm,
  onSearchChange,
  filterUserType,
  onFilterChange,
  eligibleUserTypes,
  selectedRole,
  onRoleChange,
  users,
  isLoading,
  onAddUser
}: AddMembersCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <UserFilters 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            filterUserType={filterUserType}
            onFilterChange={onFilterChange}
            eligibleUserTypes={eligibleUserTypes}
          />

          <div className="flex items-center gap-4">
            <RoleSelector 
              selectedRole={selectedRole}
              onRoleChange={onRoleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Available Users</h4>
          
          <AvailableUsersList 
            users={users}
            searchTerm={searchTerm}
            filterUserType={filterUserType}
            isLoading={isLoading}
            onAddUser={onAddUser}
          />
        </div>
      </CardContent>
    </Card>
  );
};
