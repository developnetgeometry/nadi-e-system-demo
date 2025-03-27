
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
            "flex items-center gap-3 px-4 py-2 text-sm font-medium text-white rounded-md transition-all duration-200 hover:bg-white/10",
            isActive && "bg-white/20",
            isCollapsed && !isMobile && "justify-center px-2",
            isInWhiteBackground && "text-gray-700 hover:bg-gray-100"
          )}
          title={isCollapsed && !isMobile ? title : undefined}
        >
          <Icon className={cn(
            "h-5 w-5 flex-shrink-0",
            isInWhiteBackground && "text-gray-500"
          )} />
          {(!isCollapsed || isMobile) && <span className="truncate">{title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
