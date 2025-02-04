import { Table, TableBody } from "@/components/ui/table";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import { Profile } from "@/types/auth";

interface UserTableProps {
  users: Profile[];
  isLoading: boolean;
  selectedUsers: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectUser: (userId: string, checked: boolean) => void;
  onEditUser: (user: Profile) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserTable = ({
  users,
  isLoading,
  selectedUsers,
  onSelectAll,
  onSelectUser,
  onEditUser,
  onDeleteUser,
}: UserTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <UserTableHeader
          onSelectAll={onSelectAll}
          allSelected={users.length ? selectedUsers.length === users.length : false}
        />
        <TableBody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-8">
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(user.id)}
                onSelect={onSelectUser}
                onEdit={onEditUser}
                onDelete={onDeleteUser}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};