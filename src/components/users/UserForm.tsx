
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserType, Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { UserEmailField } from "./form-fields/UserEmailField";
import { UserNameField } from "./form-fields/UserNameField";
import { UserPhoneField } from "./form-fields/UserPhoneField";
import { UserTypeField } from "./form-fields/UserTypeField";
import { UserPasswordField } from "./form-fields/UserPasswordField";
import { UserConfirmPasswordField } from "./form-fields/UserConfirmPasswordField";
import { UserICNumberField } from "./form-fields/UserICNumberField";
import { handleCreateUser, handleUpdateUser } from "./utils/form-handlers";
import { UserFormData } from "./types";

// Define validation schema
const userFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  user_type: z.string(),
  phone_number: z.string()
    .regex(/^(\+?6?01)[0-9]{8,9}$/, { 
      message: "Please enter a valid Malaysian phone number (e.g., +60123456789 or 01123456789)" 
    })
    .optional()
    .or(z.literal('')),
  ic_number: z.string()
    .regex(/^\d{6}-\d{2}-\d{4}$/, { 
      message: "Please enter a valid IC number in the format xxxxxx-xx-xxxx" 
    }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional(),
  confirm_password: z.string().optional(),
}).refine(data => {
  if (data.password && !data.confirm_password) {
    return false;
  }
  if (!data.password && data.confirm_password) {
    return false;
  }
  return true;
}, {
  message: "Both password and confirm password must be provided",
  path: ["confirm_password"],
}).refine(data => {
  if (data.password && data.confirm_password && data.password !== data.confirm_password) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

interface UserFormProps {
  user?: Profile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      user_type: user?.user_type || "member",
      phone_number: user?.phone_number || "",
      ic_number: user?.ic_number || "",
      password: "",
      confirm_password: "",
    },
  });
  
  console.log("UserForm user:", JSON.stringify(user));

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
        // Create the user with our non-authentication method
        await handleCreateUser(data);
        
        toast({
          title: "Success",
          description: "User created successfully. An invitation will be sent to the user's email.",
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Failed to save user",
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
        <UserICNumberField form={form} isLoading={isLoading} />
        <UserPhoneField form={form} isLoading={isLoading} />
        <UserTypeField form={form} isLoading={isLoading} />
        
        {/* Only show password fields if creating a new user or explicitly updating password */}
        <UserPasswordField form={form} isLoading={isLoading} isEditMode={!!user} />
        <UserConfirmPasswordField form={form} isLoading={isLoading} isEditMode={!!user} />

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
