
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const roleFormSchema = z.object({
  name: z.string()
    .min(3, "Role name must be at least 3 characters")
    .max(50, "Role name must not exceed 50 characters")
    .regex(/^[a-z0-9_]+$/, "Role name can only contain lowercase letters, numbers, and underscores"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must not exceed 200 characters"),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id: string;
    name: string;
    description: string;
  };
  onSubmit: (values: RoleFormValues) => Promise<void>;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: RoleFormDialogProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const handleSubmit = async (values: RoleFormValues) => {
    try {
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. admin_user" 
                      {...field} 
                      disabled={!!initialData}
                    />
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
                    <Textarea 
                      placeholder="Describe the role's responsibilities and access level"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
