
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const StaffContactInformation = ({
  contactData,
  relationshipTypes,
  handleChange,
}: {
  contactData: any;
  relationshipTypes: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  return (
    <div className="space-y-8 mt-12">
      <h2 className="text-lg font-semibold mb-4">Emergency Contact Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" type="text" value={contactData.full_name || ""} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="relationship_id">Relationship</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "relationship_id", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={contactData.relationship_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationshipTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="mobile_no">Mobile Number</Label>
            <Input id="mobile_no" type="text" value={contactData.mobile_no || ""} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="ic_no">IC Number</Label>
            <Input id="ic_no" type="text" value={contactData.ic_no || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="total_children">Number of Children</Label>
            <Input id="total_children" type="number" value={contactData.total_children || ""} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffContactInformation;
