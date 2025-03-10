
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { HolidayFormValues } from "./HolidayFormSchema";
import { type State } from "@/utils/holidayUtils";
import { SelectStatesList } from "@/components/shared/SelectStatesList";

interface HolidayStatesFieldProps {
  form: UseFormReturn<HolidayFormValues>;
  states: State[];
}

export function HolidayStatesField({ form, states }: HolidayStatesFieldProps) {
  return (
    <FormField
      control={form.control}
      name="states"
      render={({ field }) => (
        <FormItem>
          <div className="mb-2">
            <FormLabel>Apply to States</FormLabel>
            <p className="text-sm text-muted-foreground">
              Select the states this holiday applies to. If none selected, it applies to all states.
            </p>
          </div>
          <FormControl>
            <SelectStatesList
              states={states}
              selectedStates={field.value || []}
              onChange={field.onChange}
              maxHeight="200px"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
