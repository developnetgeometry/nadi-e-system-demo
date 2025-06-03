import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInCalendarDays, isWeekend } from "date-fns";
import { Calendar as CalendarIcon, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLeaveType } from "@/hooks/lookup/use-leave-type";
import { useLeaveBalance } from "@/hooks/hr/use-leave-balance";
import { useLeaveApplications } from "@/hooks/hr/use-leave-applications";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface LeaveApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const leaveSchema = z.object({
  leaveType: z.string({
    required_error: "Please select a leave type",
  }),
  dateRange: z.object({
    from: z.date({
      required_error: "Please select a start date",
    }),
    to: z.date({
      required_error: "Please select an end date",
    }),
  }),
  period: z.enum(["full_day", "half_day_am", "half_day_pm"], {
    required_error: "Please select a period",
  }),
  reason: z.string().min(5, {
    message: "Reason must be at least 5 characters",
  }),
  attachment: z
    .instanceof(FileList)
    .optional()
    .transform((file) => {
      return file && file.length > 0 ? file : undefined;
    }),
});

export function LeaveApplicationDialog({
  open,
  onOpenChange,
}: LeaveApplicationDialogProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { leaveTypes, isLoading: isLoadingLeaveTypes } = useLeaveType();
  const { leaveBalances } = useLeaveBalance();
  const { applyLeave, isApplying } = useLeaveApplications();

  const form = useForm<z.infer<typeof leaveSchema>>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      period: "full_day",
    },
  });

  const selectedLeaveType = form.watch("leaveType");
  const dateRange = form.watch("dateRange");
  const period = form.watch("period");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedFile(null);
    }
  }, [open, form]);

  // Calculate number of working days
  const [workingDays, setWorkingDays] = useState(0);
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      let days = 0;
      const currentDate = new Date(dateRange.from);

      while (currentDate <= dateRange.to) {
        if (!isWeekend(currentDate)) {
          days++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (period !== "full_day") {
        days -= 0.5;
      }

      setWorkingDays(Math.max(days, 0));
    } else {
      setWorkingDays(0);
    }
  }, [dateRange, period]);

  // Get leave balance for selected type
  const selectedBalance = leaveBalances.find(
    (balance) => String(balance.leave_type_id) === selectedLeaveType
  );
  const availableBalance = selectedBalance
    ? selectedBalance.balance - selectedBalance.used
    : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      form.setValue("attachment", files as unknown as FileList);
    }
  };

  const isAttachmentRequired = selectedLeaveType && selectedLeaveType !== "1"; // Assuming 1 is Annual Leave

  const onSubmit = async (data: z.infer<typeof leaveSchema>) => {
    try {
      if (workingDays > availableBalance) {
        toast({
          title: "Insufficient Balance",
          description: `You only have ${availableBalance} days available for this leave type.`,
          variant: "destructive",
        });
        return;
      }

      await applyLeave({
        leave_type_id: parseInt(data.leaveType),
        start_date: format(data.dateRange.from, "yyyy-MM-dd"),
        end_date: format(data.dateRange.to, "yyyy-MM-dd"),
        days_requested: workingDays,
        reason: data.reason,
        // Note: File upload functionality would need to be implemented separately
      });

      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
          <DialogDescription>
            Submit your leave application for approval.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingLeaveTypes ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        leaveTypes?.map((type) => (
                          <SelectItem
                            key={String(type.id)}
                            value={String(type.id)}
                          >
                            {type.name || "Unknown"}
                          </SelectItem>
                        )) || []
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Range*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value?.from && "text-muted-foreground"
                          )}
                        >
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "PP")} -{" "}
                                {format(field.value.to, "PP")}
                              </>
                            ) : (
                              format(field.value.from, "PP")
                            )
                          ) : (
                            <span>Select date range</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: field.value?.from,
                          to: field.value?.to,
                        }}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {selectedBalance && (
                    <FormDescription>
                      Available balance:{" "}
                      <span className="font-medium">{availableBalance}</span>{" "}
                      days
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {dateRange?.from && dateRange?.to && (
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Leave Period*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="full_day" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Full Day
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="half_day_am" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Half Day (AM)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="half_day_pm" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Half Day (PM)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Working days:{" "}
                      <span className="font-medium">{workingDays}</span>{" "}
                      {workingDays === 1 ? "day" : "days"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a reason for your leave..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachment"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>
                    Upload Attachment
                    {isAttachmentRequired && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileChange}
                        {...fieldProps}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                        className="shrink-0"
                      >
                        <FileUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    {isAttachmentRequired
                      ? "Required for this leave type. Accepted formats: PDF, JPG, PNG, DOC."
                      : "Optional for Annual Leave. Accepted formats: PDF, JPG, PNG, DOC."}
                  </FormDescription>
                  {selectedFile && (
                    <FormDescription>
                      Selected: {selectedFile.name} (
                      {(selectedFile.size / 1024).toFixed(2)} KB)
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isApplying}>
                {isApplying ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
