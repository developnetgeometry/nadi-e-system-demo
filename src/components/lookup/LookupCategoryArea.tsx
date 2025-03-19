
import { LookupManager } from "./LookupManager";
import { useCategoryArea } from "@/hooks/lookup/use-category-area";

export const LookupCategoryArea = () => {
  const { categoryAreas, isLoading, addCategoryArea, updateCategoryArea, deleteCategoryArea } = useCategoryArea();

  return (
    <LookupManager
      title="Category Areas"
      items={categoryAreas}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addCategoryArea}
      onUpdate={updateCategoryArea}
      onDelete={deleteCategoryArea}
    />
  );
};
