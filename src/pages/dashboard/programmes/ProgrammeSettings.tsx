import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ProgrammeSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    enableRegistration: true,
    maxParticipants: "50",
    enableWaitlist: true,
    autoConfirmation: true,
  });

  const handleSave = () => {
    console.log("Saving programme settings:", settings);
    toast({
      title: "Settings Saved",
      description: "Programme management settings have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Programme Management Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableRegistration">Enable Registration</Label>
              <Switch
                id="enableRegistration"
                checked={settings.enableRegistration}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableRegistration: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enableWaitlist">Enable Waitlist</Label>
              <Switch
                id="enableWaitlist"
                checked={settings.enableWaitlist}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableWaitlist: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoConfirmation">Auto Confirmation</Label>
              <Switch
                id="autoConfirmation"
                checked={settings.autoConfirmation}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoConfirmation: checked })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={settings.maxParticipants}
                onChange={(e) =>
                  setSettings({ ...settings, maxParticipants: e.target.value })
                }
              />
            </div>
            <Button onClick={handleSave}>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProgrammeSettings;