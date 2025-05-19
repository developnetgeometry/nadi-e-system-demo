import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileUpload } from "@/components/ui/file-upload";

interface AnnouncementFormData {
  title: string;
  message: string;
  files?: FileList;
}

interface AttachmentFile {
  name: string;
  path: string;
  size?: number;
  type?: string;
}

export const CreateAnnouncementDialog = () => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue } =
    useForm<AnnouncementFormData>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelection = (files: File[]) => {
    setSelectedFiles(files);
  };

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

      // First upload files if any
      const attachments =
        selectedFiles.length > 0 ? await uploadFiles(selectedFiles) : null;

      const { error } = await supabase.from("announcements").insert({
        title: data.title,
        message: data.message,
        attachments: attachments,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create announcement",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Announcement created successfully",
      });

      reset();
      setSelectedFiles([]);
      setOpen(false);
    } catch (error) {
      console.error("Error creating announcement:", error);
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
        <Button>Create Announcement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Title"
              {...register("title", { required: true })}
            />
          </div>
          <div>
            <Textarea
              placeholder="Message"
              {...register("message", { required: true })}
              rows={4}
            />
          </div>
          <div>
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
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? "Creating..." : "Create Announcement"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
