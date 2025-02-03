import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { useSidebar } from "@/hooks/use-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-[60px]' : 'ml-[240px]'}`}>
          <DashboardNavbar />
          <main className="flex-1 p-8 overflow-auto">
            <div className="container mx-auto max-w-7xl">
              <SidebarTrigger />
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};