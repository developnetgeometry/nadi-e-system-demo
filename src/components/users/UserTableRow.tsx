
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, UserCog, Trash2 } from "lucide-react";
import { Profile } from "@/types/auth";
import { TableRowNumber } from "@/components/ui/TableRowNumber";

interface UserTableRowProps {
  user: Profile;
  isSelected: boolean;
  onSelect: (userId: string, checked: boolean) => void;
  onEdit: (user: Profile) => void;
  onDelete: (userId: string) => void;
  rowIndex: number;
}

export const UserTableRow = ({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  rowIndex,
}: UserTableRowProps) => {
  return (
    <TableRow key={user.id}>
      <TableRowNumber index={rowIndex} />
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(user.id, !!checked)}
        />
      </TableCell>
      <TableCell>{user.full_name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell className="capitalize">
        {user.user_type.replace(/_/g, " ")}
      </TableCell>
      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <UserCog className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(user.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
