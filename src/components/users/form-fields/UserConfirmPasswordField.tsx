
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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserConfirmPasswordFieldProps {
  form: UseFormReturn<UserFormData>;
  isLoading: boolean;
  isEditMode: boolean;
  required?: boolean;
}

export function UserConfirmPasswordField({ form, isLoading, isEditMode, required = false }: UserConfirmPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name="confirm_password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{required ? "Confirm Password *" : "Confirm Password"}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                placeholder="Confirm password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
