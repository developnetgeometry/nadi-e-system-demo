import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarProvider>
      <div className="relative min-h-screen flex w-full bg-background">
        <div className="fixed inset-y-0 z-50">
          <DashboardSidebar />
        </div>
        <div 
          className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            isCollapsed ? "ml-[72px]" : "ml-[280px]",
            "lg:ml-[280px]"
          )}
        >
          <DashboardNavbar />
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            <div className="container mx-auto max-w-7xl">
              <SidebarTrigger className="lg:hidden mb-4" />
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};