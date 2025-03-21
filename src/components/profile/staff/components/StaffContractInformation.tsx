
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const StaffContractInformation = ({
  contractData,
  siteOptions,
  contractTypes,
  handleChange,
}: {
  contractData: any;
  siteOptions: any[];
  contractTypes: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  const handleCheckboxChange = (checked: boolean) => {
    handleChange({ target: { id: "is_active", value: checked.toString() } } as React.ChangeEvent<HTMLInputElement>);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  return (
    <div className="space-y-8 mt-12">
      <h2 className="text-lg font-semibold mb-4">Contract Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="site_id">Site Location</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "site_id", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={contractData.site_id?.toString() || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select site location" />
              </SelectTrigger>
              <SelectContent>
                {siteOptions.map((site) => (
                  <SelectItem key={site.id} value={site.id.toString()}>
                    {site.sitename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="contract_type">Contract Type</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "contract_type", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={contractData.contract_type?.toString() || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contract_start">Contract Start Date</Label>
            <Input 
              id="contract_start" 
              type="date" 
              value={formatDate(contractData.contract_start)} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <Label htmlFor="contract_end">Contract End Date</Label>
            <Input 
              id="contract_end" 
              type="date" 
              value={formatDate(contractData.contract_end)} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_active" 
              checked={contractData.is_active === true} 
              onCheckedChange={handleCheckboxChange} 
            />
            <Label htmlFor="is_active" className="cursor-pointer">Active Contract</Label>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="remark">Remarks</Label>
            <Textarea 
              id="remark" 
              value={contractData.remark || ""} 
              onChange={(e) => handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffContractInformation;
