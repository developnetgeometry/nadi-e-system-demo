import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalInformation from "./components/PersonalInformation";
import useMCMCId from "@/hooks/use-mcmc-id";
import usePositionData from "@/hooks/use-position-data"; // Import the hook

const MCMCProfileSettings = () => {
  const [mcmcData, setMCMCData] = useState<any>(null);
  const { mcmcID, loading: mcmcIDLoading, error: mcmcIDError } = useMCMCId();
  const { positions, error: positionError } = usePositionData(); // Use the hook
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileImage = "/profilepictureexample.jpeg";
  const { toast } = useToast();

  useEffect(() => {
    if (mcmcIDLoading || !mcmcID) return;

    const fetchUserData = async () => {
      try {
        const { data: mcmc, error: mcmcError } = await supabase
          .from("nd_mcmc_profile")
          .select(
            `id, position_id, ic_no, fullname, mobile_no, work_email, 
            user_id`
          )
          .eq("id", mcmcID)
          .single();

        if (mcmcError) throw mcmcError;
        if (!mcmc) {
          throw new Error("No MCMC data found");
        }
        setMCMCData(mcmc);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [mcmcID, mcmcIDLoading]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setMCMCData((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Save Changes - Update the data in Supabase
  const handleSave = async () => {
    try {
      const { data: mcmcDataResponse, error: mcmcDataError } = await supabase
        .from("nd_mcmc_profile")
        .update({
          fullname: mcmcData.fullname,
          ic_no: mcmcData.ic_no,
          mobile_no: mcmcData.mobile_no,
          work_email: mcmcData.work_email,
          is_active: mcmcData.is_active,
        })
        .eq("id", mcmcData.id);

      if (mcmcDataError) {
        console.error("Error updating MCMC data:", mcmcDataError);
        setError(mcmcDataError.message);
        toast({
          title: "Error",
          description: "Failed to update the MCMC data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Updated MCMC Data:", mcmcDataResponse);
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

  if (loading || mcmcIDLoading) return <div>Loading...</div>;
  if (error || mcmcIDError || positionError) return <div>Error: {error || mcmcIDError || positionError}</div>;

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-gray-300 rounded-full overflow-hidden shadow-lg">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
        <PersonalInformation
          mcmcData={mcmcData}
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

export default MCMCProfileSettings;