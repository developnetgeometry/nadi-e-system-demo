
import { LookupManager } from "./LookupManager";
import { useIncomeLevel } from "@/hooks/lookup/use-income-level";

export const LookupIncomeLevel = () => {
  const { incomeLevels, isLoading, addIncomeLevel, updateIncomeLevel, deleteIncomeLevel } = useIncomeLevel();

  return (
    <LookupManager
      title="Income Levels"
      items={incomeLevels}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addIncomeLevel}
      onUpdate={updateIncomeLevel}
      onDelete={deleteIncomeLevel}
      displayField="eng"
    />
  );
};
