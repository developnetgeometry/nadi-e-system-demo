
import { LookupManager } from "./LookupManager";
import { useTechnology } from "@/hooks/lookup/use-technology";

export const LookupTechnology = () => {
  const { technologies, isLoading, addTechnology, updateTechnology, deleteTechnology } = useTechnology();

  return (
    <LookupManager
      title="Technologies"
      items={technologies}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addTechnology}
      onUpdate={updateTechnology}
      onDelete={deleteTechnology}
    />
  );
};
