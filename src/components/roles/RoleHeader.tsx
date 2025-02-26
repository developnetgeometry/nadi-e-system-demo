
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RoleHeaderProps {
  onCreateRole: () => void;
}

export const RoleHeader = ({ onCreateRole }: RoleHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground">
          Manage user roles and their associated permissions
        </p>
      </div>
      <Button 
        onClick={onCreateRole}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Role
      </Button>
    </div>
  );
};
