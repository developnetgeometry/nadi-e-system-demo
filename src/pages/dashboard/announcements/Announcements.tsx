import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnnouncementList } from "@/components/announcements/AnnouncementList";
import { CreateAnnouncementDialog } from "@/components/announcements/CreateAnnouncementDialog";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Announcements() {
  const { data: permissions } = usePermissions();
  const canManageAnnouncements = permissions?.some(
    (p) => p.name === "manage_announcements"
  );

  return (
    <div>
      <div className="space-y-1 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Announcements</h1>
          <div className="flex gap-4">
            {canManageAnnouncements && (
              <>
                <CreateAnnouncementDialog />
                <Button variant="outline" asChild>
                  <Link to="/announcements/announcement-settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
        <AnnouncementList />
      </div>
    </div>
  );
}
