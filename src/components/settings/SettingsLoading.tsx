
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const SettingsLoading = () => {
  return (
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-[200px] bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
  );
};
