import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddressForm } from "@/components/member/form/AddressForm";
import { PersonalForm } from "@/components/member/form/PersonalForm";
import { useMultistepForm } from "@/components/member/hook/useMultipleForm";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import useGeneralData from "@/hooks/use-general-data";
import useSiteGeneralData from "@/hooks/use-site-general-data";
import { insertMemberData, validateIdentityNo } from "@/components/member/hook/use-registration-form"; // Import the custom validation function
import useGeoData from "./hook/use-geo-data-simple";
import { DemographicForm } from "@/components/member/form/DemographicForm";
import { ReviewForm } from "@/components/member/form/ReviewForm";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

type FormData = {
  fullname: string;
  identity_no: string;
  ref_id: string;
  community_status: boolean;
  dob: string;
  mobile_no: string;
  email: string;
  gender: string;
  supervision: string;
  registration_status: boolean;
  status_membership: string;
  status_entrepreneur: boolean;
  join_date: string;
  register_method: string;

  nationality_id: string;
  race_id: string;
  ethnic_id: string;
  occupation_id: string;
  type_sector: string;
  socio_id: string;
  ict_knowledge: string;
  education_level: string;
  oku_status: boolean;
  income_range: string;

  distance: string;
  address1: string;
  address2: string;
  district_id: string;
  state_id: string;
  city: string;
  postcode: string;

  pdpa_declare: boolean;
  agree_declare: boolean;
};

const INITIAL_DATA: FormData = {
  fullname: "",
  identity_no: "",
  ref_id: "",
  community_status: false,
  dob: "",
  mobile_no: null,
  email: null,
  gender: null,
  supervision: null,
  registration_status: true,
  status_membership: null,
  status_entrepreneur: false,
  join_date: "",
  register_method: "",

  nationality_id: "",
  race_id: "",
  ethnic_id: "",
  occupation_id: null,
  type_sector: null,
  socio_id: null,
  ict_knowledge: null,
  education_level: null,
  oku_status: false,
  income_range: null,

  distance: null,
  address1: "",
  address2: "",
  district_id: "",
  state_id: "",
  city: "",
  postcode: "",

  pdpa_declare: false,
  agree_declare: false,
};

function Registration() {
  const [data, setData] = useState(INITIAL_DATA);
  const [error, setError] = useState(""); // State to store validation error
  const [isValidating, setIsValidating] = useState(false); // State to track validation in progress
  const { genders, statusMemberships, nationalities,
    races,
    ethnics,
    occupations,
    typeSectors,
    socioeconomics,
    incomeLevels,
    ictKnowledge,
    educationLevels } = useGeneralData();
  const { siteProfiles } = useSiteGeneralData();
  const { states, districts, fetchDistrictsByState } = useGeoData(); // Fetch states and districts from the useGeoData hook


  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }


  const { currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <PersonalForm
        genders={genders}
        statusMemberships={statusMemberships}
        {...data}
        updateFields={updateFields}
        validateIdentityNo={validateIdentityNo} // Pass the custom validation function
        error={error}
        isValidating={isValidating}
      />,
      <AddressForm states={states}
        districts={districts}
        fetchDistrictsByState={fetchDistrictsByState} // Pass the function to AddressForm
        {...data}
        updateFields={updateFields} />,
      <DemographicForm
        nationalities={nationalities} races={races} ethnics={ethnics}
        occupations={occupations} typeSectors={typeSectors} socioeconomics={socioeconomics}
        incomeLevels={incomeLevels} ictKnowledge={ictKnowledge} educationLevels={educationLevels}
        {...data} updateFields={updateFields}
      />,
      <ReviewForm
        genders={genders} statusMemberships={statusMemberships} siteProfiles={siteProfiles}
        districts={districts} states={states}
        nationalities={nationalities} races={races} ethnics={ethnics}
        occupations={occupations} typeSectors={typeSectors} socioeconomics={socioeconomics}
        incomeLevels={incomeLevels} ictKnowledge={ictKnowledge} educationLevels={educationLevels}
        {...data} updateFields={updateFields} />,
    ]);

  const steps = [
    { label: "Personal Info", validate: validatePersonalInfo },
    { label: "Address", validate: validateAddress },
    { label: "Demographics", validate: validateDemographics },
    { label: "Review", validate: validateReview },
  ];

  function validatePersonalInfo() {
    return data.fullname && data.ref_id && data.dob && data.join_date;
  }

  function validateAddress() {
    return data.state_id && data.district_id;
  }

  function validateDemographics() {
    return data.nationality_id && data.race_id && data.ethnic_id;
  }

  function validateReview() {
    return data.agree_declare && data.pdpa_declare;
  }

  function isStepComplete(index: number) {
    return steps[index].validate();
  }


  const handleNext = async () => {
    if (currentStepIndex === 0) {
      if (!data.fullname) {
        alert("Fullname is required.");
        return;
      }
      if (!data.ref_id) {
        alert("Site is required.");
        return;
      }
      if (!data.dob) {
        alert("Date of Birth is required.");
        return;
      }
      if (!data.join_date) {
        alert("Join Date is required.");
        return;
      }
      setError(""); // Clear any previous error
      setIsValidating(true); // Set validation in progress
      try {
        await validateIdentityNo(data.identity_no); // Call the custom validation function
      } catch (err: any) {
        setError(err.message); // Set the error message if validation fails
        alert("Make sure the IC Number is registered to the system.");
        return;
      } finally {
        setIsValidating(false); // Validation complete
      }
    }

    if (currentStepIndex === 1) { // AddressForm step
      if (!data.state_id) {
        alert("State is required.");
        return;
      }
      if (!data.district_id) {
        alert("District is required.");
        return;
      }
    }

    if (currentStepIndex === 2) { // DemographicForm step
      if (!data.nationality_id) {
        alert("Nationality is required.");
        return;
      }
      if (!data.race_id) {
        alert("Race is required.");
        return;
      }
      if (!data.ethnic_id) {
        alert("Ethnic is required.");
        return;
      }
    }

    if (currentStepIndex === 3) { // DemographicForm step
      if (data.agree_declare != true) {
        alert("Please agree to Terms and Conditions before proceeding.");
        return;
      }
      if (data.pdpa_declare != true) {
        alert("Please agree to the PDPA declaration before proceeding.");
        return;
      }

    }


    if (!isLastStep) {
      next();
    } else {
      try {
        // Call the insertStaffData function to save the data
        await insertMemberData(data);
        alert("Successful Account Creation");

        setData(INITIAL_DATA); // Reset form data to initial state
        window.location.reload();
      } catch (error: any) {
        console.error("Error saving data:", error);
        alert("Failed to save data. Please try again.");
      }
    }
  };


  function onSubmit(e: FormEvent) {
    e.preventDefault();
    handleNext();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Member Registration</h1>
          <p className="text-muted-foreground">
            Register new members with detailed information
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-lg overflow-hidden">
          {steps.map((step, index) => {
            const isActive = currentStepIndex === index;
            const isCompleted = isStepComplete(index);

            return (
              <div
                key={index}
                className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 text-sm transition-all 
          ${isActive ? "bg-white font-semibold text-foreground shadow-sm dark:text-black" : "text-muted-foreground hover:bg-muted/50"}`}
              >
                {isCompleted && <CheckCircle className="text-green-500" size={16} />}
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>


        <Card className="w-full">
          <CardContent className="space-y-4 p-6">
            {step}
          </CardContent>
          <form onSubmit={onSubmit} className="w-full">

            <CardFooter className="justify-between">
              {!isFirstStep ? (
                <Button type="button" onClick={back} variant="outline">
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button type="submit">
                {isLastStep ? "Register Member" : "Next"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>

  );
}

export default Registration;