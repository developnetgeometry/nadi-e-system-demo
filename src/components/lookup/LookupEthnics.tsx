
import { LookupManager } from "./LookupManager";
import { useEthnics } from "@/hooks/lookup/use-ethnics";

export const LookupEthnics = () => {
  const { ethnics, isLoading, addEthnic, updateEthnic, deleteEthnic } = useEthnics();

  return (
    <LookupManager
      title="Ethnics"
      items={ethnics}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addEthnic}
      onUpdate={updateEthnic}
      onDelete={deleteEthnic}
      displayField="eng"
    />
  );
};
