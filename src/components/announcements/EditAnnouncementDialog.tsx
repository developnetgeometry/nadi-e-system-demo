import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SelectMany } from "@/components/ui/SelectMany";
import { useUserTypes } from "@/components/user-groups/hooks/useUserTypes";
import { DateInput } from "@/components/ui/date-input";
import { Pencil } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { AttachmentFile } from "./AnnouncementAttachment";
import { useFileUpload } from "@/hooks/use-file-upload";

interface EditAnnouncementDialogProps {
  announcement: {
    id: string;
    title: string;
    message: string;
    user_types: string[];
    start_date: string;
    end_date: string;
    status: "active" | "inactive";
    attachments: AttachmentFile[] | null;
  };
  onUpdate: () => void;
}

export function EditAnnouncementDialog({
  announcement,
  onUpdate,
}: EditAnnouncementDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { userTypes } = useUserTypes();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadFile } = useFileUpload();

  const form = useForm({
    defaultValues: {
      title: announcement.title,
      message: announcement.message,
      user_types: announcement.user_types || [],
      start_date: formatDate(new Date(announcement.start_date)),
      end_date: formatDate(new Date(announcement.end_date)),
    },
  });

  useEffect(() => {
    if (open) {
      // Reset form with announcement data when dialog opens
      form.reset({
        title: announcement.title,
        message: announcement.message,
        user_types: announcement.user_types || [],
        start_date: formatDate(new Date(announcement.start_date)),
        end_date: formatDate(new Date(announcement.end_date)),
      });
      setSelectedFiles([]);
    }
  }, [open, announcement, form]);

  const userTypeOptions = userTypes.map((type) => ({
    id: type,
    label: type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));

  // Handle file selection
  const handleFileSelection = (files: File[]) => {
    setSelectedFiles(files);
  };

  // Upload files function
  const uploadFiles = async (files: File[]): Promise<AttachmentFile[]> => {
    const uploadedFiles: AttachmentFile[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;

      const publicUrl = await uploadFile(file, "announcement-attachments", "");

      if (publicUrl) {
        uploadedFiles.push({
          name: file.name,
          path: filePath,
          size: file.size,
          type: file.type,
          url: publicUrl,
        });
      }
    }

    return uploadedFiles;
  };

  const onSubmit = async (data: any) => {
    try {
      setUploading(true);
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      // Validate dates
      if (endDate <= startDate) {
        toast({
          title: "Invalid Dates",
          description: "End date must be after start date",
          variant: "destructive",
        });
        return;
      }

      // Upload new files if any
      let updatedAttachments = announcement.attachments || [];
      if (selectedFiles.length > 0) {
        const newAttachments = await uploadFiles(selectedFiles);
        updatedAttachments = [...updatedAttachments, ...newAttachments];
      }

      // Update announcement with all data including attachments
      const { error } = await supabase
        .from("announcements")
        .update({
          title: data.title,
          message: data.message,
          user_types: data.user_types,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          attachments:
            updatedAttachments.length > 0 ? updatedAttachments : null,
        })
        .eq("id", announcement.id);

      if (error) {
        console.error("Error updating announcement:", error);
        toast({
          title: "Error",
          description: "Failed to update announcement",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });

      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Edit announcement">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Announcement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your announcement message"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DateInput {...field} />
                    </FormControl>
                    <FormDescription>
                      When the announcement becomes active
                    </FormDescription>
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
                      <DateInput {...field} />
                    </FormControl>
                    <FormDescription>
                      When the announcement expires
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="user_types"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target User Types</FormLabel>
                  <FormControl>
                    <SelectMany
                      options={userTypeOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select user types that can view this announcement"
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty to show to all users
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Add More Attachments</FormLabel>
              <FileUpload
                acceptedFileTypes=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
                maxSizeInMB={10}
                maxFiles={5}
                onFilesSelected={handleFileSelection}
                multiple={true}
                buttonText="Add Files"
              >
                Add New Attachments
              </FileUpload>

              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  <ul className="text-sm text-muted-foreground">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {announcement.attachments &&
                announcement.attachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current attachments:</p>
                    <ul className="text-sm text-muted-foreground">
                      {announcement.attachments.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
