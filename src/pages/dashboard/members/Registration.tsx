import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PersonalForm } from "@/components/member/form/PersonalForm";
import { AddressForm } from "@/components/member/form/AddressForm";
import { DemographicForm } from "@/components/member/form/DemographicForm";
import { ReviewForm } from "@/components/member/form/ReviewForm";
import { AccountForm } from "@/components/member/form/AccountForm";
import { useMultistepForm } from "@/components/member/hook/useMultipleForm";
import { useToast } from "@/hooks/use-toast";
import useGeneralData from "@/hooks/use-general-data";
import useSiteGeneralData from "@/hooks/use-site-general-data";
import useGeoData from "./hook/use-geo-data-simple";
import { insertMemberData } from "@/components/member/hook/use-registration-form";
import { ICForm } from "@/components/member/form/ICForm";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form } from "react-router-dom";
import { MemberIdDialog } from "@/components/member/form/MemberIdDialog";
import { getDistrictId, getGenderId, getNationalityId, getRaceId, getStateId } from "./hook/return-lookup-id";

type FormData = {
  identity_no_type: string;
  identity_no: string;
  isIcNumberExist: boolean;
  isIcYearValid: boolean;
  isIcMonthValid: boolean;
  isIcDayValid: boolean;
  isIcNumberValid: boolean;
  isUnder12: boolean;
  parent_fullname: string;
  parent_ic_no: string;
  parent_relationship_id: string;
  parent_mobile_no: string;
  parent_address1: string;
  parent_address2: string;
  parent_district_id: string;
  parent_state_id: string;
  parent_city: string;
  parent_postcode: string;


  fullname: string;
  ref_id: string;
  community_status: boolean;
  dob: string;
  mobile_no: string;
  email: string;
  isEmailExist: boolean;
  gender: string;
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

  password: string;
  confirmPassword: string;
};

const INITIAL_DATA: FormData = {
  identity_no_type: "",
  identity_no: "",
  isIcNumberExist: false,
  isIcYearValid: false,
  isIcMonthValid: false,
  isIcDayValid: false,
  isIcNumberValid: false,
  isUnder12: false,
  parent_fullname: "",
  parent_ic_no: "",
  parent_relationship_id: null,
  parent_mobile_no: "",
  parent_address1: "",
  parent_address2: "",
  parent_district_id: null,
  parent_state_id: null,
  parent_city: "",
  parent_postcode: "",
  fullname: "",
  ref_id: null,
  community_status: false,
  dob: null,
  mobile_no: "",
  email: "",
  isEmailExist: false,
  gender: null,
  registration_status: true,
  status_membership: "1",
  status_entrepreneur: false,
  join_date: new Date().toLocaleDateString("en-CA"), // 'YYYY-MM-DD' in local time
  register_method: "3",
  nationality_id: null,
  race_id: null,
  ethnic_id: null,
  occupation_id: null,
  type_sector: null,
  ict_knowledge: null,
  education_level: null,
  oku_status: false,
  income_range: null,
  distance: null,
  address1: "",
  address2: "",
  district_id: null,
  state_id: null,
  city: "",
  postcode: "",
  pdpa_declare: false,
  agree_declare: false,
  password: "",
  confirmPassword: "",
};

const RegistrationPage = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false); // Add loading state
  const { genders, statusMemberships, nationalities, races, ethnics, occupations, typeSectors, incomeLevels, ictKnowledge, educationLevels, identityNoTypes, typeRelationships, registrationMethods } = useGeneralData();
  const { siteProfiles } = useSiteGeneralData();
  const { states, districts, fetchDistrictsByState } = useGeoData();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMembershipId, setDialogMembershipId] = useState<string | null>(null);
  const dummyInput = useRef<HTMLInputElement>(null);
  const [shouldRunICBlur, setShouldRunICBlur] = useState(false);

  function updateFields(fields) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  const showValidationError = (description) => {
    toast({
      title: "Validation Error",
      description,
      variant: "destructive",
    });
  };

  const { currentStepIndex, step, isFirstStep, isLastStep, back, next, reset } = useMultistepForm([
    <ICForm {...data} updateFields={updateFields} identityNoTypes={identityNoTypes} states={states} districts={districts} fetchDistrictsByState={fetchDistrictsByState}
      typeRelationships={typeRelationships} shouldRunICBlur={shouldRunICBlur} setShouldRunICBlur={setShouldRunICBlur} />,
    <PersonalForm genders={genders} statusMemberships={statusMemberships} registrationMethods={registrationMethods} {...data} updateFields={updateFields} />,
    <AddressForm states={states} districts={districts} fetchDistrictsByState={fetchDistrictsByState} {...data} updateFields={updateFields} />,
    <DemographicForm nationalities={nationalities} races={races} ethnics={ethnics} occupations={occupations} typeSectors={typeSectors} incomeLevels={incomeLevels} ictKnowledge={ictKnowledge} educationLevels={educationLevels} {...data} updateFields={updateFields} />,
    <ReviewForm genders={genders} statusMemberships={statusMemberships} siteProfiles={siteProfiles} districts={districts} states={states} nationalities={nationalities} races={races} ethnics={ethnics} occupations={occupations} typeSectors={typeSectors} incomeLevels={incomeLevels} ictKnowledge={ictKnowledge} educationLevels={educationLevels} typeRelationships={typeRelationships} registrationMethods={registrationMethods} {...data} updateFields={updateFields} />,
    <AccountForm {...data} updateFields={updateFields} />,
  ]);

  const steps = [
    { label: "Identity Number", validate: () => data.identity_no_type && data.identity_no && data.isIcNumberExist },
    { label: "Personal Info", validate: () => data.fullname && data.ref_id && data.dob && data.join_date && data.mobile_no && data.email && data.gender && data.status_membership },
    { label: "Address", validate: () => data.state_id && data.district_id },
    { label: "Demographics", validate: () => data.nationality_id && data.race_id && data.ethnic_id },
    { label: "Review", validate: () => data.agree_declare && data.pdpa_declare },
  ];

  function isStepComplete(index) {
    return steps[index].validate();
  }

  const handleNext = async () => {
    //to activate blur
    dummyInput.current?.blur();

    if (currentStepIndex === 0) {
      if (!data.identity_no_type) return showValidationError("Identity type is required.");
      if (!data.identity_no) return showValidationError("IC number is required.");
      if (data.identity_no_type === "1") {
        if (data.identity_no.length !== 12) return showValidationError("IC number must be 12 digits.");
        if (!data.isIcYearValid) return showValidationError("IC year is invalid.");
        if (!data.isIcMonthValid) return showValidationError("IC month is invalid.");
        if (!data.isIcDayValid) return showValidationError("IC day is invalid.");
        if (!data.isIcNumberValid) return showValidationError("IC number is invalid.");
      }
      if (data.isIcNumberExist) return showValidationError("Identity number already exists in the system.");
      if (data.isUnder12) {
        if (!data.parent_fullname) return showValidationError("Guardian's Fullname is required.");
        if (!data.parent_ic_no) return showValidationError("Guardian's IC Number is required.");
        if (!data.parent_relationship_id) return showValidationError("Guardian's Relationship is required.");
        if (!data.parent_mobile_no) return showValidationError("Guardian's Mobile Number is required.");
        if (!data.parent_address1) return showValidationError("Guardian's Address Line 1 is required.");
        if (!data.parent_district_id) return showValidationError("Guardian's District is required.");
        if (!data.parent_state_id) return showValidationError("Guardian's State is required.");
        if (!data.parent_postcode) return showValidationError("Guardian's Postcode is required.");
      }
    }

    if (currentStepIndex === 1) {
      if (!data.fullname) return showValidationError("Fullname is required.");
      if (!data.ref_id) return showValidationError("Site is required.");
      if (!data.dob) return showValidationError("Date of Birth is required.");
      if (!data.join_date) return showValidationError("Join Date is required.");
      // if (!data.mobile_no) return showValidationError("Mobile Number is required.");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return showValidationError("Invalid email format. Please enter a valid email address eg: (abc@gmail.com).");
      }
      if (data.isEmailExist) return showValidationError("Email already exists in the system.");
      if (!data.gender) return showValidationError("Gender is required.");
      if (!data.status_membership) return showValidationError("Membership status is required.");
    }

    // if (currentStepIndex === 2) {
    //   if (!data.state_id) return showValidationError("State is required.");
    //   if (!data.district_id) return showValidationError("District is required.");
    // }

    // if (currentStepIndex === 3) {
    //   if (!data.nationality_id) return showValidationError("Nationality is required.");
    //   if (!data.race_id) return showValidationError("Race is required.");
    //   if (!data.ethnic_id) return showValidationError("Ethnic is required.");
    // }

    if (currentStepIndex === 4) {
      if (!data.agree_declare) return showValidationError("Please agree to Terms and Conditions before proceeding.");
      if (!data.pdpa_declare) return showValidationError("Please agree to the PDPA declaration before proceeding.");
    }

    if (!isLastStep) {
      next();
    } else {
      try {
        setLoading(true); // Start loading
        const { success, membershipId } = await insertMemberData(data);

        toast({
          title: "Success",
          description: "The new member has been successfully registered.",
          variant: "default",
        });
        setData(INITIAL_DATA);
        reset();
        setDialogOpen(true); // Assuming you have a state to control the dialog visibility
        queryClient.invalidateQueries({ queryKey: ["members"] });

        setDialogMembershipId(membershipId); // Pass the membershipId to the dialog
      } catch (error) {
        console.error("Error saving data:", error);
        toast({
          title: "Error",
          description: "Failed to save data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  type MessageType = "success" | "error";
  const [loading2, setLoading2] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("success");

  const getColorClasses = () => {
    return messageType === "success"
      ? "bg-green-100 border-green-400 text-green-800"
      : "bg-red-100 border-red-400 text-red-800";
  };

  const readMyKad = async () => {
    setLoading2(true);
    setMessage("");

    try {
      setData(INITIAL_DATA);

      const response = await fetch("http://127.0.0.1:5000/api/mykad-reader");
      const icData = await response.json();

      console.log("IC Data:", icData.data?.ic);

      // Check if status is "success"
      if (icData.status === "success") {
        const genderId = await getGenderId(icData.data.sex).catch((err) => {
          console.error("Failed to get gender ID:", err);
          return null;
        });
        const nationalityId = await getNationalityId(icData.data.nationality).catch((err) => {
          console.error("Failed to get nationality ID:", err);
          return null;
        });
        const raceId = await getRaceId(icData.data.race).catch((err) => {
          console.error("Failed to get race ID:", err);
          return null;
        });

        const stateId = await getStateId(icData.data.address.state).catch((err) => {
          console.error("Failed to get state ID:", err);
          return null;
        });

        const districtId = await getDistrictId(icData.data.address.city, stateId).catch((err) => {
          console.error("Failed to get district ID:", err);
          return null;
        });

        // console.log(icData.data.sex, genderId);
        // console.log(icData.data.address.state, stateId);
        // console.log(icData.data.address.city, districtId);


        updateFields({
          identity_no_type: "1",
          identity_no: icData.data.ic ?? "",
          dob: icData.data.dob ?? "",
          fullname: (icData.data.first_name ?? "") + " " + (icData.data.last_name ?? ""),
          gender: genderId.toString() ?? "",
          nationality_id: nationalityId?.toString() ?? "",
          race_id: raceId?.toString() ?? "",
          address1: icData.data.address.line1 ?? "",
          address2: (icData.data.address.line2 ?? "") + " " + (icData.data.address.line3 ?? ""),
          state_id: stateId?.toString() ?? "",
          district_id: districtId?.toString() ?? "",
          city: icData.data.address.city ?? "",
          postcode: icData.data.address.postcode ?? "",
        });

        setShouldRunICBlur(true);

        setMessageType("success");
        setMessage("Successfully connected to smartcard reader API.");
      } else {
        // Not successful (e.g., card not detected)
        setMessageType("error");
        setMessage("No card detected.");
      }
    } catch (err: any) {
      console.error("Error connecting to smartcard reader API:", err);
      setMessageType("error");
      setMessage("Failed to connect to smartcard reader API.");
      reset();
    } finally {
      setLoading2(false);
    }
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
    reset();
    setMessage("");
    setShouldRunICBlur(false);
  }


  return (
    <>

      <div className="space-y-6">
        <h1 className="text-xl font-bold">Member Registration</h1>
        <Card className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
              <Loader2 className="animate-spin w-10 h-10 text-primary" />
              <span className="ml-3 text-lg font-semibold">Registering...</span>
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <CardTitle className="text-2xl font-bold">Add New Member</CardTitle>
                <p className="text-muted-foreground text-sm">Fill in the details for the new member</p>
              </div>
              {(message && isFirstStep) && (
                <div
                  className={`relative border px-4 py-2 rounded shadow mb-4 ${getColorClasses()}`}
                >
                  <span className="mr-3">{message}</span>
                  <button
                    className="absolute top-1 right-2 text-lg font-bold hover:text-black"
                    onClick={() => setMessage("")}
                  >
                    ×
                  </button>
                </div>
              )}
              
              {isFirstStep && (
                <div className="flex space-x-2">
                  <Button variant="secondary" onClick={handleReset} disabled={loading2}>
                    Reset
                  </Button>
                  <Button variant="outline" onClick={readMyKad} disabled={loading2}>
                    Load MyKad Reader
                  </Button>
                </div>
              )}

            </div>
            {/* <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre> */}
          </CardHeader>

          <CardContent>
            <div className="flex bg-muted rounded-lg overflow-hidden mt-4">
              {steps.map((step, index) => {
                const isActive = currentStepIndex === index;
                const isCompleted = isStepComplete(index);

                return (
                  <div
                    key={index}
                    className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 text-sm transition-all border rounded-md
              ${isActive ? "bg-white font-semibold text-foreground shadow-sm dark:text-black" : "text-muted-foreground hover:bg-muted/50"}`}
                  >
                    {isCompleted && <CheckCircle className="text-green-500" size={16} />}
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>
            <form onSubmit={(e: FormEvent) => e.preventDefault()} className="mt-4">
              <div>{step}</div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between w-full mt-4">
            {!isFirstStep ? (
              <Button type="button" onClick={back} variant="outline" disabled={loading}>
                Back
              </Button>
            ) : (
              <div /> // Placeholder to maintain spacing
            )}

            <Button type="button" onClick={handleNext}>
              {isLastStep ? "Register Member" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>




      {/* Dialog for membershipId */}
      <MemberIdDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        membershipId={dialogMembershipId}
      />
    </>
  );
};

export default RegistrationPage;