
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
        <TableHead className="w-[50px] pl-4">
          <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
        </TableHead>
        <TableHead className="w-[60px]">ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Site</TableHead>
        <TableHead>Phase</TableHead>
        <TableHead>State</TableHead>
        <TableHead className="text-right">Reg. Date</TableHead>
      </TableRow>
    </TableHeader>
  );
};
