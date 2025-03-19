
import { LookupManager } from "./LookupManager";
import { useGenders } from "@/hooks/lookup/use-genders";

export const LookupGenders = () => {
  const { genders, isLoading, addGender, updateGender, deleteGender } = useGenders();

  return (
    <LookupManager
      title="Genders"
      items={genders}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addGender}
      onUpdate={updateGender}
      onDelete={deleteGender}
      displayField="eng"
    />
  );
};
