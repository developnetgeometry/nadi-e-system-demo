
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { EnhancedOrgUser } from "@/types/organization";

interface OrganizationMemberProps {
  orgUser: EnhancedOrgUser;
  onRemove: (userId: string) => void;
}

export const OrganizationMember = ({ orgUser, onRemove }: OrganizationMemberProps) => {
  const userProfile = orgUser.profiles;
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-center space-x-3">
        <Avatar>
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
          onClick={() => onRemove(orgUser.user_id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
