import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PersonalInformation = ({
  vendorData,
  contractData,
  positions,
  handleChange,
}: {
  vendorData: any;
  contractData: any;
  positions: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  // Find the position name based on the position_id
  const positionName = positions.find((position) => position.id === vendorData.position_id)?.name || "Unknown Position";

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Input id="fullname" type="text" value={vendorData.fullname || ""} readOnly />
          </div>
          <div>
            <Label htmlFor="ic_no">IC Number</Label>
            <Input id="ic_no" type="text" value={vendorData.ic_no || ""} readOnly />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="mobile_no">Mobile Number</Label>
            <Input id="mobile_no" type="text" value={vendorData.mobile_no || ""} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="work_email">Work Email</Label>
            <Input id="work_email" type="email" value={vendorData.work_email || ""} readOnly />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="position_id">Position</Label>
            <Input id="position_id" type="text" value={positionName} readOnly />
          </div>
          <div>
            <Label htmlFor="is_active">Status</Label>
            <Input id="is_active" type="text" value={vendorData.is_active ? "Active" : "Inactive"} readOnly />
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mt-6">Contract Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="contract_start">Contract Start</Label>
          <Input id="contract_start" type="text" value={contractData?.contract_start || ""} readOnly />
        </div>
        <div>
          <Label htmlFor="contract_end">Contract End</Label>
          <Input id="contract_end" type="text" value={contractData?.contract_end || ""} readOnly />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;