import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalInformation from "./components/PersonalInformation";
import AddressInformation from "./components/AddressInformation";
import useGeneralData from "@/hooks/use-general-data";
import useGeoData from "@/hooks/use-geo-data";
import useMemberID from "@/hooks/use-member-id";
import { Skeleton } from "@/components/ui/skeleton";
import MemberProfilePicture from "./components/MemberProfilePicture";

const MemberProfileSettings = () => {
  const [memberData, setMemberData] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const { genders, races, occupations,
    typeSectors,
    socioeconomics,
    ictKnowledge,
    educationLevels,
    incomeLevels, error: fetchError } = useGeneralData();
  const { districts, states, error: geoError } = useGeoData();
  const { memberID, loading: memberIDLoading, error: memberIDError } = useMemberID();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileImage = "/profilepictureexample.jpeg";
  const { toast } = useToast();

  useEffect(() => {
    if (memberIDLoading || !memberID) return;

    const fetchUserData = async () => {
      try {
        const { data: member, error: memberError } = await supabase
          .from("nd_member_profile")
          .select(
            `id, ref_id, identity_no, type_membership, community_status, dob, age, fullname, mobile_no, email, gender, race_id, ethnic_id, occupation_id, type_sector, socio_id, ict_knowledge, education_level, oku_status, income_range, distance`
          )
          .eq("id", memberID)
          .single();

        if (memberError) throw memberError;
        if (!member) {
          throw new Error("No member data found");
        }
        setMemberData(member);

        const { data: address, error: addressError } = await supabase
          .from("nd_member_address")
          .select("id, member_id, address1, address2, postcode, city, district_id, state_id")
          .eq("member_id", memberID)

          .single();

        if (!address) {
          setAddressData({
            id: null,
            member_id: memberID,
            address1: "",
            address2: "",
            postcode: "",
            city: "",
            district_id: "",
            state_id: "",
          });
          return;
        }
        if (addressError) throw addressError;
        else {
          setAddressData(address);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [memberID, memberIDLoading]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === "postcode" || id === "city" || id === "address1" || id === "address2" || id === "district_id" || id === "state_id") {
      setAddressData((prev: any) => ({
        ...prev,
        [id]: value,
      }));
    } else {
      setMemberData((prev: any) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  // Save Changes - Update the data in Supabase
  const handleSave = async () => {
    try {
      const { data: memberDataResponse, error: memberDataError } = await supabase
        .from("nd_member_profile")
        .update({
          ref_id: memberData.ref_id,
          identity_no: memberData.identity_no,
          type_membership: memberData.type_membership,
          community_status: memberData.community_status,
          dob: memberData.dob,
          age: memberData.age,
          fullname: memberData.fullname,
          mobile_no: memberData.mobile_no,
          email: memberData.email,
          gender: memberData.gender,
          race_id: memberData.race_id,
          ethnic_id: memberData.ethnic_id,
          occupation_id: memberData.occupation_id,
          type_sector: memberData.type_sector,
          socio_id: memberData.socio_id,
          ict_knowledge: memberData.ict_knowledge,
          education_level: memberData.education_level,
          oku_status: memberData.oku_status,
          income_range: memberData.income_range,
          distance: memberData.distance,
        })
        .eq("id", memberData.id);

      if (memberDataError) {
        console.error("Error updating member data:", memberDataError);
        setError(memberDataError.message);
        toast({
          title: "Error",
          description: "Failed to update the member data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      let addressDataResponse: any;
      if (addressData.id) {
        // Update existing address
        const { error: addressDataError } = await supabase
          .from("nd_member_address")
          .update({
            address1: addressData.address1,
            address2: addressData.address2,
            postcode: addressData.postcode,
            city: addressData.city,
            district_id: addressData.district_id,
            state_id: addressData.state_id,
          })
          .eq("id", addressData.id);

        if (addressDataError) {
          console.error("Error updating address data:", addressDataError);
          setError(addressDataError.message);
          toast({
            title: "Error",
            description: "Failed to update address data. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Insert new address
        const { data, error: addressDataError } = await supabase
          .from("nd_member_address")
          .insert([
            {
              member_id: addressData.member_id,
              address1: addressData.address1,
              address2: addressData.address2,
              postcode: addressData.postcode,
              city: addressData.city,
              district_id: addressData.district_id,
              state_id: addressData.state_id,
            },
          ])
          .select()
          .single();

        if (addressDataError) {
          console.error("Error inserting address data:", addressDataError);
          setError(addressDataError.message);
          toast({
            title: "Error",
            description: "Failed to create new address data. Please try again.",
            variant: "destructive",
          });
          return;
        }
        addressDataResponse = data; // Store new address data
        setAddressData(data); // Update state with the new ID
      }

      console.log("Updated Address Data:", addressDataResponse);
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
  if (loading || memberIDLoading) return <Skeleton>Loading Data...</Skeleton>;
  if (error || fetchError || geoError || memberIDError) return <div>Error: {error || fetchError || geoError || memberIDError}</div>;

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <MemberProfilePicture/>
        <PersonalInformation
          memberData={memberData}
          genders={genders}
          races={races}
          occupations={occupations}
          socioeconomics={socioeconomics}
          ictKnowledge={ictKnowledge}
          educationLevels={educationLevels}
          incomeLevels={incomeLevels}
          
          handleChange={handleChange}
        />
        <AddressInformation
          addressData={addressData}
          districts={districts}
          states={states}
          handleChange={handleChange}
        />
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberProfileSettings;