
import { LookupManager } from "./LookupManager";
import { useRelationship } from "@/hooks/lookup/use-relationship";

export const LookupRelationship = () => {
  const { relationships, isLoading, addRelationship, updateRelationship, deleteRelationship } = useRelationship();

  return (
    <LookupManager
      title="Relationships"
      items={relationships}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addRelationship}
      onUpdate={updateRelationship}
      onDelete={deleteRelationship}
    />
  );
};
