
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, Users, Pencil } from "lucide-react";
import { TableRowNumber } from "@/components/ui/TableRowNumber";

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  users_count: number;
}

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
}

export const RoleTable = ({ roles, onEdit }: RoleTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead className="w-[60px] text-center">No.</TableHead>
            <TableHead className="w-[250px]">Role Name</TableHead>
            <TableHead className="max-w-[400px]">Description</TableHead>
            <TableHead className="w-[100px]">Users</TableHead>
            <TableHead className="w-[150px]">Created At</TableHead>
            <TableHead className="w-[200px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role, index) => (
            <TableRow key={role.id} className="hover:bg-muted/50">
              <TableRowNumber index={index} />
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>{role.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {role.description}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{role.users_count}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(role.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(role)}
                  className="hover:bg-muted"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/roles/${role.id}`)}
                  className="hover:bg-muted"
                >
                  Permissions
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
