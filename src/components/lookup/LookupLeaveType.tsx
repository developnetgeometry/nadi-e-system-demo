
import { LookupManager } from "./LookupManager";
import { useLeaveType } from "@/hooks/lookup/use-leave-type";

export const LookupLeaveType = () => {
  const { leaveTypes, isLoading, addLeaveType, updateLeaveType, deleteLeaveType } = useLeaveType();

  return (
    <LookupManager
      title="Leave Types"
      items={leaveTypes}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addLeaveType}
      onUpdate={updateLeaveType}
      onDelete={deleteLeaveType}
    />
  );
};
