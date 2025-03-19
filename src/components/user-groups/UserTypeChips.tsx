
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/auth";

interface UserTypeChipsProps {
  userTypes?: UserType[];
  limit?: number;
}

export const UserTypeChips = ({ userTypes = [], limit = 3 }: UserTypeChipsProps) => {
  if (!userTypes || userTypes.length === 0) {
    return <span className="text-muted-foreground text-sm italic">No user types assigned</span>;
  }

  const displayedTypes = userTypes.slice(0, limit);
  const remainingCount = userTypes.length - limit;

  return (
    <div className="flex flex-wrap gap-1">
      {displayedTypes.map((type) => (
        <Badge key={type} variant="outline" className="text-xs">
          {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
};
