
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";

interface ActivitySearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export const ActivitySearch = ({ 
  searchTerm, 
  setSearchTerm, 
  onRefresh, 
  onExport 
}: ActivitySearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex-1 w-full">
        <Input
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </div>
  );
};
