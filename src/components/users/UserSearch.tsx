
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  userTypeFilter: string;
  onUserTypeFilterChange: (value: string) => void;
}

interface userType {
  name: string;
  description: string;
}

export const UserSearch = ({
  searchQuery,
  onSearchChange,
  userTypeFilter,
  onUserTypeFilterChange,
}: UserSearchProps) => {
  const [userTypes, setUserTypes] = useState<userType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('roles')
          .select('name, description')
          .order('name');

        if (error) {
          console.error('Error fetching roles:', error);
          throw error;
        }

        setUserTypes(data as userType[]);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTypes();
  }, []);

  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={userTypeFilter}
        onValueChange={onUserTypeFilterChange}
        disabled={loading}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {userTypes.map((userTypes) => (
            <SelectItem key={userTypes.name} value={userTypes.name}>
              {userTypes.name.replace(/_/g, ' ').split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
