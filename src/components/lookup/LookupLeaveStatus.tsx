
import { LookupManager } from "./LookupManager";
import { useLeaveStatus } from "@/hooks/lookup/use-leave-status";

export const LookupLeaveStatus = () => {
  const { leaveStatuses, isLoading, addLeaveStatus, updateLeaveStatus, deleteLeaveStatus } = useLeaveStatus();

  return (
    <LookupManager
      title="Leave Status"
      items={leaveStatuses}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addLeaveStatus}
      onUpdate={updateLeaveStatus}
      onDelete={deleteLeaveStatus}
    />
  );
};
