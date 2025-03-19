
import { LookupManager } from "./LookupManager";
import { useCity } from "@/hooks/lookup/use-city";

export const LookupCity = () => {
  const { cities, isLoading, addCity, updateCity, deleteCity } = useCity();

  return (
    <LookupManager
      title="Cities"
      items={cities}
      isLoading={isLoading}
      fields={[
        { name: "name", label: "City Name", required: true },
        { name: "state", label: "State" },
      ]}
      onAdd={addCity}
      onUpdate={updateCity}
      onDelete={deleteCity}
    />
  );
};
