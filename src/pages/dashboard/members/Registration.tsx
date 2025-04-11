
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface RegistrationForm {
  email: string;
  full_name: string;
  ic_number: string;
  phone_number: string;
}

const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<RegistrationForm>();

  const onSubmit = async (data: RegistrationForm) => {
    setIsLoading(true);
    
    try {
      // Generate a random password for the new user
      const password = Math.random().toString(36).slice(-8);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password,
        options: {
          data: {
            full_name: data.full_name,
          }
        }
      });

      if (authError) throw authError;

      // Check if profile already exists (might have been created by trigger)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", authData.user?.id)
        .single();

      // Only create profile if it doesn't exist
      if (!existingProfile) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user?.id,
          ...data,
          user_type: "member", // Always set as member
        });

        if (profileError) throw profileError;
      } else {
        // Profile exists but might need updating
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            full_name: data.full_name,
            ic_number: data.ic_number,
            phone_number: data.phone_number,
          })
          .eq("id", authData.user?.id);

        if (profileUpdateError) throw profileUpdateError;
      }

      toast({
        title: "Success",
        description: "Member registered successfully",
      });

      form.reset();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Failed to register member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Member Registration</h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Register New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  {...form.register("email", { required: true })}
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  placeholder="Enter full name"
                  {...form.register("full_name", { required: true })}
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">IC Number</label>
                <Input
                  placeholder="Enter IC number"
                  {...form.register("ic_number", { required: true })}
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  placeholder="Enter phone number"
                  {...form.register("phone_number", { required: true })}
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-purple-600 hover:bg-purple-700 h-12 px-8"
              >
                {isLoading ? "Registering..." : "Register Member"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Registration;
