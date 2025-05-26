import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Save } from "lucide-react";

interface VendorSetupFormData {
  business_name: string;
  registration_number: string;
  business_type: string;
  phone_number: string;
  service_detail: string;
  bank_account_number: string;
}

interface VendorCompanySetupProps {
  onComplete: () => void;
}

const VendorCompanySetup: React.FC<VendorCompanySetupProps> = ({
  onComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<VendorSetupFormData>({
    defaultValues: {
      business_name: "",
      registration_number: "",
      business_type: "",
      phone_number: "",
      service_detail: "",
      bank_account_number: "",
    },
  });

  const onSubmit = async (data: VendorSetupFormData) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // Insert vendor profile
      const { error: profileError } = await supabase
        .from("nd_vendor_profile")
        .insert({
          business_name: data.business_name,
          registration_number: data.registration_number,
          business_type: data.business_type,
          phone_number: data.phone_number,
          service_detail: data.service_detail,
          bank_account_number: parseInt(data.bank_account_number),
        });

      if (profileError) throw profileError;

      // Update vendor staff record with registration number
      const { error: staffError } = await supabase
        .from("nd_vendor_staff")
        .update({
          registration_number: parseInt(data.registration_number),
        })
        .eq("user_id", user.id);

      if (staffError) throw staffError;

      toast({
        title: "Success",
        description: "Vendor company profile completed successfully",
      });

      onComplete();
    } catch (error) {
      console.error("Error completing vendor setup:", error);
      toast({
        title: "Error",
        description: "Failed to complete vendor company setup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              Complete Your Company Profile
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Welcome! Please complete your vendor company information to
              continue.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter business name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registration_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter registration number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="business_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Technology Services"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter phone number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="service_detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Details</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the services provided by your company"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bank_account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter bank account number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Complete Setup"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorCompanySetup;
