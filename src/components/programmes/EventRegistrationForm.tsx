import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  onRegistrationSuccess?: () => void;
}

interface FormData {
  icNumber: string;
  name: string;
  phoneNumber: string;
  gender: number | null;
}

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  eventId,
  eventTitle,
  onRegistrationSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    icNumber: "",
    name: "",
    phoneNumber: "",
    gender: null,
  });
  const [loading, setLoading] = useState(false);
  const [icChecking, setIcChecking] = useState(false);
  const [memberExists, setMemberExists] = useState<boolean | null>(null);
  const [memberData, setMemberData] = useState<any>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "gender" ? (value ? parseInt(value) : null) : value,
    }));
  };

  const checkIcNumber = async (icNumber: string) => {
    if (!icNumber || icNumber.length < 12) {
      setMemberExists(null);
      setMemberData(null);
      return;
    }

    setIcChecking(true);

    try {
      const  { data: memberProfile, error: memberError } = await supabase
        .from("nd_member_profile")
        .select("id, fullname, mobile_no, gender")
        .eq("identity_no", icNumber)
        .single();

      if (memberError && memberError.code !== "PGRST116") {
        throw memberError;
      }

      if (memberProfile) {
        setMemberExists(true);
        setMemberData(memberProfile);

        // Auto-fill the form with existing member data
        setFormData(prev => ({
          ...prev,
          name: memberProfile.fullname || "",
          phoneNumber: memberProfile.mobile_no || "",
          gender: memberProfile.gender || null,
        }));
      } else {
        setMemberExists(false);
        setMemberData(null);

        // Clear the form fields
        setFormData(prev => ({
          ...prev,
          name: "",
          phoneNumber: "",
        }));
      }

    } catch (error) {
      console.error("Error checking IC:", error);
      setMemberExists(null);
      setMemberData(null);
    } finally {
      setIcChecking(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.icNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // For new members, validate all fields
    if (!memberExists && (!formData.name || !formData.phoneNumber || !formData.gender)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let memberId;

      if (memberExists && memberData) {
        // Use existing member
        memberId = memberData.id;
      } else  {
        // Get user's site profile ID from localStorage
        let userSiteProfileId = null;

        try {
          const storedUserMetadata = localStorage.getItem('user_metadata');
          if (storedUserMetadata) {
            const userData = JSON.parse(storedUserMetadata);
            userSiteProfileId = userData.group_profile?.site_profile_id || null;
          }
        } catch (error) {
          console.error("Error retrieving user data from localStorage:", error);
        }

        // Create new member
        const memberInsertData = {
          identity_no: formData.icNumber,
          fullname: formData.name,
          mobile_no: formData.phoneNumber,
          ref_id: userSiteProfileId,
          ...(formData.gender && { gender: formData.gender }),
        };
        
        const { data: newMember, error: createMemberError } = await supabase
          .from("nd_member_profile")
          .insert(memberInsertData)
          .select("id")
          .single();

          if (createMemberError) {
            throw createMemberError;
          }

          memberId = newMember.id;
      }

      // First, find the member profile that matches the provided details
      // const { data: memberProfile, error: memberError } = await supabase
      //   .from("nd_member_profile")
      //   .select("id")
      //   .eq("identity_no", formData.icNumber)
      //   .eq("fullname", formData.name)
      //   .eq("mobile_no", formData.phoneNumber)
      //   .single();

      // if (memberError || !memberProfile) {
      //   toast({
      //     title: "Member Not Found",
      //     description:
      //       "No matching member found with the provided details. Please check your IC number, name, and phone number.",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // Check if already registered for this event
      const { data: existingRegistration, error: checkError } = await supabase
        .from("nd_event_participant")
        .select("id")
        .eq("event_id", eventId)
        .eq("member_id", memberId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingRegistration) {
        toast({
          title: "Already Registered",
          description: "You are already registered for this event.",
          variant: "destructive",
        });
        return;
      }

      // Register the member for the event
      const { error: registrationError } = await supabase
        .from("nd_event_participant")
        .insert({
          event_id: eventId,
          member_id: memberId,
          acceptance: true,
          attendance: false,
        });

      if (registrationError) {
        throw registrationError;
      }

      toast({
        title: "Registration Successful",
        description: `You have been successfully registered for ${eventTitle}`,
        variant: "default",
      });

      // Reset form
      setFormData({
        icNumber: "",
        name: "",
        phoneNumber: "",
        gender: null,
      });
      setMemberExists(null);
      setMemberData(null);

      onRegistrationSuccess?.();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Event Registration</CardTitle>
        <p className="text-sm text-muted-foreground">{eventTitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="icNumber">IC Number *</Label>
            <Input
              id="icNumber"
              type="text"
              value={formData.icNumber}
              onChange={(e) => {
                handleInputChange("icNumber", e.target.value);
                checkIcNumber(e.target.value);
              }}
              placeholder="Enter your IC number"
              required
            />
            {icChecking && (
              <p className="text-sm text-muted-foreground flex items-center">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Checking IC number...
              </p>
            )}
            {memberExists === true && (
              <p className="text-sm text-green-600">
                ✓ Member found! You can register directly.
              </p>
            )}
            {memberExists === false && (
              <p className="text-sm text-blue-600">
                ℹ New member - please fill in your details below.
              </p>
            )}
          </div>

          {memberExists === false && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={formData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="1">
                    Male
                  </option>
                  <option value="2">
                    Female
                  </option>
                </select>
              </div>  
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading || icChecking || memberExists === null}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register for Event"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
