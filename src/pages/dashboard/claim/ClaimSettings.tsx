import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ClaimSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    requireAttachments: true,
    autoApprovalLimit: "100",
    notifyReviewers: true,
    claimTypes: "medical,transport,meals,others",
  });

  const handleSave = () => {
    console.log("Saving claim settings:", settings);
    toast({
      title: "Settings Saved",
      description: "Claim management settings have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Claim Management Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="requireAttachments">Require Attachments</Label>
              <Switch
                id="requireAttachments"
                checked={settings.requireAttachments}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, requireAttachments: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyReviewers">Notify Reviewers</Label>
              <Switch
                id="notifyReviewers"
                checked={settings.notifyReviewers}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifyReviewers: checked })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="autoApprovalLimit">Auto-approval Limit ($)</Label>
              <Input
                id="autoApprovalLimit"
                type="number"
                value={settings.autoApprovalLimit}
                onChange={(e) =>
                  setSettings({ ...settings, autoApprovalLimit: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="claimTypes">Claim Types (comma-separated)</Label>
              <Input
                id="claimTypes"
                value={settings.claimTypes}
                onChange={(e) =>
                  setSettings({ ...settings, claimTypes: e.target.value })
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

export default ClaimSettings;