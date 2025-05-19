import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-utils";
import { Clock } from "lucide-react";
import {
  AnnouncementAttachment,
  AttachmentFile,
} from "./AnnouncementAttachment";

interface Announcement {
  id: string;
  title: string;
  message: string;
  status: "active" | "inactive";
  user_types: string[];
  created_at: string;
  start_date: string;
  end_date: string;
  attachments: AttachmentFile[] | null;
}

interface AnnouncementViewModalProps {
  announcement: Announcement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AnnouncementViewModal: React.FC<AnnouncementViewModalProps> = ({
  announcement,
  open,
  onOpenChange,
}) => {
  if (!announcement) return null;

  const isAnnouncementExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {announcement.title}
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {announcement.status === "inactive" && (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-800 border-gray-200"
              >
                Hidden
              </Badge>
            )}
            {isAnnouncementExpired(announcement.end_date) && (
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-800 border-amber-200"
              >
                Expired
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Valid from {formatDate(announcement.start_date)} to{" "}
              {formatDate(announcement.end_date)}
            </span>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{announcement.message}</p>
          </div>

          <AnnouncementAttachment attachments={announcement.attachments} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
