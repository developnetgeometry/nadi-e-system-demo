
import { LookupManager } from "./LookupManager";
import { useMaritalStatus } from "@/hooks/lookup/use-marital-status";

export const LookupMaritalStatus = () => {
  const { maritalStatuses, isLoading, addMaritalStatus, updateMaritalStatus, deleteMaritalStatus } = useMaritalStatus();

  return (
    <LookupManager
      title="Marital Status"
      items={maritalStatuses}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addMaritalStatus}
      onUpdate={updateMaritalStatus}
      onDelete={deleteMaritalStatus}
      displayField="eng"
    />
  );
};
