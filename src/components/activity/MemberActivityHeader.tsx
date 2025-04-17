
import { ActivitySearch } from "./ActivitySearch";
import { exportToCSV } from "./utils/activity-utils";

interface MemberActivityHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh: () => void;
  logs: any[];
}

export const MemberActivityHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  onRefresh,
  logs
}: MemberActivityHeaderProps) => {
  // Handle export
  const handleExport = () => {
    exportToCSV(logs, 'member-logs.csv');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold mb-6">Member Activity Logs</h1>
      
      <ActivitySearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={onRefresh}
        onExport={handleExport}
      />
    </div>
  );
};
