
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { UserType } from "@/types/auth";

interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  userTypeFilter: string;
  onUserTypeFilterChange: (value: string) => void;
}

export const UserSearch = ({
  searchQuery,
  onSearchChange,
  userTypeFilter,
  onUserTypeFilterChange,
}: UserSearchProps) => {
  const userTypes: UserType[] = [
    "member",
    "vendor",
    "tp",
    "sso",
    "dusp",
    "super_admin",
    "medical_office",
    "staff_internal",
    "staff_external"
  ];

  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={userTypeFilter}
        onValueChange={onUserTypeFilterChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {userTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type.replace(/_/g, ' ').split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
