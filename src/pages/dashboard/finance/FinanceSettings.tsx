import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const FinanceSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    enableAutoInvoicing: true,
    defaultPaymentTerms: "30",
    enableLatePaymentReminders: true,
    defaultCurrency: "USD",
  });

  const handleSave = () => {
    console.log("Saving finance settings:", settings);
    toast({
      title: "Settings Saved",
      description:
        "Finance management settings have been updated successfully.",
    });
  };

  return (
    <div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Finance Management Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableAutoInvoicing">Enable Auto Invoicing</Label>
              <Switch
                id="enableAutoInvoicing"
                checked={settings.enableAutoInvoicing}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableAutoInvoicing: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enableLatePaymentReminders">
                Late Payment Reminders
              </Label>
              <Switch
                id="enableLatePaymentReminders"
                checked={settings.enableLatePaymentReminders}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    enableLatePaymentReminders: checked,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultPaymentTerms">
                Default Payment Terms (days)
              </Label>
              <Input
                id="defaultPaymentTerms"
                type="number"
                value={settings.defaultPaymentTerms}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultPaymentTerms: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Input
                id="defaultCurrency"
                value={settings.defaultCurrency}
                onChange={(e) =>
                  setSettings({ ...settings, defaultCurrency: e.target.value })
                }
              />
            </div>
            <Button onClick={handleSave}>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceSettings;
