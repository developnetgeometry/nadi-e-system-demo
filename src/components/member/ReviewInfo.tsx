import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, MapPin, User } from "lucide-react";
import useGeneralData from "@/hooks/use-general-data";
import useSiteGeneralData from "@/hooks/use-site-general-data";
import useGeoData from "@/hooks/use-geo-data";


const ReviewInfo = ({ formData, setFormData, goToPreviousTab, onSubmit}) => {
  const {
    genders,
    nationalities,
    races,
    ethnics,
    occupations,
    typeSectors,
    incomeLevels,
    socioeconomics,
    ictKnowledge,
    educationLevels,
    statusMemberships
  } = useGeneralData(); // Fetch gender options from the hook
  const { siteProfiles } = useSiteGeneralData(); // Fetch gender options from the hook
  const { districts, states } = useGeoData(); // Fetch districts and states from the hook

  const handleCheckboxChange = (field, checked) => {
    setFormData({ ...formData, [field]: checked });
  };

  const handleSubmit = () => {
    if (!formData.pdpa_declare || !formData.agree_declare) {
      alert("You must agree to the PDPA notice and terms and conditions before submitting.");
      return;
    }
    onSubmit();
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Review Information</CardTitle>
        <CardDescription>Review and submit the member registration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-md p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Full Name */}
              <div>
                <span className="text-muted-foreground">Full Name:</span>
                <p>{formData.fullname || "Not Provided"}</p>
              </div>

              {/* IC Number */}
              <div>
                <span className="text-muted-foreground">IC Number:</span>
                <p>{formData.identity_no || "Not Provided"}</p>
              </div>

              {/* NADI Site */}
              <div>
                <span className="text-muted-foreground">NADI Site:</span>
                <p>
                  {formData.ref_id
                    ? siteProfiles.find((site) => site.id.toString() === formData.ref_id)?.fullname || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* Community Status */}
              <div>
                <span className="text-muted-foreground">Community Status:</span>
                <p>
                  {formData.community_status === true
                    ? "Active"
                    : formData.community_status === false
                      ? "Inactive"
                      : "Not Specified"}
                </p>
              </div>

              {/* Gender */}
              <div>
                <span className="text-muted-foreground">Gender:</span>
                <p>
                  {formData.gender
                    ? genders.find((gender) => gender.id.toString() === formData.gender)?.eng || "Not Specified"
                    : "Not Specified"}
                </p>
              </div>

              {/* Supervisor IC Number */}
              <div>
                <span className="text-muted-foreground">Supervisor IC Number:</span>
                <p>{formData.supervision_id || "Not Provided"}</p>
              </div>

              {/* Membership Status */}
              <div>
                <span className="text-muted-foreground">Membership Status:</span>
                <p>
                  {formData.status_membership
                    ? statusMemberships.find((membership) => membership.id.toString() === formData.status_membership)?.name || "Not Specified"
                    : "Not Specified"}
                </p>
              </div>

              {/* Entrepreneur Status */}
              <div>
                <span className="text-muted-foreground">Entrepreneur Status:</span>
                <p>
                  {formData.status_entrepreneur === true
                    ? "Active"
                    : formData.status_entrepreneur === false
                      ? "Inactive"
                      : "Not Specified"}
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <span className="text-muted-foreground">Date of Birth:</span>
                <p>{formData.dob || "Not Provided"}</p>
              </div>

              {/* Mobile Number */}
              <div>
                <span className="text-muted-foreground">Mobile Number:</span>
                <p>{formData.mobile_no || "Not Provided"}</p>
              </div>

              {/* Email */}
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p>{formData.email || "Not Provided"}</p>
              </div>

              {/* Join Date */}
              <div>
                <span className="text-muted-foreground">Join Date:</span>
                <p>{formData.join_date || "Not Provided"}</p>
              </div>

              {/* Registration Method */}
              <div>
                <span className="text-muted-foreground">Registration Method:</span>
                <p>{formData.register_method || "Not Provided"}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Address Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Address Line 1 */}
              <div className="col-span-2">
                <span className="text-muted-foreground">Address Line 1:</span>
                <p>{formData.address1 || "Not Provided"}</p>
              </div>

              {/* Address Line 2 */}
              <div className="col-span-2">
                <span className="text-muted-foreground">Address Line 2:</span>
                <p>{formData.address2 || "Not Provided"}</p>
              </div>

              {/* State */}
              <div>
                <span className="text-muted-foreground">State:</span>
                <p>
                  {formData.state_id
                    ? states.find((state) => state.id.toString() === formData.state_id)?.name || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* District */}
              <div>
                <span className="text-muted-foreground">District:</span>
                <p>
                  {formData.district_id
                    ? districts.find((district) => district.id.toString() === formData.district_id)?.name || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* City */}
              <div>
                <span className="text-muted-foreground">City:</span>
                <p>{formData.city || "Not Provided"}</p>
              </div>

              {/* Postcode */}
              <div>
                <span className="text-muted-foreground">Postcode:</span>
                <p>{formData.postcode || "Not Provided"}</p>
              </div>

              {/* Distance */}
              <div>
                <span className="text-muted-foreground">Distance from NADI (km):</span>
                <p>{formData.distance || "Not Provided"}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Demographic Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Nationality */}
              <div>
                <span className="text-muted-foreground">Nationality:</span>
                <p>
                  {formData.nationality_id
                    ? nationalities.find((nationality) => nationality.id.toString() === formData.nationality_id)?.eng || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* Race */}
              <div>
                <span className="text-muted-foreground">Race:</span>
                <p>
                  {formData.race_id
                    ? races.find((race) => race.id.toString() === formData.race_id)?.eng || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* Ethnic */}
              <div>
                <span className="text-muted-foreground">Ethnic:</span>
                <p>
                  {formData.ethnic_id
                    ? ethnics.find((ethnic) => ethnic.id.toString() === formData.ethnic_id)?.eng || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* Occupation */}
              <div>
                <span className="text-muted-foreground">Occupation:</span>
                <p>
                  {formData.occupation_id
                    ? occupations.find((occupation) => occupation.id.toString() === formData.occupation_id)?.eng || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* Sector */}
              <div>
                <span className="text-muted-foreground">Sector:</span>
                <p>
                  {formData.type_sector
                    ? typeSectors.find((sector) => sector.id.toString() === formData.type_sector)?.eng || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* Socioeconomic */}
              <div>
                <span className="text-muted-foreground">Socioeconomic:</span>
                <p>
                  {formData.socio_id
                    ? socioeconomics.find((socioeconomic) => socioeconomic.id.toString() === formData.socio_id)?.eng || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* Socioeconomic */}
              <div>
                <span className="text-muted-foreground">Income Range:</span>
                <p>
                  {formData.income_range
                    ? incomeLevels.find((income) => income.id.toString() === formData.income_range)?.eng || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* ICT Knowledge */}
              <div>
                <span className="text-muted-foreground">ICT Knowledge:</span>
                <p>
                  {formData.ict_knowledge
                    ? ictKnowledge.find((ict) => ict.id.toString() === formData.ict_knowledge)?.eng || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* Education Level */}
              <div>
                <span className="text-muted-foreground">Education Level:</span>
                <p>
                  {formData.education_level_id
                    ? educationLevels.find((education) => education.id.toString() === formData.education_level_id)?.eng || "Not Selected"
                    : "Not Selected"}
                </p>
              </div>

              {/* OKU Status */}
              <div>
                <span className="text-muted-foreground">OKU Status:</span>
                <p>
                  {formData.oku_status === true
                    ? "Yes"
                    : formData.oku_status === false
                      ? "No"
                      : "Not Specified"}
                </p>
              </div>
            </div>
          </div>

          {/* PDPA Declaration */}
          <div className="space-y-2">
            <Checkbox
              id="pdpa_declare"
              checked={formData.pdpa_declare}
              onCheckedChange={(checked) => handleCheckboxChange("pdpa_declare", checked)}
              required
            />
            <Label htmlFor="pdpa_declare" className="ml-2">
              I declare that I have read and understood the PDPA notice. <span className="text-red-500 ml-1">*</span>
            </Label>
          </div>

          {/* Agree Declaration */}
          <div className="space-y-2">
            <Checkbox
              id="agree_declare"
              checked={formData.agree_declare}
              onCheckedChange={(checked) => handleCheckboxChange("agree_declare", checked)}
              required
            />
            <Label htmlFor="agree_declare" className="ml-2">
              I agree to the terms and conditions. <span className="text-red-500 ml-1">*</span>
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousTab}>
          Previous
        </Button>
        <Button type="button" onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700">
          Register Member
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewInfo;