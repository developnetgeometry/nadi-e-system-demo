
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { UserGroup, UserGroupFormData } from "./types";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  group_name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

interface UserGroupFormProps {
  userGroup: UserGroup | null;
  isSubmitting: boolean;
  onSubmit: (values: UserGroupFormData) => void;
  onCancel: () => void;
}

export const UserGroupForm = ({
  userGroup,
  isSubmitting,
  onSubmit,
  onCancel,
}: UserGroupFormProps) => {
  const isEditing = !!userGroup;

  const form = useForm<UserGroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_name: userGroup?.group_name || "",
      description: userGroup?.description || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="group_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter group name" {...field} />
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
                  placeholder="Enter a description for this group"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Group"
              : "Create Group"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
