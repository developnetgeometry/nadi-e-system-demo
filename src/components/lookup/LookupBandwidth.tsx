
import { LookupManager } from "./LookupManager";
import { useBandwidth } from "@/hooks/lookup/use-bandwidth";

export const LookupBandwidth = () => {
  const { bandwidth, isLoading, addBandwidth, updateBandwidth, deleteBandwidth } = useBandwidth();

  return (
    <LookupManager
      title="Bandwidth"
      items={bandwidth}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "Name", required: true },
      ]}
      onAdd={addBandwidth}
      onUpdate={updateBandwidth}
      onDelete={deleteBandwidth}
    />
  );
};
