import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SidebarContent as CustomSidebarContent } from "./sidebar/SidebarContent";
import { useSidebar } from "@/hooks/use-sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const DashboardSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  console.log("state:", state);
  console.log("isCollapsed:", isCollapsed);

  return (
    <aside
      className={cn(
        "h-screen flex flex-col transition-all duration-200 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-800 dark:text-white truncate">
            <Link
              to="/admin/dashboard"
              className="text-xl font-bold flex justify-center items-center"
            >
              <img
                src="/cmms-logo.png"
                alt="Logo"
                className="h-16 w-auto mx-auto"
                style={{ maxWidth: "100%", maxHeight: "4rem" }}
              />
            </Link>
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar Content */}
      <SidebarContent className="flex-1 overflow-y-auto scrollbar-blue">
        <CustomSidebarContent state={state} isCollapsed={isCollapsed} />
      </SidebarContent>
    </aside>
  );
};
