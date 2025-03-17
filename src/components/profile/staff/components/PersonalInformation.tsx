import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const PersonalInformation = ({
  staffData,
  genders,
  maritalStatuses,
  races,
  religions,
  nationalities,
  handleChange,
}: {
  staffData: any;
  genders: any[];
  maritalStatuses: any[];
  races: any[];
  religions: any[];
  nationalities: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="id">Staff ID</Label>
            <Input id="id" type="text" value={staffData.id} readOnly />
          </div>
          <div>
            <Label htmlFor="is_active">Staff Status</Label>
            <Input id="is_active" type="text" value={staffData.is_active ? "Active" : "Inactive"} readOnly />
          </div>
        </div>
        <div>
          <Label htmlFor="fullname">Full Name</Label>
          <Input id="fullname" type="text" value={staffData.fullname || ""}  readOnly />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="ic_no">IC No</Label>
            <Input id="ic_no" type="text" value={staffData.ic_no || ""}  readOnly />
          </div>
          <div>
            <Label htmlFor="mobile_no">Mobile No</Label>
            <Input id="mobile_no" type="text" value={staffData.mobile_no || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="work_email">Work Email</Label>
            <Input id="work_email" type="email" value={staffData.work_email || ""}  readOnly/>
          </div>
          <div>
            <Label htmlFor="personal_email">Personal Email</Label>
            <Input id="personal_email" type="email" value={staffData.personal_email || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" value={staffData.dob || ""} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="place_of_birth">Place of Birth</Label>
            <Input id="place_of_birth" type="text" value={staffData.place_of_birth || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="gender_id">Gender</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "gender_id", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={staffData.gender_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((gender) => (
                  <SelectItem key={gender.id} value={gender.id}>
                    {gender.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="marital_status">Marital Status</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "marital_status", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={staffData.marital_status || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                {maritalStatuses.map((status) => (
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
              value={staffData.race_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select race" />
              </SelectTrigger>
              <SelectContent>
                {races.map((race) => (
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
              value={staffData.religion_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                {religions.map((religion) => (
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
              value={staffData.nationality_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent>
                {nationalities.map((nationality) => (
                  <SelectItem key={nationality.id} value={nationality.id}>
                    {nationality.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;