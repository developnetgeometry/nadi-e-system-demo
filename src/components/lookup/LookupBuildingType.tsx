
import { LookupManager } from "./LookupManager";
import { useBuildingType } from "@/hooks/lookup/use-building-type";

export const LookupBuildingType = () => {
  const { buildingTypes, isLoading, addBuildingType, updateBuildingType, deleteBuildingType } = useBuildingType();

  return (
    <LookupManager
      title="Building Types"
      items={buildingTypes}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addBuildingType}
      onUpdate={updateBuildingType}
      onDelete={deleteBuildingType}
      displayField="eng"
    />
  );
};
