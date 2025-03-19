
import { LookupManager } from "./LookupManager";
import { useMukim } from "@/hooks/lookup/use-mukim";

export const LookupMukim = () => {
  const { mukims, isLoading, addMukim, updateMukim, deleteMukim } = useMukim();

  return (
    <LookupManager
      title="Mukims"
      items={mukims}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "district_id", label: "District ID" },
      ]}
      onAdd={addMukim}
      onUpdate={updateMukim}
      onDelete={deleteMukim}
    />
  );
};
