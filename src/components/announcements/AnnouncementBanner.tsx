import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Announcement {
  id: string;
  title: string;
  message: string;
}

export const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: announcements, error } = await supabase
        .from("announcements")
        .select("id, title, message")
        .eq("status", "active")
        .is("end_date", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching announcements:", error);
        return;
      }

      if (announcements && announcements.length > 0) {
        const { data: views } = await supabase
          .from("announcement_views")
          .select("*")
          .eq("announcement_id", announcements[0].id)
          .eq("user_id", userData.user.id)
          .single();

        if (!views) {
          setAnnouncement(announcements[0]);
        }
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDismiss = async () => {
    if (!announcement) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    await supabase.from("announcement_views").insert({
      announcement_id: announcement.id,
      user_id: userData.user.id,
    });

    setIsVisible(false);
  };

  if (!announcement || !isVisible) return null;

  return (
    <div className="w-full px-6 py-2 bg-background">
      <Alert>
        <AlertTitle className="text-lg font-semibold">
          {announcement.title}
        </AlertTitle>
        <AlertDescription className="mt-1">
          {announcement.message}
        </AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
};
