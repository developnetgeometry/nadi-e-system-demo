
import { LookupManager } from "./LookupManager";
import { useStateData } from "@/hooks/lookup/use-state";

export const LookupState = () => {
  const { states, isLoading, addState, updateState, deleteState } = useStateData();

  return (
    <LookupManager
      title="States"
      items={states}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addState}
      onUpdate={updateState}
      onDelete={deleteState}
    />
  );
};
