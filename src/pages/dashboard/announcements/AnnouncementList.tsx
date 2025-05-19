import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { formatDate } from "@/utils/date-utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Info } from "lucide-react";
import { AttachmentFile } from "@/components/announcements/AnnouncementAttachment";
import { AnnouncementViewModal } from "@/components/announcements/AnnouncementViewModal";
import { useToast } from "@/hooks/use-toast";

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

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, [user]);

  const fetchAnnouncements = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get the user's profile to determine user type
      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      const userType = profileData?.user_type;

      // Fetch active announcements that are valid for current date
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("status", "active")
        .lte("start_date", new Date().toISOString())
        .or(`end_date.gt.${new Date().toISOString()},end_date.is.null`)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch announcements",
          variant: "destructive",
        });
        return;
      }

      // Filter announcements based on user type
      const filteredAnnouncements =
        data?.filter((announcement) => {
          // If user_types array is empty, show to all users
          if (
            !announcement.user_types ||
            announcement.user_types.length === 0
          ) {
            return true;
          }
          // Otherwise, check if user's type is in the announcement's user_types
          return announcement.user_types.includes(userType);
        }) || [];

      setAnnouncements(filteredAnnouncements);
    } catch (error) {
      console.error("Error in announcements fetch:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const viewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  const isAnnouncementExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Announcements"
          description="Important updates and notices"
        />

        <Card className="mt-6">
          <CardContent className="pt-6 space-y-6">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">
                Loading announcements...
              </div>
            ) : announcements.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No announcements available at this time.
              </div>
            ) : (
              announcements.map((announcement) => (
                <Alert
                  key={announcement.id}
                  className="bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => viewAnnouncement(announcement)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <AlertTitle className="text-lg font-semibold">
                          {announcement.title}
                        </AlertTitle>
                        <div className="text-xs text-muted-foreground mt-1">
                          Valid from {formatDate(announcement.start_date)} to{" "}
                          {formatDate(announcement.end_date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {announcement.end_date &&
                        isAnnouncementExpired(announcement.end_date) && (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 border-amber-200"
                          >
                            Expired
                          </Badge>
                        )}
                      {announcement.attachments &&
                        announcement.attachments.length > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 border-blue-200"
                          >
                            {announcement.attachments.length}{" "}
                            {announcement.attachments.length === 1
                              ? "Attachment"
                              : "Attachments"}
                          </Badge>
                        )}
                    </div>
                  </div>
                  <AlertDescription className="mt-3 pl-8">
                    <div className="line-clamp-3">{announcement.message}</div>

                    <Button
                      variant="link"
                      size="sm"
                      className="mt-1 h-auto p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewAnnouncement(announcement);
                      }}
                    >
                      Read more
                    </Button>
                  </AlertDescription>
                </Alert>
              ))
            )}
          </CardContent>
        </Card>
      </PageContainer>

      <AnnouncementViewModal
        announcement={selectedAnnouncement}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </DashboardLayout>
  );
}
