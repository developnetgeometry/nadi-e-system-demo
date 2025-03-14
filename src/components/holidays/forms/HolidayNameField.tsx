
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { HolidayFormValues } from "./HolidayFormSchema";

interface HolidayNameFieldProps {
  form: UseFormReturn<HolidayFormValues>;
}

export function HolidayNameField({ form }: HolidayNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="desc"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Holiday Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter holiday name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
