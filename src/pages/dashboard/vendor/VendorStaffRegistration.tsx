import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import usevendorID from "@/hooks/use-vendor-id";

interface VendorStaffFormData {
  fullname: string;
  ic_no: string;
  mobile_no: string;
  work_email: string;
  position_id: number;
  user_type: "vendor_admin" | "vendor_staff";
  password: string;
}

const VendorStaffRegistration = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { vendorID } = usevendorID();

  const form = useForm<VendorStaffFormData>({
    defaultValues: {
      fullname: "",
      ic_no: "",
      mobile_no: "",
      work_email: "",
      position_id: 0,
      user_type: "vendor_staff",
      password: "",
    },
  });

  const onSubmit = async (data: VendorStaffFormData) => {
    setLoading(true);
    try {
      // Get vendor registration number from current vendor admin
      const { data: vendorData } = await supabase
        .from("nd_vendor_staff")
        .select("registration_number")
        .eq("id", vendorID)
        .single();

      if (!vendorData?.registration_number) {
        throw new Error("Vendor registration number not found");
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.work_email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullname,
            user_type: data.user_type,
            user_group: 5, // vendor group
          },
        },
      });

      if (authError) throw authError;

      // Insert vendor staff record
      const { error: staffError } = await supabase
        .from("nd_vendor_staff")
        .insert({
          user_id: authData.user?.id,
          fullname: data.fullname,
          ic_no: data.ic_no,
          mobile_no: data.mobile_no,
          work_email: data.work_email,
          position_id: data.position_id,
          registration_number: vendorData.registration_number,
          is_active: true,
        });

      if (staffError) throw staffError;

      toast({
        title: "Success",
        description: "Vendor staff registered successfully",
      });

      navigate("/vendor/staff");
    } catch (error) {
      console.error("Error registering vendor staff:", error);
      toast({
        title: "Error",
        description: "Failed to register vendor staff",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageContainer>
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/vendor/staff">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Staff
            </Link>
          </Button>
        </div>

        <PageHeader
          title="Register Vendor Staff"
          description="Register a new vendor staff member"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <Card>
              <CardHeader>
                <CardTitle>Staff Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ic_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IC Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter IC number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mobile_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter mobile number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="work_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter work email"
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
                    name="user_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vendor_admin">
                              Vendor Admin
                            </SelectItem>
                            <SelectItem value="vendor_staff">
                              Vendor Staff
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Manager</SelectItem>
                            <SelectItem value="2">Executive</SelectItem>
                            <SelectItem value="3">Officer</SelectItem>
                            <SelectItem value="4">Assistant</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" asChild>
                <Link to="/vendor/staff">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Registering..." : "Register Staff"}
              </Button>
            </div>
          </form>
        </Form>
      </PageContainer>
    </div>
  );
};

export default VendorStaffRegistration;
