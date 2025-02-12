
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { useAppSettings } from "@/hooks/use-app-settings";
import { usePermissions } from "@/hooks/use-permissions";

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
            <div>Loading...</div>
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
          <main className="flex-1 p-8 overflow-auto">
            <div className="container mx-auto max-w-6xl">
              <h1 className="text-3xl font-bold mb-8">Settings</h1>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="bg-gray-100"
                        />
                        <p className="text-sm text-gray-500">
                          Email cannot be changed. Contact support if you need to update it.
                        </p>
                      </div>
                      <Button type="submit" disabled={updating}>
                        {updating ? "Updating..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {canManageSettings && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="app_name">Application Name</Label>
                        <Input
                          id="app_name"
                          value={appSettings.app_name}
                          onChange={(e) => setAppSettings({ ...appSettings, app_name: e.target.value })}
                          onBlur={() => handleUpdateSetting('app_name', appSettings.app_name)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dashboard_title">Dashboard Title</Label>
                        <Input
                          id="dashboard_title"
                          value={appSettings.dashboard_title}
                          onChange={(e) => setAppSettings({ ...appSettings, dashboard_title: e.target.value })}
                          onBlur={() => handleUpdateSetting('dashboard_title', appSettings.dashboard_title)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="users_title">Users Section Title</Label>
                        <Input
                          id="users_title"
                          value={appSettings.users_title}
                          onChange={(e) => setAppSettings({ ...appSettings, users_title: e.target.value })}
                          onBlur={() => handleUpdateSetting('users_title', appSettings.users_title)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roles_title">Roles Section Title</Label>
                        <Input
                          id="roles_title"
                          value={appSettings.roles_title}
                          onChange={(e) => setAppSettings({ ...appSettings, roles_title: e.target.value })}
                          onBlur={() => handleUpdateSetting('roles_title', appSettings.roles_title)}
                        />
                      </div>
                    </CardContent>
                  </Card>
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
