
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserType, Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { UserEmailField } from "./form-fields/UserEmailField";
import { UserNameField } from "./form-fields/UserNameField";
import { UserPhoneField } from "./form-fields/UserPhoneField";
import { UserTypeField } from "./form-fields/UserTypeField";
import { handleCreateUser, handleUpdateUser } from "./utils/form-handlers";
import { UserFormData } from "./types";
import { supabase } from "@/lib/supabase"; // Import the supabase client

interface UserFormProps {
  user?: Profile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      user_type: user?.user_type || "member",
      phone_number: user?.phone_number || "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      if (user) {
        await handleUpdateUser(data, user);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        // Store current session before creating user
        const currentSession = localStorage.getItem('session');
        
        // Create the user
        await handleCreateUser(data);
        
        // Immediately restore the current session
        if (currentSession) {
          localStorage.setItem('session', currentSession);
          
          // Force auth session refresh
          await supabase.auth.getSession();
        }
        
        toast({
          title: "Success",
          description: "User created successfully. A password reset email has been sent.",
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UserEmailField form={form} isLoading={isLoading} isEditMode={!!user} />
        <UserNameField form={form} isLoading={isLoading} />
        <UserPhoneField form={form} isLoading={isLoading} />
        <UserTypeField form={form} isLoading={isLoading} />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : user ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
