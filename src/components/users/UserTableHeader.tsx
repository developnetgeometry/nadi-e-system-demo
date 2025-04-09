
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface UserTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  showRowNumbers?: boolean;
}

export const UserTableHeader = ({ 
  onSelectAll, 
  allSelected,
  showRowNumbers = true 
}: UserTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        {showRowNumbers && (
          <TableHead className="w-[60px] text-center">No.</TableHead>
        )}
        <TableHead className="w-[50px]">
          <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Created</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
