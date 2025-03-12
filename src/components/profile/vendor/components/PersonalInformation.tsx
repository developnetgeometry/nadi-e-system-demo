import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PersonalInformation = ({ vendorData, contractData, positions, handleChange }) => {
  const getPositionName = (positionId: number) => {
    const position = positions.find((pos) => pos.id === positionId);
    return position ? position.name : "Unknown Position";
  };

  return (
    <div className="space-y-8 mt-6">
      <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: "full_name", label: "Full Name", value: vendorData.full_name },
          { id: "ic_no", label: "IC Number", value: vendorData.ic_no },
          { id: "mobile_no", label: "Mobile Number", value: vendorData.mobile_no },
          { id: "work_email", label: "Work Email", value: vendorData.work_email },
          { id: "position_id", label: "Position", value: getPositionName(vendorData.position_id) },
          { id: "is_active", label: "Status", value: vendorData.is_active ? "Active" : "Inactive" },
        ].map((field) => (
          <div key={field.id} className="col-span-2">
            <Label htmlFor={field.id} className="block text-gray-700 font-medium mb-2">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="text"
              placeholder={`Enter ${field.label}`}
              value={field.value || ""}
              onChange={handleChange}
              readOnly={field.id === "position_id" || field.id === "is_active" || field.id === "full_name" || field.id === "ic_no" || field.id === "work_email"}
            />
          </div>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mt-6">Contract Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: "contract_start", label: "Contract Start", value: contractData?.contract_start },
          { id: "contract_end", label: "Contract End", value: contractData?.contract_end },
        ].map((field) => (
          <div key={field.id} className="col-span-2">
            <Label htmlFor={field.id} className="block text-gray-700 font-medium mb-2">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="text"
              placeholder={`Enter ${field.label}`}
              value={field.value || ""}
              readOnly
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInformation;