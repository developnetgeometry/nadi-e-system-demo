import React, { useState, useEffect } from "react";
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
import { Link, useNavigate, useLocation } from "react-router-dom";
import VendorStaffForm from "@/components/vendor/VendorStaffForm";
import VendorAdminForm from "@/components/vendor/VendorAdminForm";

interface VendorStaffFormData {
  fullname: string;
  ic_no: string;
  mobile_no: string;
  work_email: string;
  password: string;
  vendor_profile_id: string;
}

interface VendorCompany {
  id: number;
  business_name: string;
  registration_number: string;
}

const VendorStaffRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [vendorCompanies, setVendorCompanies] = useState<VendorCompany[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userType = params.get("user_type") || "vendor_admin";

  const form = useForm<VendorStaffFormData>({
    defaultValues: {
      fullname: "",
      ic_no: "",
      mobile_no: "",
      work_email: "",
      password: "",
      vendor_profile_id: "",
    },
  });

  useEffect(() => {
    fetchVendorCompanies();
  }, []);

  const fetchVendorCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("nd_vendor_profile")
        .select("id, business_name, registration_number")
        .order("business_name");

      if (error) throw error;
      setVendorCompanies(data || []);
    } catch (error) {
      console.error("Error fetching vendor companies:", error);
      toast({
        title: "Error",
        description: "Failed to load vendor companies",
        variant: "destructive",
      });
    } finally {
      setLoadingCompanies(false);
    }
  };

  const onSubmit = async (data: VendorStaffFormData) => {
    setLoading(true);
    try {
      console.log("Submitting vendor admin registration:", data);

      // Validate required fields
      if (
        !data.fullname ||
        !data.ic_no ||
        !data.work_email ||
        !data.password ||
        !data.vendor_profile_id
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error("You must be logged in to register staff");
      }

      // Get the selected vendor company details
      const selectedVendor = vendorCompanies.find(
        (v) => v.id.toString() === data.vendor_profile_id
      );
      if (!selectedVendor) {
        throw new Error("Selected vendor company not found");
      }

      // Check if vendor admin already exists for this company
      const { data: existingAdmin, error: adminCheckError } = await supabase
        .from("nd_vendor_staff")
        .select("id")
        .eq("registration_number", selectedVendor.id)
        .eq("position_id", 1) // Admin position
        .maybeSingle();

      if (adminCheckError) {
        console.error("Admin check error:", adminCheckError);
        throw new Error(
          `Failed to check existing admin: ${adminCheckError.message}`
        );
      }

      if (existingAdmin) {
        throw new Error(
          "A vendor admin already exists for this company. Only one admin per company is allowed."
        );
      }

      // Create user account using the edge function
      const { data: authData, error: authError } =
        await supabase.functions.invoke("create-user", {
          body: {
            email: data.work_email,
            fullName: data.fullname,
            userType: "vendor_admin", // Fixed to vendor_admin only
            userGroup: 5, // vendor group
            phoneNumber: data.mobile_no,
            icNumber: data.ic_no,
            password: data.password,
          },
        });

      if (authError) {
        console.error("Auth error:", authError);
        throw new Error(`Failed to create user account: ${authError.message}`);
      }

      if (!authData?.id) {
        throw new Error("Failed to create user account - no user ID returned");
      }

      console.log("User created with ID:", authData.id);

      // Insert vendor staff record with the vendor profile ID
      const staffData = {
        user_id: authData.id,
        fullname: data.fullname,
        ic_no: data.ic_no,
        mobile_no: data.mobile_no,
        work_email: data.work_email,
        position_id: 1, // Fixed to Admin position
        registration_number: selectedVendor.id, // Use the vendor profile ID
        is_active: true,
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Inserting vendor staff:", staffData);

      const { error: staffError } = await supabase
        .from("nd_vendor_staff")
        .insert(staffData);

      if (staffError) {
        console.error("Staff creation error:", staffError);
        throw new Error(`Failed to create staff record: ${staffError.message}`);
      }

      toast({
        title: "Success",
        description: "Vendor admin registered successfully",
      });

      navigate("/vendor/staff");
    } catch (error: any) {
      console.error("Error registering vendor admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to register vendor admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageContainer>
        {userType === "vendor_admin" ? (
          <VendorStaffForm />
        ) : (
          <VendorAdminForm />
        )}
      </PageContainer>
    </div>
  );
};

export default VendorStaffRegistration;
