import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { AnnouncementBanner } from "@/components/announcements/AnnouncementBanner";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import PageBreadcrumb from "./PageBreadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { state } = useSidebar();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className={cn("flex-1 flex flex-col transition-all duration-200")}>
          <DashboardNavbar />
          <PageBreadcrumb />
          <AnnouncementBanner />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
