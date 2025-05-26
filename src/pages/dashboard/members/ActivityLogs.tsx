import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useMemberActivity } from "@/components/activity/hooks/useMemberActivity";
import { MemberActivityHeader } from "@/components/activity/MemberActivityHeader";
import { MemberActivityTabs } from "@/components/activity/MemberActivityTabs";

const ActivityLogs = () => {
  // Use our custom hook to handle all data fetching logic
  const {
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
    logs,
    sessions,
    isLoadingLogs,
    isLoadingSessions,
    handleRefresh,
  } = useMemberActivity();

  return (
    <div>
      <div className="space-y-1">
        <MemberActivityHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={handleRefresh}
          logs={logs}
        />

        <div className="mt-6">
          <MemberActivityTabs
            logs={logs}
            sessions={sessions}
            isLoadingLogs={isLoadingLogs}
            isLoadingSessions={isLoadingSessions}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
