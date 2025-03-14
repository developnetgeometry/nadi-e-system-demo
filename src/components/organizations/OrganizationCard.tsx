
import { Organization } from "@/types/organization";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Users, Pencil, Trash2, Building } from "lucide-react";

interface OrganizationCardProps {
  organization: Organization;
  parentName?: string;
  onEdit: () => void;
  onDelete: () => void;
  onManageUsers: () => void;
  onViewDetails: () => void;
}

export function OrganizationCard({
  organization,
  parentName,
  onEdit,
  onDelete,
  onManageUsers,
  onViewDetails,
}: OrganizationCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="h-24 bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
          {organization.logo_url ? (
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
              <AspectRatio ratio={1} className="w-full h-full">
                <img
                  src={organization.logo_url}
                  alt={organization.name}
                  className="object-contain w-full h-full"
                />
              </AspectRatio>
            </div>
          ) : (
            <Building className="h-12 w-12 text-white" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{organization.name}</h3>
          <p className="text-sm text-muted-foreground">
            Type: <span className="font-medium uppercase">{organization.type}</span>
          </p>
          {parentName && (
            <p className="text-sm text-muted-foreground">
              Parent: <span className="font-medium">{parentName}</span>
            </p>
          )}
          <p className="text-sm line-clamp-2">
            {organization.description || "No description available"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onViewDetails}
        >
          <Building className="h-4 w-4" />
          <span>Details</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onManageUsers}
        >
          <Users className="h-4 w-4" />
          <span>Users</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
