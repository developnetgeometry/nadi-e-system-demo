
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface State {
  id: number;
  name: string;
  code?: string;
  abbr?: string;
  region_id?: number;
}

interface Holiday {
  id: number;
  desc: string;
  date: string;
  year: number;
  status: number;
  states?: { id: number; name: string }[];
}

const holidayFormSchema = z.object({
  desc: z.string().min(1, "Holiday name is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  states: z.array(z.number()).optional(),
  status: z.number().default(1)
});

interface HolidayFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHoliday: Holiday | null;
  states: State[];
  onSubmit: (values: z.infer<typeof holidayFormSchema>) => Promise<void>;
}

export function HolidayFormDialog({
  open,
  onOpenChange,
  selectedHoliday,
  states,
  onSubmit
}: HolidayFormDialogProps) {
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof holidayFormSchema>>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      desc: "",
      states: [],
      status: 1
    },
  });

  // Reset form when dialog opens with selectedHoliday data
  useEffect(() => {
    if (open) {
      if (selectedHoliday) {
        const stateIds = selectedHoliday.states?.map(state => state.id) || [];
        
        form.reset({
          desc: selectedHoliday.desc,
          date: new Date(selectedHoliday.date),
          states: stateIds,
          status: selectedHoliday.status
        });
      } else {
        form.reset({
          desc: "",
          date: new Date(),
          states: [],
          status: 1
        });
      }
    }
  }, [open, selectedHoliday, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectedHoliday ? 'Edit Holiday' : 'Add New Holiday'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedHoliday ? 'Update' : 'Create'} Holiday
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
