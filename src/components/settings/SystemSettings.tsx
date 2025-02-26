
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppSettings } from "@/hooks/use-app-settings";

const DEFAULT_SETTINGS = [
  {
    key: "system_name",
    label: "System Name",
    description: "The name of your system as displayed throughout the application",
    group: "general",
    value: ""
  },
  {
    key: "navbar_title",
    label: "Navigation Bar Title",
    description: "The title displayed in the navigation bar",
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
  }
];

export const SystemSettings = () => {
  const { toast } = useToast();
  const { settings, updateSetting } = useAppSettings();
  const [localSettings, setLocalSettings] = useState(DEFAULT_SETTINGS);

  // Initialize settings with values from the database
  useState(() => {
    const updatedSettings = localSettings.map(setting => ({
      ...setting,
      value: settings.find(s => s.key === setting.key)?.value || setting.value
    }));
    setLocalSettings(updatedSettings);
  }, [settings]);

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await updateSetting.mutateAsync({ key, value });
      
      // Update local state
      setLocalSettings(prev => 
        prev.map(setting => 
          setting.key === key ? { ...setting, value } : setting
        )
      );

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  const groupedSettings = localSettings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = [];
    }
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<string, typeof localSettings>);

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-white" />
          <CardTitle className="text-white">System Configuration</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {Object.entries(groupedSettings).map(([group, groupSettings]) => (
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
                    <Input
                      id={setting.key}
                      value={setting.value}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setLocalSettings(prev =>
                          prev.map(s =>
                            s.key === setting.key ? { ...s, value: newValue } : s
                          )
                        );
                      }}
                      onBlur={(e) => handleUpdateSetting(setting.key, e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Enter ${setting.label.toLowerCase()}`}
                    />
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
        </div>
      </CardContent>
    </Card>
  );
};
