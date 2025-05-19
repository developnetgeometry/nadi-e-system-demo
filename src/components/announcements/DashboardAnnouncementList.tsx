import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-utils";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import { AnnouncementViewModal } from "./AnnouncementViewModal";
import { AttachmentFile } from "./AnnouncementAttachment";

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

interface DashboardAnnouncementListProps {
  announcements: Announcement[];
  loading: boolean;
}

export const DashboardAnnouncementList: React.FC<
  DashboardAnnouncementListProps
> = ({ announcements, loading }) => {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    React.useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const viewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading announcements...
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No announcements available at this time.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {announcements.slice(0, 3).map((announcement) => (
        <div
          key={announcement.id}
          className="p-3 bg-primary/5 rounded-md border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={() => viewAnnouncement(announcement)}
        >
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{announcement.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Valid until {formatDate(announcement.end_date)}
              </p>
              <div className="line-clamp-2 text-sm mt-1 text-muted-foreground">
                {announcement.message}
              </div>
            </div>
            {announcement.attachments &&
              announcement.attachments.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 border-blue-200 flex-shrink-0"
                >
                  {announcement.attachments.length}
                </Badge>
              )}
          </div>
        </div>
      ))}

      {announcements.length > 3 && (
        <div className="text-center mt-2">
          <Button variant="link" asChild>
            <Link to="/announcements/list">View all announcements</Link>
          </Button>
        </div>
      )}

      <AnnouncementViewModal
        announcement={selectedAnnouncement}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};
