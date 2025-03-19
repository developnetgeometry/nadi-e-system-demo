
import { LookupManager } from "./LookupManager";
import { useBuildingLevel } from "@/hooks/lookup/use-building-level";

export const LookupBuildingLevel = () => {
  const { buildingLevels, isLoading, addBuildingLevel, updateBuildingLevel, deleteBuildingLevel } = useBuildingLevel();

  return (
    <LookupManager
      title="Building Levels"
      items={buildingLevels}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addBuildingLevel}
      onUpdate={updateBuildingLevel}
      onDelete={deleteBuildingLevel}
      displayField="eng"
    />
  );
};
