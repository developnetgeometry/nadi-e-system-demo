
import { LookupManager } from "./LookupManager";
import { useLeaveOffType } from "@/hooks/lookup/use-leave-off-type";

export const LookupLeaveOffType = () => {
  const { leaveOffTypes, isLoading, addLeaveOffType, updateLeaveOffType, deleteLeaveOffType } = useLeaveOffType();

  return (
    <LookupManager
      title="Leave Off Types"
      items={leaveOffTypes}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addLeaveOffType}
      onUpdate={updateLeaveOffType}
      onDelete={deleteLeaveOffType}
    />
  );
};
