import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (value: string) => void;
}

export const RoleSelector = ({
  selectedRole,
  onRoleChange,
}: RoleSelectorProps) => {
  return (
    <div className="flex-1">
      <label className="text-sm text-muted-foreground mb-1 block">
        Assign Role
      </label>
      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="management">Management</SelectItem>
          <SelectItem value="region">Region</SelectItem>
          <SelectItem value="hr">Human Resource</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="operation">Operation</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
