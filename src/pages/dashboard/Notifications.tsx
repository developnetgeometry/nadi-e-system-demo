import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { NotificationList } from "@/components/notifications/NotificationList";

const Notifications = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardNavbar />
          <main className="flex-1 p-8">
            <SidebarTrigger />
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Notifications</h1>
              <div className="bg-background rounded-lg border shadow-sm">
                <NotificationList />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Notifications;