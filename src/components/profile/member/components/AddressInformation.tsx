import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const AddressInformation = ({
  addressData,
  districts,
  states,
  handleChange,
}: {
  addressData: any;
  districts: any[];
  states: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  return (
    <div className="space-y-8 mt-12">
      <h2 className="text-lg font-semibold mb-4">Address Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="address1">Address Line 1</Label>
            <Input id="address1" type="text" value={addressData.address1 || ""} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="address2">Address Line 2</Label>
            <Input id="address2" type="text" value={addressData.address2 || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="postcode">Postcode</Label>
            <Input id="postcode" type="text" value={addressData.postcode || ""} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" type="text" value={addressData.city || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="district_id">District</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "district_id", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={addressData.district_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="state_id">State</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "state_id", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={addressData.state_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;