
import * as z from "zod";

export const holidayFormSchema = z.object({
  desc: z.string().min(1, "Holiday name is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  states: z.array(z.number()).default([]),
  status: z.number().default(1)
});

export type HolidayFormValues = z.infer<typeof holidayFormSchema>;
