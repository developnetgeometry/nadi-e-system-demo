import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useSSOID from "@/hooks/use-sso-id";
import { useToast } from "@/hooks/use-toast";

const useSsoProfileData = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { ssoID, loading: ssoIDLoading, error: ssoIDError } = useSSOID();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (ssoIDLoading || !ssoID) return;
        const { data, error } = await supabase
          .from("nd_sso_profile")
          .select("id, position_id, ic_no, fullname, mobile_no, work_email, join_date, resign_date, is_active")
          .eq("id", ssoID)
          .single();
        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching SSO profile data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [ssoID, ssoIDLoading]);

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
        .from("nd_sso_profile")
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
        console.error("Error updating SSO profile data:", response.error);
        setError(response.error.message);
        toast({
          title: "Error",
          description: "Failed to update the SSO profile data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "SSO profile updated successfully.",
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
    loading: loading || ssoIDLoading,
    error: error || ssoIDError,
    handleChange,
    handleSave,
  };
};

export default useSsoProfileData;