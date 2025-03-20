
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  user_type: string;
  user_group?: number;
  user_group_name?: string;
  organization_id?: string;
}

interface AvailableUsersListProps {
  users: UserProfile[];
  searchTerm: string;
  filterUserType: string;
  isLoading: boolean;
  onAddUser: (userId: string) => void;
}

export const AvailableUsersList = ({ 
  users, 
  searchTerm, 
  filterUserType, 
  isLoading, 
  onAddUser 
}: AvailableUsersListProps) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (users.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground border rounded-md">
        {searchTerm || filterUserType !== "all" 
          ? "No users match your search criteria." 
          : "No users available to add with the appropriate user group."}
      </div>
    );
  }
  
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{user.full_name?.substring(0, 2) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.full_name || "Unknown User"}</div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm text-muted-foreground">{user.email}</div>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs capitalize">{user.user_type}</Badge>
                  {user.user_group_name && (
                    <Badge variant="secondary" className="text-xs">
                      Group: {user.user_group_name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onAddUser(user.id)}
            type="button"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      ))}
    </div>
  );
}
