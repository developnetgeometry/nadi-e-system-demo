import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const PersonalInformation = ({
  profileData,
  positions,
  handleChange,
  userType,
  maritalStatuses,
  races,
  religions,
  nationalities,
}: {
  profileData: any;
  positions: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  userType: string | null;
  maritalStatuses?: any[];
  races?: any[];
  religions?: any[];
  nationalities?: any[];
}) => {
  const positionName = profileData?.position_id
    ? positions.find((position) => position.id === profileData.position_id)?.name || ""
    : "";

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="id">
              {userType?.startsWith("mcmc")
                ? "MCMC ID"
                : userType?.startsWith("sso")
                ? "SSO ID"
                : userType?.startsWith("tp")
                ? "Tech Partner ID"
                : userType?.startsWith("vendor")
                ? "Vendor ID"
                : "DUSP ID"}
            </Label>
            <Input id="id" type="text" value={profileData?.id || ""} readOnly />
          </div>
          <div>
            <Label htmlFor="is_active">Status</Label>
            <Input id="is_active" type="text" value={profileData?.is_active ? "Active" : "Inactive"} readOnly />
          </div>
        </div>
        <div>
          <Label htmlFor="fullname">Full Name</Label>
          <Input id="fullname" type="text" value={profileData?.fullname || ""} readOnly />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="ic_no">IC No</Label>
            <Input id="ic_no" type="text" value={profileData?.ic_no || ""} readOnly />
          </div>
          <div>
            <Label htmlFor="mobile_no">Mobile No</Label>
            <Input id="mobile_no" type="text" value={profileData?.mobile_no || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="position_id">Position</Label>
            <Input id="position_id" type="text" value={positionName} readOnly />
          </div>
          <div>
            <Label htmlFor="work_email">Work Email</Label>
            <Input id="work_email" type="text" value={profileData?.work_email || ""} readOnly />
          </div>
        </div>
        {userType?.startsWith("dusp") || userType?.startsWith("sso") ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="join_date">Join Date</Label>
              <Input id="join_date" type="text" value={formatDate(profileData?.join_date)} readOnly />
            </div>
            <div>
              <Label htmlFor="resign_date">Resign Date</Label>
              <Input id="resign_date" type="text" value={formatDate(profileData?.resign_date)} readOnly />
            </div>
          </div>
        ) : null}
        {userType?.startsWith("tp") ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="personal_email">Personal Email</Label>
                <Input id="personal_email" type="email" value={profileData?.personal_email || ""} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={formatDate(profileData?.dob)} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="place_of_birth">Place of Birth</Label>
                <Input id="place_of_birth" type="text" value={profileData?.place_of_birth || ""} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="marital_status">Marital Status</Label>
                <Select
                  onValueChange={(value) => handleChange({ target: { id: "marital_status", value } } as React.ChangeEvent<HTMLInputElement>)}
                  value={profileData?.marital_status || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalStatuses?.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="race_id">Race</Label>
                <Select
                  onValueChange={(value) => handleChange({ target: { id: "race_id", value } } as React.ChangeEvent<HTMLInputElement>)}
                  value={profileData?.race_id || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    {races?.map((race) => (
                      <SelectItem key={race.id} value={race.id}>
                        {race.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="religion_id">Religion</Label>
                <Select
                  onValueChange={(value) => handleChange({ target: { id: "religion_id", value } } as React.ChangeEvent<HTMLInputElement>)}
                  value={profileData?.religion_id || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {religions?.map((religion) => (
                      <SelectItem key={religion.id} value={religion.id}>
                        {religion.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nationality_id">Nationality</Label>
                <Select
                  onValueChange={(value) => handleChange({ target: { id: "nationality_id", value } } as React.ChangeEvent<HTMLInputElement>)}
                  value={profileData?.nationality_id || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {nationalities?.map((nationality) => (
                      <SelectItem key={nationality.id} value={nationality.id}>
                        {nationality.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PersonalInformation;