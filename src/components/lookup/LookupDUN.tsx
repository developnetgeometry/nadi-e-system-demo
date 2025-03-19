
import { LookupManager } from "./LookupManager";
import { useDUN } from "@/hooks/lookup/use-dun";

export const LookupDUN = () => {
  const { duns, isLoading, addDUN, updateDUN, deleteDUN } = useDUN();

  return (
    <LookupManager
      title="DUNs"
      items={duns}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "full_name", label: "Full Name" },
        { name: "refid", label: "Reference ID" },
        { name: "states_id", label: "State ID" },
      ]}
      onAdd={addDUN}
      onUpdate={updateDUN}
      onDelete={deleteDUN}
    />
  );
};
