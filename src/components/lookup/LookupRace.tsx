
import { LookupManager } from "./LookupManager";
import { useRace } from "@/hooks/lookup/use-race";

export const LookupRace = () => {
  const { races, isLoading, addRace, updateRace, deleteRace } = useRace();

  return (
    <LookupManager
      title="Races"
      items={races}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addRace}
      onUpdate={updateRace}
      onDelete={deleteRace}
      displayField="eng"
    />
  );
};
