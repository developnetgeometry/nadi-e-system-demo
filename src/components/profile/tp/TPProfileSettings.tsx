import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalInformation from "./components/PersonalInformation";
import useGeneralData from "@/hooks/use-general-data";
import useTPID from "@/hooks/use-tp-id";

const TPProfileSettings = () => {
  const [tpData, setTPData] = useState<any>(null);
  const { maritalStatuses, races, religions, nationalities, error: fetchError } = useGeneralData();
  const { tpID, loading: tpIDLoading, error: tpIDError } = useTPID();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileImage = "/profilepictureexample.jpeg";
  const { toast } = useToast();

  useEffect(() => {
    if (tpIDLoading || !tpID) return;

    const fetchUserData = async () => {
      try {
        const { data: tp, error: tpError } = await supabase
          .from("nd_tech_partner_profile")
          .select(
            `id, is_active, fullname, ic_no, mobile_no, work_email, 
            personal_email, dob, place_of_birth,
            marital_status, race_id, religion_id, nationality_id`
          )
          .eq("id", tpID)
          .single();

        if (tpError) throw tpError;
        if (!tp) {
          throw new Error("No tech partner data found");
        }
        setTPData(tp);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [tpID, tpIDLoading]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setTPData((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Save Changes - Update the data in Supabase
  const handleSave = async () => {
    try {
      const { data: tpDataResponse, error: tpDataError } = await supabase
        .from("nd_tech_partner_profile")
        .update({
          fullname: tpData.fullname,
          ic_no: tpData.ic_no,
          mobile_no: tpData.mobile_no,
          work_email: tpData.work_email,
          personal_email: tpData.personal_email,
          dob: tpData.dob,
          place_of_birth: tpData.place_of_birth,
          marital_status: tpData.marital_status,
          race_id: tpData.race_id,
          religion_id: tpData.religion_id,
          nationality_id: tpData.nationality_id,
        })
        .eq("id", tpData.id);

      if (tpDataError) {
        console.error("Error updating tech partner data:", tpDataError);
        setError(tpDataError.message);
        toast({
          title: "Error",
          description: "Failed to update the tech partner data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Updated Tech Partner Data:", tpDataResponse);
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

  if (loading || tpIDLoading) return <div>Loading...</div>;
  if (error || fetchError || tpIDError) return <div>Error: {error || fetchError || tpIDError}</div>;

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
          tpData={tpData}
          maritalStatuses={maritalStatuses}
          races={races}
          religions={religions}
          nationalities={nationalities}
          handleChange={handleChange}
        />
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TPProfileSettings;