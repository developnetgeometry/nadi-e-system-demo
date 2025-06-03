import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGenerateLeaveBalance } from "@/hooks/hr/use-generate-leave-balance";

const formSchema = z.object({
  year: z.number().min(2020).max(2030),
  scope: z.enum(["all", "specific"]),
  staffIds: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface GenerateLeaveBalanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateLeaveBalanceDialog({
  open,
  onOpenChange,
}: GenerateLeaveBalanceDialogProps) {
  const { generateBalances, isGenerating } = useGenerateLeaveBalance();
  const currentYear = new Date().getFullYear();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: currentYear,
      scope: "all",
      staffIds: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await generateBalances({
        year: data.year,
        staffIds: data.scope === "specific" ? data.staffIds : undefined,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to generate leave balances:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Leave Balances</DialogTitle>
          <DialogDescription>
            Generate leave balances for staff members for the specified year.
            This will create balance records for all leave types.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={2020}
                      max={2030}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generate For</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Staff</SelectItem>
                      <SelectItem value="specific">Specific Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("scope") === "specific" && (
              <div className="text-sm text-muted-foreground">
                Note: Specific staff selection will be implemented in future
                updates. For now, this will generate for all staff.
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Balances"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
