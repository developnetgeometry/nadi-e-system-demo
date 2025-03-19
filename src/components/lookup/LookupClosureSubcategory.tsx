
import { LookupManager } from "./LookupManager";
import { useClosureSubcategory } from "@/hooks/lookup/use-closure-subcategory";

export const LookupClosureSubcategory = () => {
  const { closureSubcategories, isLoading, addClosureSubcategory, updateClosureSubcategory, deleteClosureSubcategory } = useClosureSubcategory();

  return (
    <LookupManager
      title="Closure Subcategories"
      items={closureSubcategories}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
        { name: "category_id", label: "Category ID" },
      ]}
      onAdd={addClosureSubcategory}
      onUpdate={updateClosureSubcategory}
      onDelete={deleteClosureSubcategory}
      displayField="eng"
    />
  );
};
