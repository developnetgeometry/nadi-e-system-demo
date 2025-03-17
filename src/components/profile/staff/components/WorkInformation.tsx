import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const WorkInformation = ({
  payInfoData,
  banks,
  handleChange,
}: {
  payInfoData: any;
  banks: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  return (
    <div className="space-y-8 mt-12">
      <h2 className="text-lg font-semibold mb-4">Work Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bank_id">Bank</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "bank_id", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={payInfoData.bank_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.bank_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bank_acc_no">Bank Account No</Label>
            <Input id="bank_acc_no" type="text" value={payInfoData.bank_acc_no || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="epf_no">EPF No</Label>
            <Input id="epf_no" type="text" value={payInfoData.epf_no || ""} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="socso_no">SOCSO No</Label>
            <Input id="socso_no" type="text" value={payInfoData.socso_no || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="tax_no">Tax No</Label>
            <Input id="tax_no" type="text" value={payInfoData.tax_no || ""} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkInformation;