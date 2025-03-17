import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useVendorID from "@/hooks/use-vendor-id";
import { useToast } from "@/hooks/use-toast";

const useVendorProfileData = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { vendorID, loading: vendorIDLoading, error: vendorIDError } = useVendorID();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (vendorIDLoading || !vendorID) return;
        const { data, error } = await supabase
          .from("nd_vendor_staff")
          .select("id, position_id, ic_no, fullname, mobile_no, work_email, is_active")
          .eq("id", vendorID)
          .single();
        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching vendor profile data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [vendorID, vendorIDLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProfileData((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await supabase
        .from("nd_vendor_staff")
        .update({
          fullname: profileData.fullname,
          ic_no: profileData.ic_no,
          mobile_no: profileData.mobile_no,
          work_email: profileData.work_email,
          is_active: profileData.is_active,
        })
        .eq("id", profileData.id);

      if (response.error) {
        console.error("Error updating vendor profile data:", response.error);
        setError(response.error.message);
        toast({
          title: "Error",
          description: "Failed to update the vendor profile data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Vendor profile updated successfully.",
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

  return {
    profileData,
    loading: loading || vendorIDLoading,
    error: error || vendorIDError,
    handleChange,
    handleSave,
  };
};

export default useVendorProfileData;