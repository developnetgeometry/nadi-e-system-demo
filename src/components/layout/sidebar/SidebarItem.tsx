
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
}

export const SidebarItem = ({ 
  title, 
  path, 
  icon: Icon, 
  isCollapsed,
  isInWhiteBackground 
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
            "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 rounded-md transition-all duration-200 hover:bg-gray-100",
            isActive && "bg-gray-100 text-primary font-medium",
            isCollapsed && !isMobile && "justify-center px-2"
          )}
          title={isCollapsed && !isMobile ? title : undefined}
        >
          {isActive && (
            <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"/>
          )}
          <Icon className="h-5 w-5 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span className="truncate">{title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
