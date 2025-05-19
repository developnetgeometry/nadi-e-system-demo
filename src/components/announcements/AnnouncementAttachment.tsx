import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileImage, File as FileIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatFileSize } from "@/utils/backup-utils";

export interface AttachmentFile {
  name: string;
  path: string;
  size?: number;
  type?: string;
}

interface AnnouncementAttachmentProps {
  attachments: AttachmentFile[] | null;
}

export const AnnouncementAttachment: React.FC<AnnouncementAttachmentProps> = ({
  attachments,
}) => {
  if (!attachments || attachments.length === 0) return null;

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (extension === "pdf") {
      return <FileText className="h-5 w-5 text-red-600" />;
    } else if (
      ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")
    ) {
      return <FileImage className="h-5 w-5 text-green-600" />;
    } else {
      return <FileIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("announcement-attachments")
        .download(filePath);

      if (error) {
        console.error("Error downloading file:", error);
        return;
      }

      // Create a URL for the blob
      const url = URL.createObjectURL(data);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <h4 className="font-medium text-sm">Attachments</h4>
      <div className="grid gap-2">
        {attachments.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border rounded-md bg-muted/30"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {getFileIcon(file.name)}
              <span className="text-sm truncate">{file.name}</span>
              {file.size && (
                <span className="text-xs text-muted-foreground ml-2">
                  ({formatFileSize(file.size)})
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => downloadFile(file.path, file.name)}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
