import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalInformation from "./components/PersonalInformation";
import usePositionData from "@/hooks/use-position-data";
import useVendorID from "@/hooks/use-vendor-id";

const VendorProfileSettings = () => {
  const [vendorData, setVendorData] = useState<any>(null);
  const [contractData, setContractData] = useState<any>(null);
  const { positions } = usePositionData();
  const { vendorID, loading: vendorIDLoading, error: vendorIDError } = useVendorID();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (vendorIDLoading || !vendorID) return;

    const fetchVendorData = async () => {
      try {
        const { data: vendor, error: vendorError } = await supabase
          .from("nd_vendor_staff")
          .select("position_id, ic_no, fullname, mobile_no, work_email, is_active")
          .eq("id", vendorID)
          .single();

        if (vendorError) throw vendorError;
        if (!vendor) {
          throw new Error("No vendor data found");
        }
        setVendorData(vendor);

        const { data: contract, error: contractError } = await supabase
          .from("nd_vendor_contract")
          .select("contract_start, contract_end")
          .eq("vendor_staff_id", vendorID)
          .single();

        if (contractError) throw contractError;
        setContractData(contract);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [vendorID, vendorIDLoading]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setVendorData((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Save Changes - Update the data in Supabase
  const handleSave = async () => {
    try {
      const { data: vendorDataResponse, error: vendorDataError } = await supabase
        .from("nd_vendor_staff")
        .update({
          mobile_no: vendorData.mobile_no,
        })
        .eq("id", vendorID);

      if (vendorDataError) {
        console.error("Error updating vendor data:", vendorDataError);
        setError(vendorDataError.message);
        toast({
          title: "Error",
          description: "Failed to update the vendor data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || vendorIDLoading) return <div>Loading...</div>;
  if (error || vendorIDError) return <div>Error: {error || vendorIDError}</div>;

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="text-white">Vendor Profile</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <PersonalInformation
          vendorData={vendorData}
          contractData={contractData}
          positions={positions}
          handleChange={handleChange}
        />
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorProfileSettings;