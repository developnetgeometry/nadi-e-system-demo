import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SelectMany } from "@/components/ui/SelectMany";
import { useUserTypes } from "@/components/user-groups/hooks/useUserTypes";
import { DateInput } from "@/components/ui/date-input";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/date-utils";
import { useAppSettings } from "@/hooks/use-app-settings";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

interface AnnouncementFormData {
  title: string;
  message: string;
  user_types: string[];
  start_date: string;
  end_date: string;
}

interface AttachmentFile {
  name: string;
  path: string;
  size?: number;
  type?: string;
}

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<AnnouncementFormData>();
  const { userTypes } = useUserTypes();
  const { getSetting } = useAppSettings();
  const [defaultDuration, setDefaultDuration] = useState(7);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Handle file selection
  const handleFileSelection = (files: File[]) => {
    setSelectedFiles(files);
  };

  // Get default duration from app settings
  useEffect(() => {
    const durationDays = parseInt(
      getSetting("default_announcement_duration", "7")
    );
    setDefaultDuration(durationDays);

    // Set default end date based on current date + default duration
    const today = new Date();
    const startDateStr = formatDate(today);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + durationDays);
    const endDateStr = formatDate(endDate);

    form.setValue("start_date", startDateStr);
    form.setValue("end_date", endDateStr);
  }, [getSetting]);

  const userTypeOptions = userTypes.map((type) => ({
    id: type,
    label: type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = new Date(e.target.value);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + defaultDuration);
    form.setValue("end_date", formatDate(endDate));
  };

  // Upload files function
  const uploadFiles = async (files: File[]): Promise<AttachmentFile[]> => {
    const uploadedFiles: AttachmentFile[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("announcement-attachments")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading file:", error);
        continue;
      }

      uploadedFiles.push({
        name: file.name,
        path: filePath,
        size: file.size,
        type: file.type,
      });
    }

    return uploadedFiles;
  };

  const onSubmit = async (data: AnnouncementFormData) => {
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

      // Upload files if any
      const attachments =
        selectedFiles.length > 0 ? await uploadFiles(selectedFiles) : null;

      const { error } = await supabase.from("announcements").insert({
        title: data.title,
        message: data.message,
        user_types: data.user_types,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: "active",
        attachments: attachments,
      });

      if (error) {
        console.error("Error creating announcement:", error);
        if (error.message.includes("maximum number of active announcements")) {
          toast({
            title: "Error",
            description: "Maximum number of active announcements reached",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to create announcement",
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Success",
        description: "Announcement created successfully",
      });

      navigate("/announcements");
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
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Announcement</h1>
        </div>

        <div className="max-w-2xl">
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
                        <DateInput
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleStartDateChange(e);
                          }}
                        />
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
                        When the announcement expires (defaults to{" "}
                        {defaultDuration} days after start)
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Attachments</FormLabel>
                <FileUpload
                  acceptedFileTypes=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
                  maxSizeInMB={10}
                  maxFiles={5}
                  onFilesSelected={handleFileSelection}
                  multiple={true}
                  buttonText="Upload Files"
                >
                  Add Attachments
                </FileUpload>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Creating..." : "Create Announcement"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/announcements")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
}
