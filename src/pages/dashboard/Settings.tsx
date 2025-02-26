
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { usePermissions } from "@/hooks/use-permissions";
import { Mail, Menu } from "lucide-react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SystemSettings } from "@/components/settings/SystemSettings";
import { EmailConfiguration } from "@/components/settings/EmailConfiguration";
import { MenuVisibilitySettings } from "@/components/settings/MenuVisibility";

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { data: permissions = [] } = usePermissions();
  const canManageSettings = permissions.some(p => p.name === 'manage_settings');

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

  if (loading) {
    return <SettingsLoading />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col ml-[240px]">
          <DashboardNavbar />
          <main className="flex-1 p-8 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl">
              <SettingsHeader />
              
              <div className="space-y-8">
                <ProfileSettings 
                  user={user}
                  fullName={fullName}
                  email={email}
                  setFullName={setFullName}
                />

                {canManageSettings && (
                  <div className="space-y-8">
                    <SystemSettings />

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
