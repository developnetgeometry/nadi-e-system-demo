
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { HolidayFormValues } from "./HolidayFormSchema";
import { type State } from "@/utils/holidayUtils";

interface HolidayStatesFieldProps {
  form: UseFormReturn<HolidayFormValues>;
  states: State[];
}

export function HolidayStatesField({ form, states }: HolidayStatesFieldProps) {
  return (
    <FormField
      control={form.control}
      name="states"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>Apply to States</FormLabel>
            <p className="text-sm text-muted-foreground">
              Select the states this holiday applies to. If none selected, it applies to all states.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded p-2">
            {states.map((state) => (
              <FormField
                key={state.id}
                control={form.control}
                name="states"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={state.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(state.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, state.id]);
                            } else {
                              field.onChange(
                                currentValue.filter((id) => id !== state.id)
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {state.name}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
