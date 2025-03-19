
import { LookupManager } from "./LookupManager";
import { useClosureStatus } from "@/hooks/lookup/use-closure-status";

export const LookupClosureStatus = () => {
  const { closureStatus, isLoading, addClosureStatus, updateClosureStatus, deleteClosureStatus } = useClosureStatus();

  return (
    <LookupManager
      title="Closure Status"
      items={closureStatus}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "remark", label: "Remark" },
      ]}
      onAdd={addClosureStatus}
      onUpdate={updateClosureStatus}
      onDelete={deleteClosureStatus}
    />
  );
};
