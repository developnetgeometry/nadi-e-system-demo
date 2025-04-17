
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { sidebarStyles } from "@/utils/sidebar-styles";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";

interface SidebarItemProps {
  title: string;
  path: string;
  icon?: LucideIcon;
  isCollapsed?: boolean;
  isInWhiteBackground?: boolean;
  iconColor?: string;
}

export const SidebarItem = ({
  title,
  path,
  icon: Icon,
  isCollapsed,
  isInWhiteBackground,
  iconColor = "#6E41E2",
}: SidebarItemProps) => {
  const location = useLocation();
  const { isMobile } = useSidebar();
  const isActive = location.pathname === path;

  return (
    <SidebarMenuItem >
      <SidebarMenuButton asChild>
        <Link
          to={path}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-200 rounded-md",
            "border-l-2 border-l-gray-300 dark:border-l-gray-700", // always shows grey line
            "rounded-l-none", // remove rounding on the left side
            isActive && "text-purple-800 font-medium dark:text-purple-300",
            isCollapsed && !isMobile && "justify-center px-2"
          )}
          title={isCollapsed && !isMobile ? title : undefined}
        >

          <div className="relative flex items-center flex-shrink-0">
            <div
              className={cn(
                "absolute -left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full",
                isActive ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-600" // Light grey for non-active items
              )}
            />
            {Icon && <Icon className="h-5 w-5" color={iconColor} />}
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="truncate leading-tight min-h-[1.25rem] line-clamp-2 text-left">
              {title}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
