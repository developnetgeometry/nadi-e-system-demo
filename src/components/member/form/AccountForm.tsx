import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

type AddressData = {
  address1: string;
  address2: string;
  state_id: string;
  district_id: string;
  city: string;
  postcode: string;
  distance: string;
};

type AccountFormProps = AddressData & {
  updateFields: (fields: Partial<AddressData>) => void;
  states: { id: string; name: string }[]; // Add states prop
  districts: { id: string; name: string }[]; // Add districts prop
};

export function AccountForm({
  address1,
  address2,
  state_id,
  district_id,
  city,
  postcode,
  distance,
  updateFields,
  states,
  districts,
  fetchDistrictsByState, // Add fetchDistrictsByState as a prop
}: AccountFormProps & { fetchDistrictsByState: (stateId: string) => Promise<void> }) {
  useEffect(() => {
    if (state_id) {
      fetchDistrictsByState(state_id); // Fetch districts when state_id changes
    }
  }, [state_id, fetchDistrictsByState]);
  return (
    <>
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="font-bold text-xl">Address Information</h1>
        <p className="text-muted-foreground">
          Fill in member's address information
        </p>
      </div>
      {/* Address Line 1 */}
      <div className="space-y-2 mb-4">
        <Label className="flex items-center">Address Line 1 <span className="text-red-500 ml-1">*</span></Label>
        <Input
          autoFocus
          required
          type="text"
          value={address1}
          onChange={(e) => updateFields({ address1: e.target.value })}
        />
      </div>

      {/* Address Line 2 */}
      <div className="space-y-2 mb-4">
        <Label className="flex items-center">Address Line 2</Label>
        <Input
          type="text"
          value={address2}
          onChange={(e) => updateFields({ address2: e.target.value })}
        />
      </div>

      {/* State */}
      <div className="space-y-2 mb-4">
        <Label className="flex items-center">State <span className="text-red-500 ml-1">*</span></Label>
        <Select
          value={state_id}
          onValueChange={(value) => {
            updateFields({ state_id: value, district_id: null }); // Set district_id to null when state changes
          }}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District */}
      <div className="space-y-2 mb-4">
        <Label className="flex items-center">District <span className="text-red-500 ml-1">*</span></Label>
        <Select
          value={district_id}
          onValueChange={(value) => updateFields({ district_id: value })}
          disabled={!state_id} // Disable if state_id is not selected
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id.toString()}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-2 mb-4">
        <Label className="flex items-center">City <span className="text-red-500 ml-1">*</span></Label>
        <Input
          required
          type="text"
          value={city}
          onChange={(e) => updateFields({ city: e.target.value })}
        />
      </div>

      {/* Postcode */}
      <div className="space-y-2 mb-4">
        <Label className="flex items-center">Postcode <span className="text-red-500 ml-1">*</span></Label>
        <Input
          required
          type="text"
          value={postcode}
          onChange={(e) => updateFields({ postcode: e.target.value })}
        />
      </div>

      {/* Distance */}
      <div className="space-y-2 mb-4">
        <Label className="flex items-center">Distance from NADI (km)</Label>
        <Input
          type="number"
          value={distance}
          onChange={(e) => updateFields({ distance: e.target.value })}
        />
      </div>
    </>
  );
}