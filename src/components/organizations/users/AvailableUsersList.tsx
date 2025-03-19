
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  user_type: string;
  user_group?: number;
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
      <Alert variant="destructive" className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-center py-2 text-muted-foreground">
          {searchTerm || filterUserType !== "all" 
            ? "No users match your search criteria." 
            : "No eligible users found with the appropriate user type for this organization. Please ensure users have the correct user type prefix (e.g., tp_* for TP organizations)."}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{user.full_name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
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
