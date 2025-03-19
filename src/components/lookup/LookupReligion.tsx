
import { LookupManager } from "./LookupManager";
import { useReligion } from "@/hooks/lookup/use-religion";

export const LookupReligion = () => {
  const { religions, isLoading, addReligion, updateReligion, deleteReligion } = useReligion();

  return (
    <LookupManager
      title="Religions"
      items={religions}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addReligion}
      onUpdate={updateReligion}
      onDelete={deleteReligion}
      displayField="eng"
    />
  );
};
