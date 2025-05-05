import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { debounce } from "lodash"; // Import lodash debounce
import { SiteProfileSelect } from "../components/SiteProfileSelect";
import { useSiteProfiles } from "../hook/useSiteProfile";

type PersonalData = {
  fullname: string;
  identity_no: string;
  ref_id: string;
  community_status: boolean | string | null;
  dob: string;
  mobile_no: string;
  email: string;
  gender: string;
  supervision: string;
  status_membership: string;
  status_entrepreneur: boolean | string | null;
  join_date: string;
  register_method: string;
};

type PersonalFormProps = PersonalData & {
  updateFields: (fields: Partial<PersonalData>) => void;
  genders: { id: string; eng: string }[];
  statusMemberships: { id: string; name: string }[];
  validateIdentityNo: (identity_no: string) => Promise<void>;
  error: string;
  isValidating: boolean;
};

export function PersonalForm({
  fullname,
  identity_no,
  ref_id,
  community_status,
  dob,
  mobile_no,
  email,
  gender,
  supervision,
  status_membership,
  status_entrepreneur,
  join_date,
  register_method,
  updateFields,
  genders,
  statusMemberships,
  validateIdentityNo,
}: PersonalFormProps) {
  const [error, setError] = useState(""); // State to store validation error
  const [isValidating, setIsValidating] = useState(false); // State to track validation in progress

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFields({ [name]: value });

    if (name === "identity_no") {
      setError(""); // Clear any previous error
      setIsValidating(true); // Set validation in progress
      debouncedValidateIdentityNo(value); // Call the debounced validation function
    }
  };

  // Debounced validation function
  const debouncedValidateIdentityNo = debounce(async (value: string) => {
    try {
      await validateIdentityNo(value); // Validate the IC number
      setError(""); // Clear error if validation passes
    } catch (err: any) {
      setError(err.message); // Set the error message if validation fails
    } finally {
      setIsValidating(false); // Validation complete
    }
  }, 500); // 500ms debounce delay

  const { profiles = [], loading, error: siteProfilesError } = useSiteProfiles();

  return (
    <>
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="font-bold text-xl">Personal Information</h1>
        <p className="text-muted-foreground">
          Enter the basic personal information of the new member
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label className="flex items-center">
          Full Name <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          autoFocus
          required
          type="text"
          name="fullname"
          value={fullname}
          onChange={handleChange}
        />
      </div>

      {/* IC Number */}
      <div className="space-y-2">
        <Label className="flex items-center">
          IC Number <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          required
          type="text"
          name="identity_no"
          value={identity_no}
          onChange={handleChange}
          placeholder="e.g. 950101123456"
        />
        {isValidating && <p className="text-gray-500 text-sm">Validating...</p>} {/* Show validation in progress */}
        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error */}
      </div>

      {/* Site ID */}
      <div className="space-y-2">
        <Label className="flex items-center">
          NADI Site (Registered Location)
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <SiteProfileSelect
          profiles={profiles}
          value={ref_id ? parseInt(ref_id) : null}
          onValueChange={(value) => updateFields({ ref_id: value.toString() })}
          disabled={loading}
        />
        {loading && (
          <p className="text-sm text-muted-foreground">Loading NADI site...</p>
        )}
        {siteProfilesError && (
          <p className="text-sm text-destructive">{siteProfilesError}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label className="flex items-center">Date of Birth <span className="text-red-500 ml-1">*</span></Label>
        <Input
          type="date"
          value={dob}
          onChange={(e) => updateFields({ dob: e.target.value })}
          required
        />
      </div>

      {/* Mobile Number */}
      <div className="space-y-2">
        <Label className="flex items-center">Mobile Number</Label>
        <Input
          type="tel"
          value={mobile_no}
          onChange={(e) => updateFields({ mobile_no: e.target.value })}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label className="flex items-center">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => updateFields({ email: e.target.value })}
        />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="flex items-center">Gender</Label>
        <Select
          value={gender || ""}
          onValueChange={(value) => updateFields({ gender: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            {genders.map((gender) => (
              <SelectItem key={gender.id} value={gender.id.toString()}>
                {gender.eng}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Supervisor IC Number */}
      <div className="space-y-2">
        <Label className="flex items-center">Parent IC Number</Label>
        <Input
          value={supervision}
          onChange={(e) => updateFields({ supervision: e.target.value })}
        />
      </div>

      {/* Membership Status */}
      <div className="space-y-2">
        <Label className="flex items-center">Membership Status</Label>
        <Select
          value={status_membership || ""}
          onValueChange={(value) => updateFields({ status_membership: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status membership" />
          </SelectTrigger>
          <SelectContent>
            {statusMemberships.map((membership) => (
              <SelectItem key={membership.id} value={membership.id.toString()}>
                {membership.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Community Status */}
      <div className="space-y-2">
        <Label className="flex items-center">Community Status</Label>
        <RadioGroup
          value={community_status?.toString() ?? "null"}
          onValueChange={(value) =>
            updateFields({ community_status: value === "true" ? true : value === "false" ? false : null })
          }
        >
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="true" id="community_status_yes" />
            <Label htmlFor="community_status_yes">Active</Label>
            <RadioGroupItem value="false" id="community_status_no" />
            <Label htmlFor="community_status_no">Inactive</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Entrepreneur Status */}
      <div className="space-y-2">
        <Label className="flex items-center">Entrepreneur Status</Label>
        <RadioGroup
          value={status_entrepreneur?.toString() ?? "null"}
          onValueChange={(value) =>
            updateFields({ status_entrepreneur: value === "true" ? true : value === "false" ? false : null })
          }
        >
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="true" id="status_entrepreneur_yes" />
            <Label htmlFor="status_entrepreneur_yes">Active</Label>
            <RadioGroupItem value="false" id="status_entrepreneur_no" />
            <Label htmlFor="status_entrepreneur_no">Inactive</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Join Date */}
      <div className="space-y-2">
        <Label className="flex items-center">Join Date <span className="text-red-500 ml-1">*</span></Label>
        <Input
          type="date"
          value={join_date}
          onChange={(e) => updateFields({ join_date: e.target.value })}
          required
        />
      </div>

      {/* Registration Method */}
      <div className="space-y-2">
        <Label className="flex items-center">Registration Method</Label>
        <Input
          value={register_method}
          onChange={(e) => updateFields({ register_method: e.target.value })}
          placeholder="e.g. Web, Mobile, On Premise."
        />
      </div>
    </>
  );
}