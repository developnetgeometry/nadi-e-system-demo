
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { usePermissions } from "@/hooks/use-permissions";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SystemSettings } from "@/components/settings/SystemSettings";

const Settings = () => {
  const { data: permissions = [] } = usePermissions();
  const canManageSettings = permissions.some(p => p.name === 'manage_settings');

  if (!canManageSettings) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                You don't have permission to access system settings
              </h2>
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
              <SettingsHeader />
              <div className="space-y-8">
                <SystemSettings />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
