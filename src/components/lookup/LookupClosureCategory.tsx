
import { LookupManager } from "./LookupManager";
import { useClosureCategory } from "@/hooks/lookup/use-closure-category";

export const LookupClosureCategory = () => {
  const { closureCategories, isLoading, addClosureCategory, updateClosureCategory, deleteClosureCategory } = useClosureCategory();

  return (
    <LookupManager
      title="Closure Categories"
      items={closureCategories}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addClosureCategory}
      onUpdate={updateClosureCategory}
      onDelete={deleteClosureCategory}
      displayField="eng"
    />
  );
};
