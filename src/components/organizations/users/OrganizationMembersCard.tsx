
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { EnhancedOrgUser } from "@/types/organization";
import { OrganizationMembersList } from "./OrganizationMembersList";

interface OrganizationMembersCardProps {
  orgUsers: EnhancedOrgUser[];
  isLoading: boolean;
  error: any;
  onRemoveUser: (userId: string) => void;
}

export const OrganizationMembersCard = ({ 
  orgUsers, 
  isLoading, 
  error, 
  onRemoveUser 
}: OrganizationMembersCardProps) => {
  if (error) {
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
          orgUsers={orgUsers}
          isLoading={isLoading}
          onRemoveUser={onRemoveUser}
        />
      </CardContent>
    </Card>
  );
};
