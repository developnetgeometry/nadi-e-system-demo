import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SidebarContent as CustomSidebarContent } from "./sidebar/SidebarContent";
import { useAppSettings } from "@/hooks/use-app-settings";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sidebarStyles } from "@/utils/sidebar-styles";

export const DashboardSidebar = () => {
  const { settings } = useAppSettings();
  const { isMobile, toggleSidebar, state } = useSidebar();
  const sidebarTitle =
    settings.find((s) => s.key === "sidebar_title")?.value || "NADI";
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className={cn(
        "border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col transition-all duration-100",
        isCollapsed ? "w-16" : "w-64", // Adjust width based on collapse state
        sidebarStyles.sidebarBackground
      )}
    >
      <div
        className={cn(
          "p-4 flex items-center transition-all duration-100",
          isCollapsed && !isMobile ? "justify-center" : "justify-between"
        )}
      >
        {(!isCollapsed || isMobile) && (
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
            {sidebarTitle}
          </h1>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
          >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <SidebarContent
        className={cn(
          "pr-4 pl-4 flex-1 overflow-y-auto scrollbar-none transition-opacity duration-100",
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        {!isCollapsed && <CustomSidebarContent />}
      </SidebarContent>
    </Sidebar>
  );
};