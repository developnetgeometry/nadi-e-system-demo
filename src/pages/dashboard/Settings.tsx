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
import { useAppSettings } from "@/hooks/use-app-settings";
import { usePermissions } from "@/hooks/use-permissions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserType } from "@/types/auth";
import { menuItems } from "@/components/layout/sidebar/menu-items";

interface EmailConfig {
  provider: 'smtp' | 'resend' | 'sendgrid';
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_password?: string;
  from_email?: string;
  from_name?: string;
  api_key?: string;
}

interface MenuVisibility {
  menu_key: string;
  visible_to: UserType[];
}

interface SubmoduleVisibility {
  parent_module: string;
  submodule_key: string;
  visible_to: UserType[];
}

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { data: permissions = [] } = usePermissions();
  const { settings, updateSetting } = useAppSettings();

  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    provider: 'smtp',
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    from_email: '',
    from_name: '',
    api_key: '',
  });

  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility[]>([]);
  const [submoduleVisibility, setSubmoduleVisibility] = useState<SubmoduleVisibility[]>([]);

  const userTypes: UserType[] = [
    'member',
    'vendor',
    'tp',
    'sso',
    'dusp',
    'super_admin',
    'medical_office',
    'staff_internal',
    'staff_external'
  ];

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

  useEffect(() => {
    const loadConfigurations = async () => {
      try {
        // Load email config
        const { data: emailData } = await supabase
          .from('email_config')
          .select('*')
          .single();
        if (emailData) {
          setEmailConfig(emailData);
        }

        // Load menu visibility
        const { data: menuData } = await supabase
          .from('menu_visibility')
          .select('*');
        if (menuData) {
          setMenuVisibility(menuData);
        }

        // Load submodule visibility
        const { data: submoduleData } = await supabase
          .from('submodule_visibility')
          .select('*');
        if (submoduleData) {
          setSubmoduleVisibility(submoduleData);
        }
      } catch (error) {
        console.error('Error loading configurations:', error);
        toast({
          title: "Error",
          description: "Failed to load configurations",
          variant: "destructive",
        });
      }
    };

    if (canManageSettings) {
      loadConfigurations();
    }
  }, [canManageSettings, toast]);

  const handleUpdateEmailConfig = async () => {
    try {
      const { error } = await supabase
        .from('email_config')
        .upsert(emailConfig);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email configuration updated successfully",
      });
    } catch (error) {
      console.error('Error updating email config:', error);
      toast({
        title: "Error",
        description: "Failed to update email configuration",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMenuVisibility = async (menuKey: string, userType: UserType, checked: boolean) => {
    const currentMenu = menuVisibility.find(m => m.menu_key === menuKey) || {
      menu_key: menuKey,
      visible_to: []
    };

    const updatedVisibleTo = checked
      ? [...currentMenu.visible_to, userType]
      : currentMenu.visible_to.filter(t => t !== userType);

    try {
      const { error } = await supabase
        .from('menu_visibility')
        .upsert({
          menu_key: menuKey,
          visible_to: updatedVisibleTo
        });

      if (error) throw error;

      setMenuVisibility(prev => 
        prev.map(m => m.menu_key === menuKey ? { ...m, visible_to: updatedVisibleTo } : m)
      );

      toast({
        title: "Success",
        description: "Menu visibility updated successfully",
      });
    } catch (error) {
      console.error('Error updating menu visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update menu visibility",
        variant: "destructive",
      });
    }
  };

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
                {/* Profile Settings Card */}
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
                  <>
                    {/* Email Configuration */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label>Email Provider</Label>
                          <Select
                            value={emailConfig.provider}
                            onValueChange={(value: 'smtp' | 'resend' | 'sendgrid') => 
                              setEmailConfig(prev => ({ ...prev, provider: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="smtp">SMTP</SelectItem>
                              <SelectItem value="resend">Resend</SelectItem>
                              <SelectItem value="sendgrid">SendGrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {emailConfig.provider === 'smtp' && (
                          <>
                            <div className="space-y-2">
                              <Label>SMTP Host</Label>
                              <Input
                                value={emailConfig.smtp_host || ''}
                                onChange={(e) => setEmailConfig(prev => ({ 
                                  ...prev, 
                                  smtp_host: e.target.value 
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>SMTP Port</Label>
                              <Input
                                type="number"
                                value={emailConfig.smtp_port || ''}
                                onChange={(e) => setEmailConfig(prev => ({ 
                                  ...prev, 
                                  smtp_port: parseInt(e.target.value) 
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>SMTP User</Label>
                              <Input
                                value={emailConfig.smtp_user || ''}
                                onChange={(e) => setEmailConfig(prev => ({ 
                                  ...prev, 
                                  smtp_user: e.target.value 
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>SMTP Password</Label>
                              <Input
                                type="password"
                                value={emailConfig.smtp_password || ''}
                                onChange={(e) => setEmailConfig(prev => ({ 
                                  ...prev, 
                                  smtp_password: e.target.value 
                                }))}
                              />
                            </div>
                          </>
                        )}

                        {(emailConfig.provider === 'resend' || emailConfig.provider === 'sendgrid') && (
                          <div className="space-y-2">
                            <Label>API Key</Label>
                            <Input
                              type="password"
                              value={emailConfig.api_key || ''}
                              onChange={(e) => setEmailConfig(prev => ({ 
                                ...prev, 
                                api_key: e.target.value 
                              }))}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>From Email</Label>
                          <Input
                            value={emailConfig.from_email || ''}
                            onChange={(e) => setEmailConfig(prev => ({ 
                              ...prev, 
                              from_email: e.target.value 
                            }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>From Name</Label>
                          <Input
                            value={emailConfig.from_name || ''}
                            onChange={(e) => setEmailConfig(prev => ({ 
                              ...prev, 
                              from_name: e.target.value 
                            }))}
                          />
                        </div>

                        <Button onClick={handleUpdateEmailConfig}>
                          Save Email Configuration
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Menu Visibility */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Menu Visibility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {menuItems.map((item) => (
                            <div key={item.title} className="space-y-4">
                              <h3 className="text-lg font-semibold">{item.title}</h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {userTypes.map((userType) => (
                                  <div key={userType} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${item.title}-${userType}`}
                                      checked={menuVisibility.some(
                                        m => m.menu_key === item.title && m.visible_to.includes(userType)
                                      )}
                                      onCheckedChange={(checked) => 
                                        handleUpdateMenuVisibility(item.title, userType, checked as boolean)
                                      }
                                    />
                                    <Label htmlFor={`${item.title}-${userType}`}>
                                      {userType.replace(/_/g, ' ').split(' ').map(word => 
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                      ).join(' ')}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Application Settings */}
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
                  </>
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
