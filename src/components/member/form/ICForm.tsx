import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle } from "lucide-react"; // Add this for icons
import { ICBoxInput } from "../components/IcBoxInput";

type ICData = {
  identity_no_type: string;
  identity_no: string;
  isIcNumberExist: boolean;
  isIcNumberValid: boolean;
  isUnder12: boolean;
  dob?: string;
  gender?: string;
  nationality_id?: string;


  parent_fullname?: string;
  parent_ic_no?: string;
  parent_mobile_no?: string;
  parent_relationship_id?: string;
  parent_address1?: string;
  parent_address2?: string;
  parent_state_id?: string;
  parent_district_id?: string;
  parent_city?: string;
  parent_postcode?: string;
};

type ICFormProps = ICData & {
  updateFields: (fields: Partial<ICData>) => void;
  identityNoTypes: { id: string; eng: string }[];

  typeRelationships?: { id: string; eng: string }[];
  states?: { id: string; name: string }[];
  districts?: { id: string; name: string }[];
  fetchDistrictsByState?: (stateId: string) => Promise<void>;
};

export function ICForm({
  identity_no,
  identity_no_type,
  isIcNumberExist,
  isIcNumberValid,
  isUnder12,
  updateFields,
  identityNoTypes,
  dob,
  gender,
  nationality_id,

  parent_fullname,
  parent_ic_no,
  parent_mobile_no,
  parent_relationship_id,
  parent_address1,
  parent_address2,
  parent_state_id,
  parent_district_id,
  parent_city,
  parent_postcode,
  typeRelationships,
  states,
  districts,
  fetchDistrictsByState,
}: ICFormProps) {
  const [checking, setChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [lastValidatedIC, setLastValidatedIC] = useState<string | null>(null); // 🆕 Track last validated
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (identity_no.length <= 5) {
      setHasChecked(false);
      return;
    }

    if (identity_no === lastValidatedIC) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setChecking(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("ic_number")
        .eq("ic_number", identity_no)
        .maybeSingle();

      if (!error) {
        const exists = !!data;
        updateFields({ isIcNumberExist: !exists });
        setHasChecked(true);
        setLastValidatedIC(identity_no);
      }

      setChecking(false);

      if (identity_no_type === "1" && identity_no.length >= 6) {
        const yearPart = parseInt(identity_no.substring(0, 2), 10);
        const monthPart = parseInt(identity_no.substring(2, 4), 10);
        const dayPart = parseInt(identity_no.substring(4, 6), 10);

        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const fullYear = yearPart > currentYear ? 1900 + yearPart : 2000 + yearPart;

        const isValidMonth = monthPart >= 1 && monthPart <= 12;
        const isValidDay = dayPart >= 1 && dayPart <= 31;

        const dob = new Date(fullYear, monthPart - 1, dayPart);
        const today = new Date();

        const isExactDateMatch =
          dob.getFullYear() === fullYear &&
          dob.getMonth() === monthPart - 1 &&
          dob.getDate() === dayPart;

        const isValidDate = isValidMonth && isValidDay && isExactDateMatch && dob < today;

        updateFields({ isIcNumberValid: isValidDate, nationality_id: "1" }); // 👈 set nationality_id

        if (!isValidDate) {
          updateFields({
            dob: null,
            gender: null,
            isUnder12: false,
          });
          return;
        }

        const age = now.getFullYear() - fullYear;
        const dobString = `${fullYear.toString().padStart(4, "0")}-${monthPart
          .toString()
          .padStart(2, "0")}-${dayPart.toString().padStart(2, "0")}`;

        const lastDigit = parseInt(identity_no.charAt(identity_no.length - 1), 10);
        const gender = lastDigit % 2 === 0 ? "2" : "1";

        updateFields({
          dob: dobString,
          gender,
          isUnder12: age <= 12,
        });
      } else if (identity_no_type === "1") {
        updateFields({ isIcNumberValid: false, isUnder12: false, dob: null });
      }

    }, 500);
  }, [identity_no, updateFields, lastValidatedIC]);




  return (
    <>
      <div className="mb-4">Identity Information</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identity Type */}
        <div className="space-y-2">
          <Label className="flex items-center">
            Identity Type <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={identity_no_type || ""}
            onValueChange={(value) => {
              updateFields({
                identity_no_type: value,
                identity_no: "", // 👈 reset identity number
                isIcNumberExist: false, // 👈 optionally reset validation
                isIcNumberValid: false, // 👈 reset validation status
                isUnder12: false, // 👈 reset under 12 status
              });
              setHasChecked(false); // 👈 reset checked status
              setLastValidatedIC(null); // 👈 clear validation cache
            }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select identity type" />
            </SelectTrigger>
            <SelectContent>
              {identityNoTypes.map((identityType) => (
                <SelectItem key={identityType.id} value={identityType.id.toString()}>
                  {identityType.eng}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Identity Number */}
        {identity_no_type && (
          <div className="space-y-2 relative">
            <Label className="flex items-center">
              {identity_no_type === "1" ? "NRIC Number" : "Identity Number"}
            </Label>
            {identity_no_type === "1" ? (
              <ICBoxInput
                value={identity_no}
                onChange={(val) => updateFields({ identity_no: val })}
              />
            ) : (
              <Input
                required
                name="identity_no"
                value={identity_no}
                onChange={(e) => {
                  updateFields({ identity_no: e.target.value });
                }}
                placeholder="Enter identity number"
                maxLength={30}
              />
            )}


            {identity_no.length > 5 && (
              <div className="mt-1 flex items-center space-x-1 text-sm">
                {checking ? (
                  <span className="text-gray-500 italic">Checking...</span>
                ) : hasChecked ? (
                  identity_no_type === "1" ? (
                    identity_no.length !== 12 ? (
                      <span className="text-red-600 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        This IC number must have 12 digits
                      </span>
                    ) : !isIcNumberValid ? (
                      <span className="text-red-600 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        Invalid IC number format (invalid or future date)
                      </span>
                    ) : !isIcNumberExist ? (
                      <span className="text-red-600 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        The IC number already exists in the system
                      </span>
                    ) : (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Valid IC
                      </span>
                    )
                  ) : !isIcNumberExist ? (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      The IC number already exists in the system
                    </span>
                  ) : (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Valid IC
                    </span>
                  )
                ) : null}
              </div>
            )}




          </div>
        )}

        {/* Under 12 section */}
        {(isUnder12 && identity_no.length == 12 && identity_no_type == "1") && (
          <div className="col-span-2 border rounded-lg p-4 mt-4">
            <div className="text-m text-blue-600 mb-2 font-semibold">
              Guardian Section
            </div>

            {/* Full Name */}
            <div className="space-y-2 mb-4">
              <Label className="flex items-center">
                Guardian Full Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                required
                type="text"
                name="parent_fullname"
                value={parent_fullname}
                onChange={(e) => updateFields({ parent_fullname: e.target.value })}
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label className="flex items-center">
                Guardian Identity Card Number <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                required
                name="parent_ic_no"
                value={parent_ic_no}
                onChange={(e) => updateFields({ parent_ic_no: e.target.value })}
              />
            </div>

            {/* Parent Mobile Number */}
            <div className="space-y-2 mb-4">
              <Label className="flex items-center">
                Guardian Mobile Number <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                required
                type="text"
                name="parent_mobile_no"
                value={parent_mobile_no}
                onChange={(e) => updateFields({ parent_mobile_no: e.target.value })}
              />
            </div>

            {/* Relationship*/}
            <div className="space-y-2 mb-4">
              <Label className="flex items-center">Relationship <span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={parent_relationship_id || ""}
                onValueChange={(value) => updateFields({ parent_relationship_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {typeRelationships.map((typeRelationship) => (
                    <SelectItem key={typeRelationship.id} value={typeRelationship.id.toString()}>
                      {typeRelationship.eng}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guardian Address Fields */}
            <div className="space-y-2 mb-4">
              <Label className="flex items-center">Address Line 1 <span className="text-red-500 ml-1">*</span></Label>
              <Input
                required
                type="text"
                value={parent_address1 || ""}
                onChange={(e) => updateFields({ parent_address1: e.target.value })}
              />
            </div>
            <div className="space-y-2 mb-4">
              <Label className="flex items-center">Address Line 2</Label>
              <Input
                type="text"
                value={parent_address2 || ""}
                onChange={(e) => updateFields({ parent_address2: e.target.value })}
              />
            </div>
            <div className="space-y-2 mb-4">
              <Label className="flex items-center">State <span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={parent_state_id || ""}
                onValueChange={async (value) => {
                  updateFields({ parent_state_id: value, parent_district_id: "" });
                  if (fetchDistrictsByState) await fetchDistrictsByState(value);
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {(states || []).map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 mb-4">
              <Label className="flex items-center">District <span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={parent_district_id || ""}
                onValueChange={(value) => updateFields({ parent_district_id: value })}
                disabled={!parent_state_id}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {(districts || []).map((district) => (
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 mb-4">
              <Label className="flex items-center">City <span className="text-red-500 ml-1">*</span></Label>
              <Input
                required
                type="text"
                value={parent_city || ""}
                onChange={(e) => updateFields({ parent_city: e.target.value })}
              />
            </div>
            <div className="space-y-2 mb-4">
              <Label className="flex items-center">Postcode <span className="text-red-500 ml-1">*</span></Label>
              <Input
                required
                type="text"
                value={parent_postcode || ""}
                onChange={(e) => updateFields({ parent_postcode: e.target.value })}
              />
            </div>
          </div>

        )}

      </div>
    </>
  );
}
