import React, { useState } from "react";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { Button } from "@/components/ui/button";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { Edit } from "lucide-react";
import StaffPictureUploadDialog from "./StaffPictureUploadDialog";
import MemberPictureUploadDialog from "./MemberPictureUploadDialog";
import OverviewPageDialog from "./OverviewPageDialog";

const ProfileOverviewPage = ({ profileData }: { profileData: any }) => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userGroup = parsedMetadata?.user_group;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);


  if (!userGroup) {
    return <SettingsLoading />;
  }
  const handleSave = (updatedData: any) => {
    console.log("Updated profile data:", updatedData);
    // Add logic to save the updated data
    setIsEditDialogOpen(false); // Close the dialog after saving
  };

  const handleEditProfileImageClick = () => {
    if (userGroup === 6) {
      setIsStaffDialogOpen(true);
    } else if (userGroup === 7) {
      setIsMemberDialogOpen(true);
    }
  };

  return (
    <div>
      {/* <pre>{JSON.stringify(profileData, null, 2)}</pre> */}
      {(userGroup === 6 || userGroup === 7) && (
        <div className="flex flex-col items-center mb-4">
          <div className="h-24 w-24 border-4 border-gray-100 rounded-full overflow-hidden">
            <img
              src={profileData.file_path || "/user-solid.svg"}
              alt={profileData.fullname || "Profile Image"}
              className="h-full w-full object-cover"
            />
          </div>

          <Button
            variant="link"
            size="sm"
            className="mt-2 text-primary hover:underline"
            onClick={handleEditProfileImageClick}
          >
            Edit profile image
          </Button>

          {/* Staff Picture Upload Dialog */}
          {userGroup === 6 && (
            <StaffPictureUploadDialog
              open={isStaffDialogOpen}
              onOpenChange={setIsStaffDialogOpen}
              onFilesSelected={(files) => {
                console.log("Staff files selected:", files);
              }}
            />
          )}

          {/* Member Picture Upload Dialog */}
          {userGroup === 7 && (
            <MemberPictureUploadDialog
              open={isMemberDialogOpen}
              onOpenChange={setIsMemberDialogOpen}
              onFilesSelected={(files) => {
                console.log("Member files selected:", files);
              }}
            />
          )}
        </div>
      )}

      <div className="flex justify-between items-center mb-6 pt-4">
        <h3 className="text-xl font-bold">Profile Details</h3>
        <Button
          variant="ghost"
          className="text-primary flex items-center gap-1"
          onClick={() => setIsEditDialogOpen(true)} // Open the dialog
        >
          <Edit size={16} /> Edit profile details
        </Button>
      </div>
      <OverviewPageDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        profileData={profileData}
        userGroup={userGroup}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6 || userGroup === 7) && (
          <div>
            <p className="text-sm text-gray-500">Full Name:</p>
            <p className="text-base font-medium">{profileData.fullname ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">IC Number:</p>
            <p className="text-base font-medium">{profileData.ic_no ?? "N/A"}</p>
          </div>
        )}
        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">IC Number:</p>
            <p className="text-base font-medium">{profileData.identity_no ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6 || userGroup === 7) && (
          <div>
            <p className="text-sm text-gray-500">Mobile Number:</p>
            <p className="text-base font-medium">{profileData.mobile_no ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">Work Email:</p>
            <p className="text-base font-medium">{profileData.work_email ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 3 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">Personal Email:</p>
            <p className="text-base font-medium">{profileData.personal_email ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 3 || userGroup === 6 || userGroup === 7) && (
          <div>
            <p className="text-sm text-gray-500">Date of Birth:</p>
            <p className="text-base font-medium">{profileData.dob ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 3 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">Place of Birth:</p>
            <p className="text-base font-medium">{profileData.place_of_birth ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 3 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">Marital Status:</p>
            <p className="text-base font-medium">{profileData.marital_status?.eng ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 3 || userGroup === 6 || userGroup === 7) && (
          <div>
            <p className="text-sm text-gray-500">Race:</p>
            <p className="text-base font-medium">{profileData.race_id?.eng ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 3 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">Religion:</p>
            <p className="text-base font-medium">{profileData.religion_id?.eng ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 3 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">Nationality:</p>
            <p className="text-base font-medium">{profileData.nationality_id?.eng ?? "N/A"}</p>
          </div>
        )}
        {userGroup === 6 && (
          <div>
            <p className="text-sm text-gray-500">Gender:</p>
            <p className="text-base font-medium">{profileData.gender_id?.eng ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">Position:</p>
            <p className="text-base font-medium">{profileData.position_id?.name ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 3 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">Qualification:</p>
            <p className="text-base font-medium">{profileData.qualification ?? "N/A"}</p>
          </div>
        )}
        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6) && (
          <div>
            <p className="text-sm text-gray-500">Account Status:</p>
            <p className="text-base font-medium">
              {profileData.is_active !== null && profileData.is_active !== undefined
                ? profileData.is_active
                  ? "Active"
                  : "Inactive"
                : "N/A"}
            </p>
          </div>
        )}
        {userGroup === 5 && (
          <div>
            <p className="text-sm text-gray-500">Registration Number:</p>
            <p className="text-base font-medium">{profileData.registration_number ?? "N/A"}</p>
          </div>
        )}
        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">NADI Site:</p>
            <p className="text-base font-medium">{profileData.ref_id?.sitename ?? "N/A"}</p>
          </div>
        )}
        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Type Membership:</p>
            <p className="text-base font-medium">{profileData.type_membership ?? "N/A"}</p>
          </div>
        )}
        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Community Status:</p>
            <p className="text-base font-medium">
              {profileData.community_status === true
                ? "Active"
                : profileData.community_status === false
                  ? "Inactive"
                  : "N/A"}
            </p>
          </div>
        )}


        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Age:</p>
            <p className="text-base font-medium">{profileData.age ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Email:</p>
            <p className="text-base font-medium">{profileData.email ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Gender:</p>
            <p className="text-base font-medium">{profileData.gender?.eng ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Ethnic:</p>
            <p className="text-base font-medium">{profileData.ethnic_id ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Occupation:</p>
            <p className="text-base font-medium">{profileData.occupation_id?.eng ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Type Sector:</p>
            <p className="text-base font-medium">{profileData.type_sector?.eng ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Socioeconomic:</p>
            <p className="text-base font-medium">{profileData.socio_id?.eng ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">ICT Knowledge:</p>
            <p className="text-base font-medium">{profileData.ict_knowledge?.eng ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Education Level:</p>
            <p className="text-base font-medium">{profileData.education_level?.eng ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">OKU Status:</p>
            <p className="text-base font-medium">
              {profileData.oku_status === true
                ? "Yes"
                : profileData.oku_status === false
                  ? "No"
                  : "N/A"}
            </p>
          </div>
        )}


        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Income Range:</p>
            <p className="text-base font-medium">{profileData.income_range?.eng ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Distance:</p>
            <p className="text-base font-medium">{profileData.distance ?? "N/A"}</p>
          </div>
        )}

        {(userGroup === 1 || userGroup === 3 || userGroup === 4 || userGroup === 7) && (
          <div>
            <p className="text-sm text-gray-500">Join Date:</p>
            <p className="text-base font-medium">{profileData.join_date ?? "N/A"}</p>
          </div>
        )}

        {(userGroup === 1 || userGroup === 3 || userGroup === 4) && (
          <div>
            <p className="text-sm text-gray-500">Resign Date:</p>
            <p className="text-base font-medium">{profileData.resign_date ?? "N/A"}</p>
          </div>
        )}

        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Status Membership:</p>
            <p className="text-base font-medium">
              {profileData.status_membership === true
                ? "Active"
                : profileData.status_membership === false
                  ? "Inactive"
                  : "N/A"}
            </p>
          </div>
        )}


        {userGroup === 7 && (
          <div>
            <p className="text-sm text-gray-500">Status Entrepreneur:</p>
            <p className="text-base font-medium">
              {profileData.status_entrepreneur === true
                ? "Active"
                : profileData.status_entrepreneur === false
                  ? "Inactive"
                  : "N/A"}
            </p>
          </div>
        )}
        {userGroup === 3 && (
          <div>
            <p className="text-sm text-gray-500">Tech Partner:</p>
            <p className="text-base font-medium">{profileData.tech_partner_id?.name ?? "N/A"}</p>
          </div>
        )}
        {userGroup === 1 && (
          <div>
            <p className="text-sm text-gray-500">DUSP:</p>
            <p className="text-base font-medium">{profileData.dusp_id?.name ?? "N/A"}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileOverviewPage;