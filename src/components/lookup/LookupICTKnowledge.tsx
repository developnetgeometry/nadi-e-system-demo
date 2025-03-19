
import { LookupManager } from "./LookupManager";
import { useICTKnowledge } from "@/hooks/lookup/use-ict-knowledge";

export const LookupICTKnowledge = () => {
  const { ictKnowledge, isLoading, addICTKnowledge, updateICTKnowledge, deleteICTKnowledge } = useICTKnowledge();

  return (
    <LookupManager
      title="ICT Knowledge Levels"
      items={ictKnowledge}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addICTKnowledge}
      onUpdate={updateICTKnowledge}
      onDelete={deleteICTKnowledge}
      displayField="eng"
    />
  );
};
