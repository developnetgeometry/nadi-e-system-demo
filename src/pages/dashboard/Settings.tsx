import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { usePermissions } from "@/hooks/use-permissions";
import { SystemSettings } from "@/components/settings/SystemSettings";
import { EmailConfiguration } from "@/components/settings/EmailConfiguration";
import { MenuVisibilitySettings } from "@/components/settings/MenuVisibility";
import { Settings as SettingsIcon, User as UserIcon, Mail, Menu } from "lucide-react";

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { data: permissions = [] } = usePermissions();
  const { settings, updateSetting } = useAppSettings();
  const canManageSettings = permissions.some(p => p.name === 'manage_settings');

  const [appSettings, setAppSettings] = useState<Record<string, string>>({
    app_name: '',
    dashboard_title: '',
    users_title: '',
    roles_title: ''
  });

  useEffect(() => {
    if (settings) {
      const settingsMap: Record<string, string> = {};
      settings.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });
      setAppSettings(settingsMap);
    }
  }, [settings]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setEmail(user.email || "");
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          if (profile) {
            setFullName(profile.full_name || "");
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await updateSetting.mutateAsync({ key, value });
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

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-[200px] bg-gray-200 rounded"></div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col ml-[240px]">
          <DashboardNavbar />
          <main className="flex-1 p-8 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center gap-3 mb-8">
                <SettingsIcon className="h-8 w-8 text-indigo-600" />
                <h1 className="text-3xl font-bold">Settings</h1>
              </div>
              
              <div className="space-y-8">
                {/* Profile Settings Card */}
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-6 w-6 text-white" />
                      <CardTitle className="text-white">Profile Settings</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <Input
                          id="name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="bg-gray-50 cursor-not-allowed"
                        />
                        <p className="text-sm text-gray-500 italic">
                          Email cannot be changed. Contact support if you need to update it.
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={updating}
                        className="w-full sm:w-auto"
                      >
                        {updating ? "Updating..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {canManageSettings && (
                  <div className="space-y-8">
                    {/* System Settings */}
                    <SystemSettings />

                    {/* Email Configuration */}
                    <Card className="overflow-hidden border-none shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600">
                        <div className="flex items-center gap-3">
                          <Mail className="h-6 w-6 text-white" />
                          <CardTitle className="text-white">Email Configuration</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <EmailConfiguration />
                      </CardContent>
                    </Card>

                    {/* Menu Visibility */}
                    <Card className="overflow-hidden border-none shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600">
                        <div className="flex items-center gap-3">
                          <Menu className="h-6 w-6 text-white" />
                          <CardTitle className="text-white">Menu Visibility</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <MenuVisibilitySettings />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
