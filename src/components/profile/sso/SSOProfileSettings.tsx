import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalInformation from "./components/PersonalInformation";
import useSSOID from "@/hooks/use-sso-id";
import usePositionData from "@/hooks/use-position-data"; // Import the hook

const SSOProfileSettings = () => {
  const [ssoData, setSSOData] = useState<any>(null);
  const { ssoID, loading: ssoIDLoading, error: ssoIDError } = useSSOID();
  const { positions, error: positionError } = usePositionData(); // Use the hook
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (ssoIDLoading || !ssoID) return;

    const fetchUserData = async () => {
      try {
        const { data: sso, error: ssoError } = await supabase
          .from("nd_sso_profile")
          .select(
            `id, position_id, ic_no, fullname, mobile_no, work_email, 
            join_date, resign_date, is_active, user_id`
          )
          .eq("id", ssoID)
          .single();

        if (ssoError) throw ssoError;
        if (!sso) {
          throw new Error("No SSO data found");
        }
        setSSOData(sso);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [ssoID, ssoIDLoading]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSSOData((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Save Changes - Update the data in Supabase
  const handleSave = async () => {
    try {
      const { data: ssoDataResponse, error: ssoDataError } = await supabase
        .from("nd_sso_profile")
        .update({
          fullname: ssoData.fullname,
          ic_no: ssoData.ic_no,
          mobile_no: ssoData.mobile_no,
          work_email: ssoData.work_email,
          join_date: ssoData.join_date,
          resign_date: ssoData.resign_date,
          is_active: ssoData.is_active,
        })
        .eq("id", ssoData.id);

      if (ssoDataError) {
        console.error("Error updating SSO data:", ssoDataError);
        setError(ssoDataError.message);
        toast({
          title: "Error",
          description: "Failed to update the SSO data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Updated SSO Data:", ssoDataResponse);
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

  if (loading || ssoIDLoading) return <div>Loading...</div>;
  if (error || ssoIDError || positionError) return <div>Error: {error || ssoIDError || positionError}</div>;

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <PersonalInformation
          ssoData={ssoData}
          positions={positions} // Pass positions to the component
          handleChange={handleChange}
        />
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SSOProfileSettings;