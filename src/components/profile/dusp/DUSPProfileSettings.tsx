import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalInformation from "./components/PersonalInformation";
import useDUSPID from "@/hooks/use-dusp-id";
import usePositionData from "@/hooks/use-position-data"; // Import the hook

const DUSPProfileSettings = () => {
  const [duspData, setDUSPData] = useState<any>(null);
  const { duspID, loading: duspIDLoading, error: duspIDError } = useDUSPID();
  const { positions, error: positionError } = usePositionData(); // Use the hook
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (duspIDLoading || !duspID) return;

    const fetchUserData = async () => {
      try {
        const { data: dusp, error: duspError } = await supabase
          .from("nd_dusp_profile")
          .select(
            `id, position_id, ic_no, fullname, mobile_no, work_email, 
            join_date, resign_date, is_active, user_id`
          )
          .eq("id", duspID)
          .single();

        if (duspError) throw duspError;
        if (!dusp) {
          throw new Error("No DUSP data found");
        }
        setDUSPData(dusp);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [duspID, duspIDLoading]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setDUSPData((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Save Changes - Update the data in Supabase
  const handleSave = async () => {
    try {
      const { data: duspDataResponse, error: duspDataError } = await supabase
        .from("nd_dusp_profile")
        .update({
          fullname: duspData.fullname,
          ic_no: duspData.ic_no,
          mobile_no: duspData.mobile_no,
          work_email: duspData.work_email,
          join_date: duspData.join_date,
          resign_date: duspData.resign_date,
          is_active: duspData.is_active,
        })
        .eq("id", duspData.id);

      if (duspDataError) {
        console.error("Error updating DUSP data:", duspDataError);
        setError(duspDataError.message);
        toast({
          title: "Error",
          description: "Failed to update the DUSP data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Updated DUSP Data:", duspDataResponse);
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

  if (loading || duspIDLoading) return <div>Loading...</div>;
  if (error || duspIDError || positionError) return <div>Error: {error || duspIDError || positionError}</div>;

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <PersonalInformation
          duspData={duspData}
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

export default DUSPProfileSettings;