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
import { UserGroupField } from "./form-fields/UserGroupField";
import { UserPasswordField } from "./form-fields/UserPasswordField";
import { UserConfirmPasswordField } from "./form-fields/UserConfirmPasswordField";
import { UserICNumberField } from "./form-fields/UserICNumberField";
import { handleCreateUser, handleUpdateUser } from "./utils/form-handlers";
import { UserFormData } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const userFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  user_type: z.string(),
  user_group: z.string().optional(),
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      user_type: user?.user_type || "member",
      user_group: user?.user_group?.toString() || "",
      phone_number: user?.phone_number || "",
      ic_number: user?.ic_number || "",
      password: "",
      confirm_password: "",
    },
  });
  
  console.log("UserForm user:", JSON.stringify(user));

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (user) {
        await handleUpdateUser(data, user);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        await handleCreateUser(data);
        
        toast({
          title: "Success",
          description: "User created successfully. An invitation will be sent to the user's email.",
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving user:", error);
      let errorMessage = "Failed to save user";
      
      if (typeof error === 'object' && error !== null) {
        if ('message' in error) {
          errorMessage = String(error.message);
        } else if (error instanceof Response) {
          try {
            const errorData = await error.json();
            errorMessage = errorData.error || errorMessage;
          } catch (jsonError) {
            errorMessage = `${errorMessage}: ${error.status} ${error.statusText}`;
          }
        }
      }
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UserEmailField form={form} isLoading={isLoading} isEditMode={!!user} />
              <UserNameField form={form} isLoading={isLoading} />
              <UserICNumberField form={form} isLoading={isLoading} />
              <UserPhoneField form={form} isLoading={isLoading} />
              <UserTypeField form={form} isLoading={isLoading} />
              <UserGroupField form={form} isLoading={isLoading} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UserPasswordField form={form} isLoading={isLoading} isEditMode={!!user} />
              <UserConfirmPasswordField form={form} isLoading={isLoading} isEditMode={!!user} />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {user ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  user ? "Update User" : "Create User"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
