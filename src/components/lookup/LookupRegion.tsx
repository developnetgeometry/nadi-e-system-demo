
import { LookupManager } from "./LookupManager";
import { useRegion } from "@/hooks/lookup/use-region";

export const LookupRegion = () => {
  const { regions, isLoading, addRegion, updateRegion, deleteRegion } = useRegion();

  return (
    <LookupManager
      title="Regions"
      items={regions}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addRegion}
      onUpdate={updateRegion}
      onDelete={deleteRegion}
    />
  );
};
