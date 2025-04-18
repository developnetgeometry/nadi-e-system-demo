import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RoleHeaderProps {
  onCreateRole: () => void;
}

export const RoleHeader = ({ onCreateRole }: RoleHeaderProps) => {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Roles & Permissions</h1>
        <p className="text-muted-foreground">
          Manage user roles and their associated permissions
        </p>
      </div>
      <div className="ml-auto">
        <Button
          onClick={onCreateRole}
          className="mr-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Role
        </Button>
      </div>
    </div>
  );
};
