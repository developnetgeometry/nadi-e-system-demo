
import { LookupManager } from "./LookupManager";
import { useNationality } from "@/hooks/lookup/use-nationality";

export const LookupNationality = () => {
  const { nationalities, isLoading, addNationality, updateNationality, deleteNationality } = useNationality();

  return (
    <LookupManager
      title="Nationalities"
      items={nationalities}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addNationality}
      onUpdate={updateNationality}
      onDelete={deleteNationality}
      displayField="eng"
    />
  );
};
