import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DynamicDashboard } from "@/components/dashboard/DynamicDashboard";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AnnouncementCarousel } from "@/components/announcements/AnnouncementCarousel";
import { AttachmentFile } from "@/components/announcements/AnnouncementAttachment";

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

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      fetchAnnouncements();
    }
  }, [user]);
  const fetchAnnouncements = async () => {
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
        .order("created_at", {
          ascending: false,
        })
        .limit(5);
      if (error) {
        console.error("Error fetching announcements:", error);
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Announcement Banner */}
        <Card className="mb-2">
          <CardHeader className="pb-2">
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <AnnouncementCarousel
              announcements={announcements}
              loading={loading}
            />
          </CardContent>
        </Card>
        <DynamicDashboard />
      </ErrorBoundary>
    </div>
  );
};
export default Dashboard;
