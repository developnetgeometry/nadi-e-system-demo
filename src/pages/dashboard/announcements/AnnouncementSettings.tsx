import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useState, useEffect } from "react";

export default function AnnouncementSettings() {
  const { toast } = useToast();
  const { settings, updateSetting, isLoading } = useAppSettings();

  const [defaultDuration, setDefaultDuration] = useState("7");
  const [maxAnnouncements, setMaxAnnouncements] = useState("5");
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);

  useEffect(() => {
    if (!isLoading && settings) {
      const durationSetting = settings.find(
        (s) => s.key === "default_announcement_duration"
      );
      if (durationSetting) setDefaultDuration(durationSetting.value);

      const maxSetting = settings.find(
        (s) => s.key === "max_active_announcements"
      );
      if (maxSetting) setMaxAnnouncements(maxSetting.value);

      const enabledSetting = settings.find(
        (s) => s.key === "announcements_enabled"
      );
      setAnnouncementsEnabled(enabledSetting?.value !== "false");
    }
  }, [settings, isLoading]);

  const handleSave = async () => {
    try {
      await updateSetting.mutateAsync({
        key: "default_announcement_duration",
        value: defaultDuration,
      });
      await updateSetting.mutateAsync({
        key: "max_active_announcements",
        value: maxAnnouncements,
      });
      await updateSetting.mutateAsync({
        key: "announcements_enabled",
        value: announcementsEnabled ? "true" : "false",
      });

      toast({
        title: "Settings saved",
        description: "Announcement settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save announcement settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="space-y-1 py-6">
        <h1 className="text-2xl font-bold mb-6">Announcement Settings</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure how announcements are displayed and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Announcements</Label>
                  <div className="text-sm text-muted-foreground">
                    Turn on/off the announcement system
                  </div>
                </div>
                <Switch
                  checked={announcementsEnabled}
                  onCheckedChange={setAnnouncementsEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultDuration">
                  Default Announcement Duration (days)
                </Label>
                <Input
                  id="defaultDuration"
                  type="number"
                  value={defaultDuration}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) setDefaultDuration(e.target.value);
                  }}
                  min="1"
                />
                <p className="text-sm text-muted-foreground">
                  Default number of days announcements will remain active
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAnnouncements">
                  Maximum Active Announcements
                </Label>
                <Input
                  id="maxAnnouncements"
                  type="number"
                  value={maxAnnouncements}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) setMaxAnnouncements(e.target.value);
                  }}
                  min="1"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of announcements that can be active at the same
                  time
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={isLoading || updateSetting.isPending}
              >
                {updateSetting.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
