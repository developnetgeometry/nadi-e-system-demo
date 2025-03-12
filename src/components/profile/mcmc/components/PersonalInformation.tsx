import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PersonalInformation = ({
  mcmcData,
  positions, // Add positions prop
  handleChange,
}: {
  mcmcData: any;
  positions: any[]; // Add positions prop type
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  // Find the position name based on the position_id
  const positionName = positions.find((position) => position.id === mcmcData.position_id)?.name || "";

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="id">MCMC ID</Label>
            <Input id="id" type="text" value={mcmcData.id} readOnly />
          </div>
          <div>
            <Label htmlFor="is_active">Status</Label>
            <Input id="is_active" type="text" value={mcmcData.is_active ? "Active" : "Inactive"} readOnly />
          </div>
        </div>
        <div>
          <Label htmlFor="fullname">Full Name</Label>
          <Input id="fullname" type="text" value={mcmcData.fullname || ""} readOnly />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="ic_no">IC No</Label>
            <Input id="ic_no" type="text" value={mcmcData.ic_no || ""} readOnly />
          </div>
          <div>
            <Label htmlFor="mobile_no">Mobile No</Label>
            <Input id="mobile_no" type="text" value={mcmcData.mobile_no || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="position_id">Position</Label>
            <Input id="position_id" type="text" value={positionName} readOnly />
          </div>
          <div>
            <Label htmlFor="work_email">Work Email</Label>
            <Input id="work_email" type="email" value={mcmcData.work_email || ""} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;