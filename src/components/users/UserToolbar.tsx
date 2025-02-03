import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

interface UserToolbarProps {
  selectedCount: number;
  onExport: () => void;
  onDelete: () => void;
}

export const UserToolbar = ({
  selectedCount,
  onExport,
  onDelete,
}: UserToolbarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
      <span className="text-sm text-muted-foreground">
        {selectedCount} users selected
      </span>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Selected
      </Button>
    </div>
  );
};