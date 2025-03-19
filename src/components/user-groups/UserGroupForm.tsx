
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
import { useUserTypes } from "./hooks/useUserTypes";
import { Checkbox } from "@/components/ui/checkbox";
import { UserType } from "@/types/auth";

const formSchema = z.object({
  group_name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  user_types: z.array(z.string()).min(1, "At least one user type must be selected"),
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
  const { userTypes } = useUserTypes();

  const form = useForm<UserGroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_name: userGroup?.group_name || "",
      description: userGroup?.description || "",
      user_types: userGroup?.user_types || [],
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

        <div className="space-y-2">
          <FormLabel>User Types</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
            {userTypes.map((type) => (
              <FormField
                key={type}
                control={form.control}
                name="user_types"
                render={({ field }) => (
                  <FormItem 
                    key={type} 
                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-1"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(type)}
                        onCheckedChange={(checked) => {
                          const currentValues = [...field.value || []];
                          if (checked) {
                            if (!currentValues.includes(type)) {
                              field.onChange([...currentValues, type]);
                            }
                          } else {
                            field.onChange(
                              currentValues.filter((value) => value !== type)
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-sm font-normal">
                      {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage>
            {form.formState.errors.user_types?.message}
          </FormMessage>
        </div>

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
