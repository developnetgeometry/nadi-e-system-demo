import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useState, FormEvent } from "react";
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
import { insertMemberData, validateIdentityNo } from "@/components/member/hook/use-registration-form";

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
  password: string;
  confirmPassword: string;
};

const INITIAL_DATA: FormData = {
  fullname: "",
  identity_no: "",
  ref_id: "",
  community_status: false,
  dob: "",
  mobile_no: "",
  email: "",
  gender: "",
  supervision: "",
  registration_status: true,
  status_membership: "",
  status_entrepreneur: false,
  join_date: "",
  register_method: "",
  nationality_id: "",
  race_id: "",
  ethnic_id: "",
  occupation_id: "",
  type_sector: "",
  socio_id: "",
  ict_knowledge: "",
  education_level: "",
  oku_status: false,
  income_range: "",
  distance: "",
  address1: "",
  address2: "",
  district_id: "",
  state_id: "",
  city: "",
  postcode: "",
  pdpa_declare: false,
  agree_declare: false,
  password: "",
  confirmPassword: "",
};

const RegistrationDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { genders, statusMemberships, nationalities, races, ethnics, occupations, typeSectors, socioeconomics, incomeLevels, ictKnowledge, educationLevels } = useGeneralData();
  const { siteProfiles } = useSiteGeneralData();
  const { states, districts, fetchDistrictsByState } = useGeoData();
  const { toast } = useToast();

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  const showValidationError = (description: string) => {
    toast({
      title: "Validation Error",
      description,
      variant: "destructive",
    });
  };

  const { currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
    <PersonalForm genders={genders} statusMemberships={statusMemberships} {...data} updateFields={updateFields} validateIdentityNo={validateIdentityNo} error={error} isValidating={isValidating} />,
    <AddressForm states={states} districts={districts} fetchDistrictsByState={fetchDistrictsByState} {...data} updateFields={updateFields} />,
    <DemographicForm nationalities={nationalities} races={races} ethnics={ethnics} occupations={occupations} typeSectors={typeSectors} socioeconomics={socioeconomics} incomeLevels={incomeLevels} ictKnowledge={ictKnowledge} educationLevels={educationLevels} {...data} updateFields={updateFields} />,
    <ReviewForm genders={genders} statusMemberships={statusMemberships} siteProfiles={siteProfiles} districts={districts} states={states} nationalities={nationalities} races={races} ethnics={ethnics} occupations={occupations} typeSectors={typeSectors} socioeconomics={socioeconomics} incomeLevels={incomeLevels} ictKnowledge={ictKnowledge} educationLevels={educationLevels} {...data} updateFields={updateFields} />,
    <AccountForm {...data} updateFields={updateFields} />,
  ]);

  const steps = [
    { label: "Personal Info", validate: () => data.fullname && data.ref_id && data.dob && data.join_date && data.identity_no && data.mobile_no && data.email && data.gender && data.status_membership },
    { label: "Address", validate: () => data.state_id && data.district_id },
    { label: "Demographics", validate: () => data.nationality_id && data.race_id && data.ethnic_id },
    { label: "Review", validate: () => data.agree_declare && data.pdpa_declare },
  ];

  function isStepComplete(index: number) {
    return steps[index].validate();
  }

  const handleNext = async () => {
    if (currentStepIndex === 0) {
      if (!data.fullname) return showValidationError("Fullname is required.");
      if (!data.ref_id) return showValidationError("Site is required.");
      if (!data.dob) return showValidationError("Date of Birth is required.");
      if (!data.join_date) return showValidationError("Join Date is required.");
      if (!data.identity_no) return showValidationError("IC Number is required.");
      if (!data.mobile_no) return showValidationError("Mobile Number is required.");
      if (!data.email) return showValidationError("Email is required.");
      if (!data.gender) return showValidationError("Gender is required.");
      if (!data.status_membership) return showValidationError("Membership status is required.");

      setError("");
      setIsValidating(true);
      try {
        await validateIdentityNo(data.identity_no);
      } catch (err: any) {
        setError(err.message);
        showValidationError("Make sure the IC Number does not exist in the system.");
        return;
      } finally {
        setIsValidating(false);
      }
    }

    if (currentStepIndex === 1) {
      if (!data.state_id) return showValidationError("State is required.");
      if (!data.district_id) return showValidationError("District is required.");
    }

    if (currentStepIndex === 2) {
      if (!data.nationality_id) return showValidationError("Nationality is required.");
      if (!data.race_id) return showValidationError("Race is required.");
      if (!data.ethnic_id) return showValidationError("Ethnic is required.");
    }

    if (currentStepIndex === 3) {
      if (!data.agree_declare) return showValidationError("Please agree to Terms and Conditions before proceeding.");
      if (!data.pdpa_declare) return showValidationError("Please agree to the PDPA declaration before proceeding.");
    }

    if (!isLastStep) {
      next();
    } else {
      try {
        await insertMemberData(data);
        toast({
          title: "Success",
          description: "Successful Account Creation.",
          variant: "default",
        });
        setData(INITIAL_DATA);
        onClose();
      } catch (error: any) {
        console.error("Error saving data:", error);
        toast({
          title: "Error",
          description: "Failed to save data. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-2">Add New Member</DialogTitle>
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
        </DialogHeader>
        <form onSubmit={(e: FormEvent) => e.preventDefault()}>
          <div >{step}</div>
          <DialogFooter className="flex justify-between w-full">
            <div>
              {!isFirstStep ? (
                <Button type="button" onClick={back} variant="outline">
                  Back
                </Button>
              ) : (
                <div />
              )}
            </div>
            <div>
              <Button type="button" onClick={handleNext}>
                {isLastStep ? "Register Member" : "Next"}
              </Button>
            </div>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;