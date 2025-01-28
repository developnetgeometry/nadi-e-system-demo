import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Shield, 
  UserCog,
  Activity,
  FileBarChart,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { 
    title: "User Management",
    icon: Users, 
    path: "/dashboard/users"
  },
  { 
    title: "Roles & Permissions", 
    icon: Shield, 
    path: "/dashboard/roles" 
  },
  { 
    title: "Access Control", 
    icon: UserCog, 
    path: "/dashboard/access-control" 
  },
  { 
    title: "Activity Log", 
    icon: Activity, 
    path: "/dashboard/activity" 
  },
  { 
    title: "Reports", 
    icon: FileBarChart, 
    path: "/dashboard/reports" 
  },
  { 
    title: "Notifications", 
    icon: Bell, 
    path: "/dashboard/notifications" 
  },
  { 
    title: "Settings", 
    icon: Settings, 
    path: "/dashboard/settings" 
  },
];

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Console</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};