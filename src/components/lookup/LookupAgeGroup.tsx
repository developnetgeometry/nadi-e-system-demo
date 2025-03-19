
import { LookupManager } from "./LookupManager";
import { useAgeGroup } from "@/hooks/lookup/use-age-group";

export const LookupAgeGroup = () => {
  const { ageGroups, isLoading, addAgeGroup, updateAgeGroup, deleteAgeGroup } = useAgeGroup();

  return (
    <LookupManager
      title="Age Groups"
      items={ageGroups}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addAgeGroup}
      onUpdate={updateAgeGroup}
      onDelete={deleteAgeGroup}
    />
  );
};
