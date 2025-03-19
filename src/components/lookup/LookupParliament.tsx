
import { LookupManager } from "./LookupManager";
import { useParliament } from "@/hooks/lookup/use-parliament";

export const LookupParliament = () => {
  const { parliaments, isLoading, addParliament, updateParliament, deleteParliament } = useParliament();

  return (
    <LookupManager
      title="Parliaments"
      items={parliaments}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "state_id", label: "State ID" },
      ]}
      onAdd={addParliament}
      onUpdate={updateParliament}
      onDelete={deleteParliament}
    />
  );
};
