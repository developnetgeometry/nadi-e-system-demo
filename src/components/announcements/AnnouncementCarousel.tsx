import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { formatDate } from "@/utils/date-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import { AttachmentFile } from "./AnnouncementAttachment";
import { AnnouncementViewModal } from "./AnnouncementViewModal";
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
interface AnnouncementCarouselProps {
  announcements: Announcement[];
  loading: boolean;
}
export const AnnouncementCarousel: React.FC<AnnouncementCarouselProps> = ({
  announcements,
  loading
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [api, setApi] = useState<any>(null);
  const viewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!api || !announcements.length) return;
    const autoPlayInterval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000); // Change announcement every 5 seconds

    return () => clearInterval(autoPlayInterval);
  }, [api, announcements.length]);
  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Loading announcements...</div>;
  }
  if (announcements.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No announcements available at this time.</div>;
  }
  return <div className="relative">
      <Carousel setApi={setApi} className="w-full" opts={{
      loop: true
    }}>
        <CarouselContent>
          {announcements.map(announcement => <CarouselItem key={announcement.id}>
              <div onClick={() => viewAnnouncement(announcement)} className="p-3 bg-primary/5 rounded-md border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors h-[140px] flex flex-col px-[60px]">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{announcement.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valid until {formatDate(announcement.end_date)}
                    </p>
                  </div>
                  {announcement.attachments && announcement.attachments.length > 0 && <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex-shrink-0">
                      {announcement.attachments.length}
                    </Badge>}
                </div>
                <div className="line-clamp-3 text-sm mt-2 text-muted-foreground flex-1">
                  {announcement.message}
                </div>
              </div>
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious className="left-2 -translate-y-1/2" />
        <CarouselNext className="right-2 -translate-y-1/2" />
      </Carousel>
      
      {announcements.length > 1 && <div className="text-center mt-2">
          <Button variant="link" asChild>
            <Link to="/announcements/list">View all announcements</Link>
          </Button>
        </div>}

      <AnnouncementViewModal announcement={selectedAnnouncement} open={modalOpen} onOpenChange={setModalOpen} />
    </div>;
};