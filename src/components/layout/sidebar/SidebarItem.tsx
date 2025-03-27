
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { sidebarStyles } from "@/utils/sidebar-styles";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";

interface SidebarItemProps {
  title: string;
  path: string;
  icon: LucideIcon;
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
  iconColor = "#6E41E2"
}: SidebarItemProps) => {
  const location = useLocation();
  const { isMobile } = useSidebar();
  const isActive = location.pathname === path;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link 
          to={path}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 rounded-md",
            sidebarStyles.hoverTransition,
            "hover:bg-gray-50",
            isActive && "bg-gray-50 text-gray-900 font-medium",
            isCollapsed && !isMobile && "justify-center px-2"
          )}
          title={isCollapsed && !isMobile ? title : undefined}
        >
          {isActive && (
            <div className={cn(
              sidebarStyles.menuItemIndicator,
              "bg-primary"
            )}/>
          )}
          <Icon 
            className="h-5 w-5 flex-shrink-0" 
            color={iconColor}
          />
          {(!isCollapsed || isMobile) && <span className="truncate">{title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
