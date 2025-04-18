import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Upload,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  FileText,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { FormLabel } from "@/components/ui/form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Registration = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    state: "Kuala Lumpur",
    postalCode: "",
    membershipType: "standard",
    occupation: "",
    company: "",
    emergencyContact: "",
    emergencyPhone: "",
    icNumber: "",
    communityStatus: "resident",
    gender: "male",
    nationality: "Malaysian",
    race: "",
    ethnic: "",
    sectorType: "",
    socioeconomyType: "",
    ictKnowledge: "basic",
    educationLevel: "",
    okuStatus: false,
    incomeRange: "",
    distanceFromNadi: "",
    registrationMethod: "online",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateForm = (tab: string) => {
    const newErrors: Record<string, string> = {};
    if (tab === "personal") {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.icNumber.trim())
        newErrors.icNumber = "IC number is required";
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Please enter a valid email";
      if (!formData.phone.trim()) newErrors.phone = "Mobile number is required";
    } else if (tab === "additional") {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.postalCode.trim())
        newErrors.postalCode = "Postal code is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const personalValid = validateForm("personal");
    const additionalValid = validateForm("additional");
    if (!personalValid || !additionalValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });

      if (!personalValid) setActiveTab("personal");
      else if (!additionalValid) setActiveTab("additional");
      return;
    }

    console.log("Form submitted:", formData);
    toast({
      title: "Registration Successful",
      description: "New member has been registered successfully",
      variant: "default",
    });
  };

  const handleTabChange = (value: string) => {
    if (activeTab === "personal" && value !== "personal") {
      if (!validateForm("personal")) {
        toast({
          title: "Please complete required fields",
          description: "Fill in all required fields before proceeding",
          variant: "destructive",
        });
        return;
      }
    }
    if (
      activeTab === "additional" &&
      value !== "personal" &&
      value !== "additional"
    ) {
      if (!validateForm("additional")) {
        toast({
          title: "Please complete required fields",
          description: "Fill in all required fields before proceeding",
          variant: "destructive",
        });
        return;
      }
    }
    setActiveTab(value);
  };

  const isTabComplete = (tab: string) => {
    if (tab === "personal") {
      return (
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.icNumber &&
        formData.dob
      );
    } else if (tab === "additional") {
      return formData.address && formData.city && formData.postalCode;
    }
    return false;
  };

  const goToNextTab = () => {
    if (activeTab === "personal") {
      if (validateForm("personal")) {
        setActiveTab("additional");
      } else {
        toast({
          title: "Please complete required fields",
          description: "Fill in all required fields before proceeding",
          variant: "destructive",
        });
      }
    } else if (activeTab === "additional") {
      if (validateForm("additional")) {
        setActiveTab("demographic");
      } else {
        toast({
          title: "Please complete required fields",
          description: "Fill in all required fields before proceeding",
          variant: "destructive",
        });
      }
    } else if (activeTab === "demographic") setActiveTab("review");
  };

  const goToPreviousTab = () => {
    if (activeTab === "review") setActiveTab("demographic");
    else if (activeTab === "demographic") setActiveTab("additional");
    else if (activeTab === "additional") setActiveTab("personal");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="w-full max-w-none p-6 mx-auto">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="font-bold text-xl">Member Registration</h1>
            <p className="text-muted-foreground">
              Register new members with detailed information
            </p>
          </div>

          <div className="w-full">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>Personal Info</span>
                  {isTabComplete("personal") && (
                    <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="additional"
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                  {isTabComplete("additional") && (
                    <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="demographic"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Demographics</span>
                </TabsTrigger>
                <TabsTrigger value="review" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Review</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="w-full">
                <TabsContent value="personal" className="w-full">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Enter the basic personal information of the new member
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="flex items-center"
                          >
                            First Name{" "}
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                            className={errors.firstName ? "border-red-500" : ""}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-500">
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="flex items-center"
                          >
                            Last Name{" "}
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                            className={errors.lastName ? "border-red-500" : ""}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-500">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="icNumber" className="flex items-center">
                          IC Number <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="icNumber"
                          name="icNumber"
                          value={formData.icNumber}
                          onChange={handleChange}
                          placeholder="e.g. 950101-12-3456"
                          required
                          className={errors.icNumber ? "border-red-500" : ""}
                        />
                        {errors.icNumber && (
                          <p className="text-sm text-red-500">
                            {errors.icNumber}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dob" className="flex items-center">
                          Date of Birth{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="flex items-center">
                          <Calendar className="absolute ml-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className={`pl-10 ${
                              errors.dob ? "border-red-500" : ""
                            }`}
                            type="date"
                            required
                          />
                        </div>
                        {errors.dob && (
                          <p className="text-sm text-red-500">{errors.dob}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center">
                          Email Address{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="flex items-center">
                          <Mail className="absolute ml-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className={`pl-10 ${
                              errors.email ? "border-red-500" : ""
                            }`}
                            type="email"
                            required
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center">
                          Mobile Number{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="flex items-center">
                          <Phone className="absolute ml-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Mobile Number"
                            className={`pl-10 ${
                              errors.phone ? "border-red-500" : ""
                            }`}
                            type="tel"
                            required
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleSelectChange("gender", value)
                          }
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="communityStatus">
                          Community Status
                        </Label>
                        <Select
                          value={formData.communityStatus}
                          onValueChange={(value) =>
                            handleSelectChange("communityStatus", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select community status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="resident">Resident</SelectItem>
                            <SelectItem value="visitor">Visitor</SelectItem>
                            <SelectItem value="worker">Worker</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                      <Button type="button" onClick={goToNextTab}>
                        Next Step
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="additional" className="w-full">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Address Information</CardTitle>
                      <CardDescription>
                        Enter address and additional contact details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center">
                          Address <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="flex items-center">
                          <MapPin className="absolute ml-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street Address"
                            className={`pl-10 ${
                              errors.address ? "border-red-500" : ""
                            }`}
                            required
                          />
                        </div>
                        {errors.address && (
                          <p className="text-sm text-red-500">
                            {errors.address}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="flex items-center">
                            City <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            className={errors.city ? "border-red-500" : ""}
                            required
                          />
                          {errors.city && (
                            <p className="text-sm text-red-500">
                              {errors.city}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="postalCode"
                            className="flex items-center"
                          >
                            Postal Code{" "}
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="Postal Code"
                            className={
                              errors.postalCode ? "border-red-500" : ""
                            }
                            required
                          />
                          {errors.postalCode && (
                            <p className="text-sm text-red-500">
                              {errors.postalCode}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="distanceFromNadi">
                            Distance from NADI (km)
                          </Label>
                          <Input
                            id="distanceFromNadi"
                            name="distanceFromNadi"
                            value={formData.distanceFromNadi}
                            onChange={handleChange}
                            placeholder="Estimated distance in km"
                            type="number"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="membershipType">Membership Type</Label>
                        <Select
                          value={formData.membershipType}
                          onValueChange={(value) =>
                            handleSelectChange("membershipType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select membership type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousTab}
                      >
                        Previous
                      </Button>
                      <Button type="button" onClick={goToNextTab}>
                        Next Step
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="demographic" className="w-full">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Demographic Information</CardTitle>
                      <CardDescription>
                        Enter demographic and socio-economic details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality</Label>
                          <Select
                            value={formData.nationality}
                            onValueChange={(value) =>
                              handleSelectChange("nationality", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Malaysian">
                                Malaysian
                              </SelectItem>
                              <SelectItem value="Non-Malaysian">
                                Non-Malaysian
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="race">Race</Label>
                          <Input
                            id="race"
                            name="race"
                            value={formData.race}
                            onChange={handleChange}
                            placeholder="Race"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ethnic">Ethnic Group</Label>
                          <Input
                            id="ethnic"
                            name="ethnic"
                            value={formData.ethnic}
                            onChange={handleChange}
                            placeholder="Ethnic group"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            placeholder="Occupation"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sectorType">Sector Type</Label>
                          <Select
                            value={formData.sectorType}
                            onValueChange={(value) =>
                              handleSelectChange("sectorType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sector type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="ngo">NGO</SelectItem>
                              <SelectItem value="selfEmployed">
                                Self-employed
                              </SelectItem>
                              <SelectItem value="unemployed">
                                Unemployed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="socioeconomyType">
                            Socioeconomy Type
                          </Label>
                          <Select
                            value={formData.socioeconomyType}
                            onValueChange={(value) =>
                              handleSelectChange("socioeconomyType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select socioeconomy type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="b40">B40</SelectItem>
                              <SelectItem value="m40">M40</SelectItem>
                              <SelectItem value="t20">T20</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ictKnowledge">ICT Knowledge</Label>
                          <Select
                            value={formData.ictKnowledge}
                            onValueChange={(value) =>
                              handleSelectChange("ictKnowledge", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ICT knowledge level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="educationLevel">
                            Education Level
                          </Label>
                          <Select
                            value={formData.educationLevel}
                            onValueChange={(value) =>
                              handleSelectChange("educationLevel", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">
                                Secondary
                              </SelectItem>
                              <SelectItem value="diploma">Diploma</SelectItem>
                              <SelectItem value="bachelor">
                                Bachelor's Degree
                              </SelectItem>
                              <SelectItem value="master">
                                Master's Degree
                              </SelectItem>
                              <SelectItem value="phd">PhD</SelectItem>
                              <SelectItem value="none">
                                No Formal Education
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="incomeRange">Income Range (RM)</Label>
                          <Select
                            value={formData.incomeRange}
                            onValueChange={(value) =>
                              handleSelectChange("incomeRange", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select income range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below1000">
                                Below RM 1,000
                              </SelectItem>
                              <SelectItem value="1000-3000">
                                RM 1,000 - RM 3,000
                              </SelectItem>
                              <SelectItem value="3001-5000">
                                RM 3,001 - RM 5,000
                              </SelectItem>
                              <SelectItem value="5001-10000">
                                RM 5,001 - RM 10,000
                              </SelectItem>
                              <SelectItem value="above10000">
                                Above RM 10,000
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registrationMethod">
                            Registration Method
                          </Label>
                          <Select
                            value={formData.registrationMethod}
                            onValueChange={(value) =>
                              handleSelectChange("registrationMethod", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select registration method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="walkin">Walk-in</SelectItem>
                              <SelectItem value="outreach">
                                Outreach Program
                              </SelectItem>
                              <SelectItem value="referral">Referral</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="okuStatus"
                          checked={formData.okuStatus}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("okuStatus", checked)
                          }
                        />
                        <Label htmlFor="okuStatus">
                          OKU Status (Person with Disabilities)
                        </Label>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousTab}
                      >
                        Previous
                      </Button>
                      <Button type="button" onClick={goToNextTab}>
                        Next Step
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="review" className="w-full">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Review Information</CardTitle>
                      <CardDescription>
                        Review and submit the member registration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Full Name:
                              </span>
                              <p>
                                {formData.firstName} {formData.lastName}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                IC Number:
                              </span>
                              <p>{formData.icNumber}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Email:
                              </span>
                              <p>{formData.email}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Mobile Number:
                              </span>
                              <p>{formData.phone}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Date of Birth:
                              </span>
                              <p>{formData.dob || "Not provided"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Gender:
                              </span>
                              <p className="capitalize">{formData.gender}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Community Status:
                              </span>
                              <p className="capitalize">
                                {formData.communityStatus}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Address Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="col-span-2">
                              <span className="text-muted-foreground">
                                Address:
                              </span>
                              <p>{formData.address}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                City:
                              </span>
                              <p>{formData.city}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                State:
                              </span>
                              <p>{formData.state}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Postal Code:
                              </span>
                              <p>{formData.postalCode}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Distance from NADI:
                              </span>
                              <p>
                                {formData.distanceFromNadi
                                  ? `${formData.distanceFromNadi} km`
                                  : "Not provided"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Demographic Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Nationality:
                              </span>
                              <p>{formData.nationality}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Race:
                              </span>
                              <p>{formData.race || "Not provided"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Ethnic Group:
                              </span>
                              <p>{formData.ethnic || "Not provided"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Occupation:
                              </span>
                              <p>{formData.occupation || "Not provided"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Sector Type:
                              </span>
                              <p className="capitalize">
                                {formData.sectorType || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Socioeconomy Type:
                              </span>
                              <p className="uppercase">
                                {formData.socioeconomyType || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                ICT Knowledge:
                              </span>
                              <p className="capitalize">
                                {formData.ictKnowledge}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Education Level:
                              </span>
                              <p className="capitalize">
                                {formData.educationLevel || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                OKU Status:
                              </span>
                              <p>{formData.okuStatus ? "Yes" : "No"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Income Range:
                              </span>
                              <p>
                                {formData.incomeRange
                                  ? formData.incomeRange
                                      .replace("below1000", "Below RM 1,000")
                                      .replace(
                                        "1000-3000",
                                        "RM 1,000 - RM 3,000"
                                      )
                                      .replace(
                                        "3001-5000",
                                        "RM 3,001 - RM 5,000"
                                      )
                                      .replace(
                                        "5001-10000",
                                        "RM 5,001 - RM 10,000"
                                      )
                                      .replace("above10000", "Above RM 10,000")
                                  : "Not provided"}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Registration Method:
                              </span>
                              <p className="capitalize">
                                {formData.registrationMethod}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Membership Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Membership Type:
                              </span>
                              <p className="capitalize">
                                {formData.membershipType}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousTab}
                      >
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Register Member
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </form>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Registration;
