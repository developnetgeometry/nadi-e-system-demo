
import { LookupManager } from "./LookupManager";
import { useEducation } from "@/hooks/lookup/use-education";

export const LookupEducation = () => {
  const { educationLevels, isLoading, addEducation, updateEducation, deleteEducation } = useEducation();

  return (
    <LookupManager
      title="Education Levels"
      items={educationLevels}
      isLoading={isLoading}
      fields={[
        { name: "eng", label: "English", required: true },
        { name: "bm", label: "Bahasa Malaysia", required: true },
      ]}
      onAdd={addEducation}
      onUpdate={updateEducation}
      onDelete={deleteEducation}
      displayField="eng"
    />
  );
};
