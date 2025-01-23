import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PermissionGroup as PermissionGroupType } from "@/lib/permissions";

interface PermissionGroupProps {
  group: PermissionGroupType;
  selectedPermissions: string[];
  onTogglePermission: (permissionId: string) => void;
}

export const PermissionGroup = ({
  group,
  selectedPermissions,
  onTogglePermission,
}: PermissionGroupProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{group.module}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {group.permissions.map((permission) => (
          <div
            key={permission.id}
            className="flex items-center justify-between py-2"
          >
            <div className="space-y-0.5">
              <Label htmlFor={permission.id}>{permission.name}</Label>
              <div className="text-sm text-muted-foreground">
                {permission.description}
              </div>
            </div>
            <Switch
              id={permission.id}
              checked={selectedPermissions.includes(permission.id)}
              onCheckedChange={() => onTogglePermission(permission.id)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};