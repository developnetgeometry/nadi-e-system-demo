
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  user_type: string;
  avatar_url?: string;
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
          : "No users available to add."}
      </div>
    );
  }
  
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
      {users.map((user) => (
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
