
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppSettings } from "@/hooks/use-app-settings";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const DEFAULT_SETTINGS = [
  {
    key: "system_name",
    label: "System Name",
    description: "The name of your system as displayed throughout the application",
    group: "general",
    value: ""
  },
  {
    key: "sidebar_title",
    label: "Sidebar Title",
    description: "The title displayed at the top of the sidebar (currently showing 'NADI')",
    group: "general",
    value: ""
  },
  {
    key: "company_name",
    label: "Company Name",
    description: "Your company name used in various places",
    group: "company",
    value: ""
  },
  {
    key: "support_email",
    label: "Support Email",
    description: "Email address for support inquiries",
    group: "contact",
    value: ""
  },
  {
    key: "dashboard_welcome_message",
    label: "Dashboard Welcome Message",
    description: "Welcome message displayed on the dashboard",
    group: "general",
    value: ""
  },
  {
    key: "member_login_enabled",
    label: "Enable Member Login",
    description: "Allow or disable member login functionality",
    group: "access",
    value: "true"
  },
  // Session configuration settings
  {
    key: "session_timeout",
    label: "Session Timeout (seconds)",
    description: "Maximum duration of a user session in seconds (default: 3600 = 1 hour)",
    group: "session",
    value: "3600"
  },
  {
    key: "session_inactivity_timeout",
    label: "Inactivity Timeout (seconds)",
    description: "Time in seconds before logging out an inactive user (default: 1800 = 30 minutes)",
    group: "session",
    value: "1800"
  },
  {
    key: "enable_inactivity_tracking",
    label: "Enable Inactivity Tracking",
    description: "Log out users after a period of inactivity",
    group: "session",
    value: "false"
  }
];

export const SystemSettings = () => {
  const { toast } = useToast();
  const { settings, updateSetting } = useAppSettings();
  const [localSettings, setLocalSettings] = useState(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize settings with values from the database
  useEffect(() => {
    const updatedSettings = localSettings.map(setting => ({
      ...setting,
      value: settings.find(s => s.key === setting.key)?.value || setting.value
    }));
    setLocalSettings(updatedSettings);
  }, [settings]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Update all settings that have changed
      for (const setting of localSettings) {
        const currentSetting = settings.find(s => s.key === setting.key);
        if (currentSetting?.value !== setting.value) {
          try {
            await updateSetting.mutateAsync({
              key: setting.key,
              value: setting.value
            });
          } catch (error: any) {
            // If the error is just about no rows being returned, we can ignore it
            if (error.code !== 'PGRST116') {
              throw error;
            }
          }
        }
      }

      toast({
        title: "Success",
        description: "All settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setLocalSettings(prev =>
      prev.map(s =>
        s.key === key ? { ...s, value } : s
      )
    );
  };
  
  const handleSwitchChange = (key: string, checked: boolean) => {
    setLocalSettings(prev =>
      prev.map(s =>
        s.key === key ? { ...s, value: checked.toString() } : s
      )
    );
  };

  const renderSettingInput = (setting: typeof localSettings[0]) => {
    // For boolean settings, render a switch
    if (setting.value === "true" || setting.value === "false") {
      return (
        <div className="flex items-center space-x-2">
          <Switch 
            id={setting.key}
            checked={setting.value === "true"}
            onCheckedChange={(checked) => handleSwitchChange(setting.key, checked)}
          />
          <Label htmlFor={setting.key}>{setting.value === "true" ? "Enabled" : "Disabled"}</Label>
        </div>
      );
    }
    
    // For numeric settings, render a number input
    if (!isNaN(Number(setting.value)) && setting.key.includes("timeout")) {
      return (
        <Input
          id={setting.key}
          type="number"
          value={setting.value}
          onChange={(e) => handleInputChange(setting.key, e.target.value)}
          className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
          placeholder={`Enter ${setting.label.toLowerCase()}`}
        />
      );
    }
    
    // Default text input
    return (
      <Input
        id={setting.key}
        value={setting.value}
        onChange={(e) => handleInputChange(setting.key, e.target.value)}
        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
        placeholder={`Enter ${setting.label.toLowerCase()}`}
      />
    );
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader  className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-white" />
          <CardTitle className="text-white">System Configuration</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {Object.entries(localSettings.reduce((acc, setting) => {
            if (!acc[setting.group]) {
              acc[setting.group] = [];
            }
            acc[setting.group].push(setting);
            return acc;
          }, {} as Record<string, typeof localSettings>)).map(([group, groupSettings]) => (
            <div key={group} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize">
                {group} Settings
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {groupSettings.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key} className="text-sm font-medium">
                      {setting.label}
                    </Label>
                    {renderSettingInput(setting)}
                    {setting.description && (
                      <p className="text-sm text-gray-500">
                        {setting.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="w-full md:w-auto"
            >
              {isSaving ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
