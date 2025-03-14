import React from 'react';
import useDuspProfileData from "@/components/profile/hook/use-dusp-profile-data";
import usePositionData from "@/hooks/use-position-data";
import useGeneralData from "@/hooks/use-general-data";
import PersonalInformation from "./PersonalInformation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";

const DuspProfileSettings = () => {
  const { profileData, handleChange, handleSave, loading, error } = useDuspProfileData();
  const { positions, error: positionError } = usePositionData();
  const { maritalStatuses, races, religions, nationalities, error: generalDataError } = useGeneralData();

  if (loading) return <Skeleton>Loading Data...</Skeleton>;
  if (error || positionError || generalDataError) return <div>Error: {error || positionError || generalDataError}</div>;

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <PersonalInformation
          profileData={profileData}
          handleChange={handleChange}
          userType="dusp"
          positions={positions}
          maritalStatuses={maritalStatuses}
          races={races}
          religions={religions}
          nationalities={nationalities}
        />
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DuspProfileSettings;