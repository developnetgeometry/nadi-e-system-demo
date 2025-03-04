
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Clock } from "lucide-react";
import { ActivitySearch } from "./ActivitySearch";
import { AuditLogTable } from "./AuditLogTable";
import { SessionTable } from "./SessionTable";
import { useActivityLogs } from "@/hooks/use-activity-logs";
import { exportToCSV } from "./utils/activity-utils";

export const ActivityLogList = () => {
  const {
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
    logs,
    sessions,
    isLoadingLogs,
    isLoadingSessions,
    handleRefresh
  } = useActivityLogs();

  // Handle export
  const handleExport = () => {
    exportToCSV(logs, 'audit-logs.csv');
  };

  return (
    <div className="space-y-6">
      <ActivitySearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            User Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-4">
          <AuditLogTable 
            logs={logs}
            isLoading={isLoadingLogs}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <SessionTable 
            sessions={sessions}
            isLoading={isLoadingSessions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
