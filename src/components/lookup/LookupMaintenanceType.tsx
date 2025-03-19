
import { LookupManager } from "./LookupManager";
import { useMaintenanceType } from "@/hooks/lookup/use-maintenance-type";

export const LookupMaintenanceType = () => {
  const { maintenanceTypes, isLoading, addMaintenanceType, updateMaintenanceType, deleteMaintenanceType } = useMaintenanceType();

  return (
    <LookupManager
      title="Maintenance Types"
      items={maintenanceTypes}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addMaintenanceType}
      onUpdate={updateMaintenanceType}
      onDelete={deleteMaintenanceType}
    />
  );
};
