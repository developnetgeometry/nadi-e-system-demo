import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useTPID from "@/hooks/use-tp-id";
import { useToast } from "@/hooks/use-toast";

const useTpProfileData = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { tpID, loading: tpIDLoading, error: tpIDError } = useTPID();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (tpIDLoading || !tpID) return;
        const { data, error } = await supabase
          .from("nd_tech_partner_profile")
          .select(
            `id, is_active, fullname, ic_no, mobile_no, work_email, 
            personal_email, dob, place_of_birth,
            marital_status, race_id, religion_id, nationality_id, position_id`
          )
          .eq("id", tpID)
          .single();
        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching tech partner profile data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [tpID, tpIDLoading]);

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
        .from("nd_tech_partner_profile")
        .update({
          fullname: profileData.fullname,
          ic_no: profileData.ic_no,
          mobile_no: profileData.mobile_no,
          work_email: profileData.work_email,
          personal_email: profileData.personal_email,
          dob: profileData.dob,
          place_of_birth: profileData.place_of_birth,
          marital_status: profileData.marital_status,
          race_id: profileData.race_id,
          religion_id: profileData.religion_id,
          nationality_id: profileData.nationality_id,
        })
        .eq("id", profileData.id);

      if (response.error) {
        console.error("Error updating tech partner profile data:", response.error);
        setError(response.error.message);
        toast({
          title: "Error",
          description: "Failed to update the tech partner profile data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Tech partner profile updated successfully.",
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
    loading: loading || tpIDLoading,
    error: error || tpIDError,
    handleChange,
    handleSave,
  };
};

export default useTpProfileData;