
import { LookupManager } from "./LookupManager";
import { useOccupation } from "@/hooks/lookup/use-occupation";

export const LookupOccupation = () => {
  const { occupations, isLoading, addOccupation, updateOccupation, deleteOccupation } = useOccupation();

  return (
    <LookupManager
      title="Occupations"
      items={occupations}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addOccupation}
      onUpdate={updateOccupation}
      onDelete={deleteOccupation}
    />
  );
};
