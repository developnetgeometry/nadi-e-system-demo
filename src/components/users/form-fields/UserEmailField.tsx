import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UserFormData } from "../types";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface UserEmailFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
  isEditMode: boolean;
  required?: boolean;
  emailCheckLoading?: boolean;
  emailExists?: boolean;
}

export function UserEmailField({
  form,
  isLoading,
  isEditMode,
  required,
  emailCheckLoading = false,
  emailExists = false,
}: UserEmailFieldProps) {
  const watchedEmail = form.watch("email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(watchedEmail || "");

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{required ? "Email *" : "Email"}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type="email"
                disabled={isEditMode || isLoading}
                placeholder="user@example.com"
              />
              {!isEditMode && isValidEmail && watchedEmail && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {emailCheckLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  ) : emailExists ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
