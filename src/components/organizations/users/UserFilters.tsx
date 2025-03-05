
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserType } from "@/types/auth";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterUserType: string;
  onFilterChange: (value: string) => void;
  eligibleUserTypes: UserType[];
}

export const UserFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filterUserType, 
  onFilterChange,
  eligibleUserTypes 
}: UserFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search users..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="w-40">
        <Select
          value={filterUserType}
          onValueChange={onFilterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {eligibleUserTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
