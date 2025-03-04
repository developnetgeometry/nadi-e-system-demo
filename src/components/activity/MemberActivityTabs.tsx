
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Clock } from "lucide-react";
import { AuditLogTable } from "./AuditLogTable";
import { SessionTable } from "./SessionTable";

interface MemberActivityTabsProps {
  logs: any[];
  sessions: any[];
  isLoadingLogs: boolean;
  isLoadingSessions: boolean;
  filterBy: "all" | "login" | "logout" | "actions";
  setFilterBy: (filter: "all" | "login" | "logout" | "actions") => void;
}

export const MemberActivityTabs = ({
  logs,
  sessions,
  isLoadingLogs,
  isLoadingSessions,
  filterBy,
  setFilterBy
}: MemberActivityTabsProps) => {
  return (
    <Tabs defaultValue="logs" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="logs" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Activity Logs
        </TabsTrigger>
        <TabsTrigger value="sessions" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Login Sessions
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
  );
};
