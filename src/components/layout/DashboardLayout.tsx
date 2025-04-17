import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import PageBreadcrumb from "./PageBreadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { state, isMobile, openMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Dynamically calculate sidebar width
  const [sidebarWidth, setSidebarWidth] = useState("--sidebar-width");

  useEffect(() => {
    if (isCollapsed) {
      setSidebarWidth("--sidebar-width-icon"); // Collapsed width
    } else {
      setSidebarWidth("--sidebar-width"); // Expanded width
    }
  }, [isCollapsed]);

  // Add body overflow class when mobile sidebar is open to prevent scrolling
  useEffect(() => {
    if (isMobile && openMobile) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobile, openMobile]);

  return (
    <SidebarProvider>
      <div className="relative min-h-screen flex w-full bg-[#F7F9FC] dark:bg-gray-900 text-gray-800 dark:text-white">
        {/* Overlay for mobile */}
        {isMobile && openMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => useSidebar().setOpenMobile(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "z-50 h-screen duration-200 relative transition-[width] ease-linear bg-red-500", // Debugging background
            isMobile ? "fixed" : "sticky top-0",
            isCollapsed ? "w-[--sidebar-width-icon]" : "w-[--sidebar-width]"
          )}
        >
          <DashboardSidebar />

        </div>

        {/* Main content */}
        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-200 w-full",
            isMobile
              ? "ml-0"
              : `ml-[calc(var(${sidebarWidth}))]` // Dynamically adjust margin
          )}
        >
          <DashboardNavbar />
          <PageBreadcrumb />
          <main className="flex-1 p-6 overflow-auto w-full">
            <div className="w-full mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};