
import { LookupManager } from "./LookupManager";
import { useDistrict } from "@/hooks/lookup/use-district";

export const LookupDistrict = () => {
  const { districts, isLoading, addDistrict, updateDistrict, deleteDistrict } = useDistrict();

  return (
    <LookupManager
      title="Districts"
      items={districts}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "state_id", label: "State ID" },
        { name: "code", label: "Code" },
      ]}
      onAdd={addDistrict}
      onUpdate={updateDistrict}
      onDelete={deleteDistrict}
    />
  );
};
