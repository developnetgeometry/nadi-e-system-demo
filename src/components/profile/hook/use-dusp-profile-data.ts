import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useDUSPID from "@/hooks/use-dusp-id";
import { useToast } from "@/hooks/use-toast";

const useDuspProfileData = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { duspID, loading: duspIDLoading, error: duspIDError } = useDUSPID();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (duspIDLoading || !duspID) return;
        console.log("Fetching DUSP profile data with ID:", duspID);
        const { data, error } = await supabase
          .from("nd_dusp_profile")
          .select("id, position_id, ic_no, fullname, mobile_no, work_email, join_date, resign_date, is_active, user_id")
          .eq("id", duspID)
          .single();
        console.log("DUSP Profile Data:", data);
        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [duspID, duspIDLoading]);

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
        .from("nd_dusp_profile")
        .update({
          fullname: profileData.fullname,
          ic_no: profileData.ic_no,
          mobile_no: profileData.mobile_no,
          work_email: profileData.work_email,
          join_date: profileData.join_date,
          resign_date: profileData.resign_date,
          is_active: profileData.is_active,
        })
        .eq("id", profileData.id);

      if (response.error) {
        console.error("Error updating profile data:", response.error);
        setError(response.error.message);
        toast({
          title: "Error",
          description: "Failed to update the profile data. Please try again.",
          variant: "destructive",
        });
        return;

      }

      console.log("Updated Profile Data:", response.data);
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

  return {
    profileData,
    loading: loading || duspIDLoading,
    error: error || duspIDError,
    handleChange,
    handleSave,
  };
};

export default useDuspProfileData;