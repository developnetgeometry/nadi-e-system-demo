import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Shield, 
  UserCog,
  Activity,
  FileBarChart,
  Bell,
  Calendar,
  Briefcase,
  UserPlus,
  ClipboardCheck,
  Clock,
  ShoppingCart,
  Barcode,
  Receipt,
  Box,
  Package,
  DollarSign,
  List,
  FileText,
  Cog,
  ChartBar,
  Timer
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "User Management", icon: Users, path: "/dashboard/users" },
  { title: "Roles & Permissions", icon: Shield, path: "/dashboard/roles" },
  { title: "Access Control", icon: UserCog, path: "/dashboard/access-control" },
  { title: "Activity Log", icon: Activity, path: "/dashboard/activity" },
  { title: "Reports", icon: FileBarChart, path: "/dashboard/reports" },
  { title: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
  { title: "Notifications", icon: Bell, path: "/dashboard/notifications" },
  { title: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const hrMenuItems = [
  { title: "HR Dashboard", icon: Briefcase, path: "/dashboard/hr" },
  { title: "Employees", icon: UserPlus, path: "/dashboard/hr/employees" },
  { title: "Attendance", icon: ClipboardCheck, path: "/dashboard/hr/attendance" },
  { title: "Leave Management", icon: Clock, path: "/dashboard/hr/leave" },
];

const posMenuItems = [
  { title: "POS Dashboard", icon: ShoppingCart, path: "/dashboard/pos" },
  { title: "Products", icon: Barcode, path: "/dashboard/pos/products" },
  { title: "Transactions", icon: Receipt, path: "/dashboard/pos/transactions" },
];

const claimItems = [
  { title: "Claims Dashboard", icon: FileText, path: "/dashboard/claim" },
  { title: "Claims Settings", icon: Cog, path: "/dashboard/claim/settings" },
];

const assetItems = [
  { title: "Asset Dashboard", icon: Box, path: "/dashboard/asset" },
  { title: "Asset Settings", icon: Cog, path: "/dashboard/asset/settings" },
];

const financeItems = [
  { title: "Finance Dashboard", icon: DollarSign, path: "/dashboard/finance" },
  { title: "Finance Settings", icon: Cog, path: "/dashboard/finance/settings" },
];

const programmesItems = [
  { title: "Programmes Dashboard", icon: List, path: "/dashboard/programmes" },
  { title: "Programmes Settings", icon: Cog, path: "/dashboard/programmes/settings" },
];

const reportItems = [
  { title: "Reports Dashboard", icon: ChartBar, path: "/dashboard/reports" },
  { title: "Usage Sessions", icon: Timer, path: "/dashboard/usage-sessions" },
];

const workflowItems = [
  { title: "Workflow Dashboard", icon: List, path: "/dashboard/workflow" },
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

        <SidebarGroup>
          <SidebarGroupLabel>HR Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hrMenuItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>POS Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {posMenuItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Claim Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {claimItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Asset Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {assetItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Finance Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Programmes Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {programmesItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Report Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Workflow Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workflowItems.map((item) => (
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
