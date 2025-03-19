
import { LookupManager } from "./LookupManager";
import { useSectorType } from "@/hooks/lookup/use-sector-type";

export const LookupSectorType = () => {
  const { sectorTypes, isLoading, addSectorType, updateSectorType, deleteSectorType } = useSectorType();

  return (
    <LookupManager
      title="Sector Types"
      items={sectorTypes}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addSectorType}
      onUpdate={updateSectorType}
      onDelete={deleteSectorType}
    />
  );
};
