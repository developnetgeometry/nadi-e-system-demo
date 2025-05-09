import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationFiltersProps {
  typeFilter: string;
  setTypeFilter: (type: string) => void;
}

export const NotificationFilters = ({
  typeFilter,
  setTypeFilter,
}: NotificationFiltersProps) => {
  return (
    <div className="bg-background p-4 border-b">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="info">Information</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
