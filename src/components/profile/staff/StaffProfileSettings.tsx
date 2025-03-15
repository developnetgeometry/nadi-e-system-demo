import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalInformation from "./components/PersonalInformation";
import AddressInformation from "./components/AddressInformation";
import WorkInformation from "./components/WorkInformation";
import useGeneralData from "@/hooks/use-general-data";
import useGeoData from "@/hooks/use-geo-data";
import useBankData from "@/hooks/use-bank-data";
import useStaffID from "@/hooks/use-staff-id";
import { Skeleton } from "@/components/ui/skeleton";
import StaffProfilePicture from "./components/StaffProfilePicture";

const StaffProfileSettings = () => {
  const [staffData, setStaffData] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [payInfoData, setPayInfoData] = useState<any>(null);
  const { genders, maritalStatuses, races, religions, nationalities, error: fetchError } = useGeneralData();
  const { districts, states, error: geoError } = useGeoData();
  const { banks, error: bankError } = useBankData();
  const { staffID, loading: staffIDLoading, error: staffIDError } = useStaffID();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profileImage = "/user-solid.svg";
  const { toast } = useToast();

  useEffect(() => {
    if (staffIDLoading || !staffID) return;

    const fetchUserData = async () => {
      try {
        const { data: staff, error: staffError } = await supabase
          .from("nd_staff_profile")
          .select(
            `id, is_active, fullname, ic_no, mobile_no, work_email, 
            personal_email, dob, place_of_birth, gender_id,
            marital_status, race_id, religion_id, nationality_id, staff_pay_id`
          )
          .eq("id", staffID)
          .single();

        if (staffError) throw staffError;
        if (!staff) {
          throw new Error("No staff data found");
        }
        setStaffData(staff);

        const { data: address, error: addressError } = await supabase
          .from("nd_staff_address")
          .select("id, staff_id, is_active, address1, address2, postcode, city, district_id, state_id")
          .eq("staff_id", staffID)
          .eq("is_active", true)
          .single();

        if (!address) {
          setAddressData({
            id: null,
            staff_id: staffID,
            is_active: "",
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

        const { data: payInfo, error: payInfoError } = await supabase
          .from("nd_staff_pay_info")
          .select("id, bank_id, epf_no, tax_no, bank_acc_no, socso_no")
          .eq("id", staff.staff_pay_id || 0)
          .single();

        if (!payInfo) {
          setPayInfoData({
            id: null,
            bank_id: "",
            epf_no: "",
            tax_no: "",
            bank_acc_no: "",
            socso_no: "",
          });
          return;
        }
        if (payInfoError) throw payInfoError;
        else {
          setPayInfoData(payInfo);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [staffID, staffIDLoading]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === "postcode" || id === "city" || id === "address1" || id === "address2" || id === "district_id" || id === "state_id") {
      setAddressData((prev: any) => ({
        ...prev,
        [id]: value,
      }));
    } else if (id === "bank_id" || id === "epf_no" || id === "tax_no" || id === "bank_acc_no" || id === "socso_no") {
      setPayInfoData((prev: any) => ({
        ...prev,
        [id]: value,
      }));
    } else {
      setStaffData((prev: any) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  // Save Changes - Update the data in Supabase
  const handleSave = async () => {
    try {
      const { data: staffDataResponse, error: staffDataError } = await supabase
        .from("nd_staff_profile")
        .update({
          fullname: staffData.fullname,
          ic_no: staffData.ic_no,
          mobile_no: staffData.mobile_no,
          work_email: staffData.work_email,
          personal_email: staffData.personal_email,
          dob: staffData.dob,
          place_of_birth: staffData.place_of_birth,
          gender_id: staffData.gender_id,
          marital_status: staffData.marital_status,
          race_id: staffData.race_id,
          religion_id: staffData.religion_id,
          nationality_id: staffData.nationality_id,
        })
        .eq("id", staffData.id);

      if (staffDataError) {
        console.error("Error updating staff data:", staffDataError);
        setError(staffDataError.message);
        toast({
          title: "Error",
          description: "Failed to update the staff data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      let addressDataResponse: any;
      if (addressData.id) {
        // Update existing address
        const { error: addressDataError } = await supabase
          .from("nd_staff_address")
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
          .from("nd_staff_address")
          .insert([
            {
              staff_id: addressData.staff_id,
              is_active: true,
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

      let payInfoDataResponse: any;
      if (payInfoData.id) {
        // Update existing pay info
        const { error: payInfoDataError } = await supabase
          .from("nd_staff_pay_info")
          .update({
            bank_id: payInfoData.bank_id,
            epf_no: payInfoData.epf_no,
            tax_no: payInfoData.tax_no,
            bank_acc_no: payInfoData.bank_acc_no,
            socso_no: payInfoData.socso_no, // Include socso_no
          })
          .eq("id", payInfoData.id);

        if (payInfoDataError) {
          console.error("Error updating pay info data:", payInfoDataError);
          setError(payInfoDataError.message);
          toast({
            title: "Error",
            description: "Failed to update pay info data. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Insert new pay info
        const { data, error: payInfoDataError } = await supabase
          .from("nd_staff_pay_info")
          .insert([
            {
              bank_id: payInfoData.bank_id,
              epf_no: payInfoData.epf_no,
              tax_no: payInfoData.tax_no,
              bank_acc_no: payInfoData.bank_acc_no,
              socso_no: payInfoData.socso_no, // Include socso_no
            },
          ])
          .select()
          .single();

        if (payInfoDataError) {
          console.error("Error inserting pay info data:", payInfoDataError);
          setError(payInfoDataError.message);
          toast({
            title: "Error",
            description: "Failed to create new pay info data. Please try again.",
            variant: "destructive",
          });
          return;
        }
        payInfoDataResponse = data; // Store new pay info data
        setPayInfoData(data); // Update state with the new ID

        // Update staff profile with the new staff_pay_id
        const { error: updateStaffPayIdError } = await supabase
          .from("nd_staff_profile")
          .update({ staff_pay_id: data.id })
          .eq("id", staffData.id);

        if (updateStaffPayIdError) {
          console.error("Error updating staff profile with new staff_pay_id:", updateStaffPayIdError);
          setError(updateStaffPayIdError.message);
          toast({
            title: "Error",
            description: "Failed to update staff profile with new pay info. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      console.log("Updated Pay Info Data:", payInfoDataResponse);
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

  if (loading || staffIDLoading) return <Skeleton>Loading Data...</Skeleton>;
  if (error || fetchError || geoError || bankError || staffIDError) return <div>Error: {error || fetchError || geoError || bankError || staffIDError}</div>;

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <StaffProfilePicture/>
        <PersonalInformation
          staffData={staffData}
          genders={genders}
          maritalStatuses={maritalStatuses}
          races={races}
          religions={religions}
          nationalities={nationalities}
          handleChange={handleChange}
        />
        <AddressInformation
          addressData={addressData}
          districts={districts}
          states={states}
          handleChange={handleChange}
        />
        <WorkInformation
          payInfoData={payInfoData}
          banks={banks}
          handleChange={handleChange}
        />
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffProfileSettings;