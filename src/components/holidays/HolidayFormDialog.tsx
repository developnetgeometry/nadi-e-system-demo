
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type Holiday, type State, formatHolidayForForm } from "@/utils/holidayUtils";
import { holidayFormSchema, type HolidayFormValues } from "./forms/HolidayFormSchema";
import { HolidayNameField } from "./forms/HolidayNameField";
import { HolidayDateField } from "./forms/HolidayDateField";
import { HolidayStatesField } from "./forms/HolidayStatesField";
import { HolidayFormActions } from "./forms/HolidayFormActions";

interface HolidayFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHoliday: Holiday | null;
  states: State[];
  onSubmit: (values: HolidayFormValues) => Promise<void>;
}

export function HolidayFormDialog({
  open,
  onOpenChange,
  selectedHoliday,
  states,
  onSubmit
}: HolidayFormDialogProps) {
  const form = useForm<HolidayFormValues>({
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
        form.reset(formatHolidayForForm(selectedHoliday));
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

  const handleCancel = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectedHoliday ? 'Edit Holiday' : 'Add New Holiday'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <HolidayNameField form={form} />
            <HolidayDateField form={form} />
            <HolidayStatesField form={form} states={states} />
            <HolidayFormActions selectedHoliday={selectedHoliday} onCancel={handleCancel} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
