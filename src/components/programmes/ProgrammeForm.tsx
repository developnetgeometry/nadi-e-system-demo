import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProgrammeFormData {
  title: string;
  description?: string;
  status: "draft" | "active" | "completed" | "cancelled";
  start_date: string;
  end_date: string;
  location?: string;
  capacity?: number;
}

interface ProgrammeFormProps {
  programme?: {
    id: string;
    title: string;
    description: string | null;
    status: "draft" | "active" | "completed" | "cancelled";
    start_date: string;
    end_date: string;
    location: string | null;
    capacity: number | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProgrammeForm({
  programme,
  onSuccess,
  onCancel,
}: ProgrammeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProgrammeFormData>({
    defaultValues: {
      title: programme?.title || "",
      description: programme?.description || "",
      status: programme?.status || "draft",
      start_date: programme?.start_date
        ? new Date(programme.start_date).toISOString().split("T")[0]
        : "",
      end_date: programme?.end_date
        ? new Date(programme.end_date).toISOString().split("T")[0]
        : "",
      location: programme?.location || "",
      capacity: programme?.capacity || undefined,
    },
  });

  const onSubmit = async (data: ProgrammeFormData) => {
    setIsLoading(true);
    try {
      console.log("Submitting programme data:", data);

      if (programme) {
        // Update existing programme
        const { error } = await supabase
          .from("programmes")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", programme.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Programme updated successfully",
        });
      } else {
        // Create new programme
        const { error } = await supabase.from("programmes").insert({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Programme created successfully",
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving programme:", error);
      toast({
        title: "Error",
        description: "Failed to save programme",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : programme
              ? "Update Programme"
              : "Create Programme"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
