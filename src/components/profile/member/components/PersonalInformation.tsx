import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const PersonalInformation = ({
  memberData,
  genders,
  races,
  occupations,
  socioeconomics,
  ictKnowledge,
  educationLevels,
  incomeLevels,
  handleChange,
}: {
  memberData: any;
  genders: any[];
  races: any[];
  occupations: any[];
  socioeconomics: any[];
  ictKnowledge: any[];
  educationLevels: any[];
  incomeLevels: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  const handleSocioeconomicChange = (value: string) => {
    const selectedSocioeconomic = socioeconomics.find((socio) => socio.id === Number(value));
    if (selectedSocioeconomic) {
      handleChange({ target: { id: "socio_id", value } } as React.ChangeEvent<HTMLInputElement>);
      handleChange({ target: { id: "type_sector", value: selectedSocioeconomic.sector_id } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="id">Member ID</Label>
            <Input id="id" type="text" value={memberData.id} readOnly />
          </div>
          <div>
            <Label htmlFor="ref_id">Reference ID/ site_id</Label>
            <Input id="ref_id" type="text" value={memberData.ref_id || ""}  readOnly />
          </div>
        </div>
        <div>
          <Label htmlFor="fullname">Full Name</Label>
          <Input id="fullname" type="text" value={memberData.fullname || ""}  readOnly />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="identity_no">Identity No</Label>
            <Input id="identity_no" type="text" value={memberData.identity_no || ""}  readOnly/>
          </div>
          <div>
            <Label htmlFor="mobile_no">Mobile No</Label>
            <Input id="mobile_no" type="text" value={memberData.mobile_no || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={memberData.email || ""} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" value={memberData.dob || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "gender", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={memberData.gender || ""}
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
            <Label htmlFor="race_id">Race</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "race_id", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={memberData.race_id || ""}
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="occupation_id">Occupation</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "occupation_id", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={memberData.occupation_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select occupation" />
              </SelectTrigger>
              <SelectContent>
                {occupations.map((occupation) => (
                  <SelectItem key={occupation.id} value={occupation.id}>
                    {occupation.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="socio_id">Socioeconomics</Label>
            <Select
              onValueChange={handleSocioeconomicChange}
              value={memberData.socio_id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select socioeconomics" />
              </SelectTrigger>
              <SelectContent>
                {socioeconomics.map((socio) => (
                  <SelectItem key={socio.id} value={socio.id}>
                    {socio.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="ict_knowledge">ICT Knowledge</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "ict_knowledge", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={memberData.ict_knowledge || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ICT knowledge" />
              </SelectTrigger>
              <SelectContent>
                {ictKnowledge.map((ict) => (
                  <SelectItem key={ict.id} value={ict.id}>
                    {ict.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="education_level">Education Level</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "education_level", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={memberData.education_level || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((education) => (
                  <SelectItem key={education.id} value={education.id}>
                    {education.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="oku_status">OKU Status</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "oku_status", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={memberData.oku_status !== undefined ? String(memberData.oku_status) : ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select OKU status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="income_range">Income Range</Label>
            <Select
              onValueChange={(value) => handleChange({ target: { id: "income_range", value } } as React.ChangeEvent<HTMLInputElement>)}
              value={memberData.income_range || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                {incomeLevels.map((income) => (
                  <SelectItem key={income.id} value={income.id}>
                    {income.eng}
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