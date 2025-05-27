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
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.icNumber || !formData.name || !formData.phoneNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First, find the member profile that matches the provided details
      const { data: memberProfile, error: memberError } = await supabase
        .from("nd_member_profile")
        .select("id")
        .eq("identity_no", formData.icNumber)
        .eq("fullname", formData.name)
        .eq("mobile_no", formData.phoneNumber)
        .single();

      if (memberError || !memberProfile) {
        toast({
          title: "Member Not Found",
          description:
            "No matching member found with the provided details. Please check your IC number, name, and phone number.",
          variant: "destructive",
        });
        return;
      }

      // Check if already registered for this event
      const { data: existingRegistration, error: checkError } = await supabase
        .from("nd_event_participant")
        .select("id")
        .eq("event_id", eventId)
        .eq("member_id", memberProfile.id)
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
          member_id: memberProfile.id,
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
      });

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
              onChange={(e) => handleInputChange("icNumber", e.target.value)}
              placeholder="Enter your IC number"
              required
            />
          </div>

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

          <Button type="submit" className="w-full" disabled={loading}>
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
