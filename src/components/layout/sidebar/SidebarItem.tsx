import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { sidebarStyles } from "@/utils/sidebar-styles";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  title: string;
  path: string;
  icon: LucideIcon;
  isCollapsed?: boolean;
}

export const SidebarItem = ({ title, path, icon: Icon, isCollapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link 
          to={path}
          className={cn(
            sidebarStyles.menuItem,
            isActive && sidebarStyles.menuItemActive
          )}
          title={isCollapsed ? title : undefined}
        >
          <Icon className={sidebarStyles.iconWrapper} />
          {!isCollapsed && <span className="break-words leading-tight">{title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};