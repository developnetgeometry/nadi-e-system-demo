
import { LookupManager } from "./LookupManager";
import { useClosureAffectArea } from "@/hooks/lookup/use-closure-affect-area";

export const LookupClosureAffectArea = () => {
  const { closureAffectAreas, isLoading, addClosureAffectArea, updateClosureAffectArea, deleteClosureAffectArea } = useClosureAffectArea();

  return (
    <LookupManager
      title="Closure Affect Areas"
      items={closureAffectAreas}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addClosureAffectArea}
      onUpdate={updateClosureAffectArea}
      onDelete={deleteClosureAffectArea}
      displayField="eng"
    />
  );
};
