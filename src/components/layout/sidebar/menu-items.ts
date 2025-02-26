
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
  Timer,
  User,
  Database,
  CreditCard,
  MessageSquare,
  Flag,
  Wallet,
  Gauge,
  FileCheck,
  Eye,
  Layout
} from "lucide-react";

export const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "User Management", icon: Users, path: "/dashboard/users" },
  { title: "Roles & Permissions", icon: Shield, path: "/dashboard/roles" },
  { title: "Access Control", icon: UserCog, path: "/dashboard/access-control" },
  { title: "Menu Visibility", icon: Eye, path: "/dashboard/menu-visibility" },
  { title: "Activity Log", icon: Activity, path: "/dashboard/activity" },
  { title: "Reports", icon: FileBarChart, path: "/dashboard/reports" },
  { title: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
  { title: "Notifications", icon: Bell, path: "/dashboard/notifications" },
  { title: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export const hrMenuItems = [
  { title: "HR Dashboard", icon: Briefcase, path: "/dashboard/hr" },
  { title: "Employees", icon: UserPlus, path: "/dashboard/hr/employees" },
  { title: "Attendance", icon: ClipboardCheck, path: "/dashboard/hr/attendance" },
  { title: "Leave Management", icon: Clock, path: "/dashboard/hr/leave" },
];

export const posMenuItems = [
  { title: "POS Dashboard", icon: ShoppingCart, path: "/dashboard/pos" },
  { title: "Products", icon: Barcode, path: "/dashboard/pos/products" },
  { title: "Transactions", icon: Receipt, path: "/dashboard/pos/transactions" },
];

export const claimItems = [
  { title: "Claims Dashboard", icon: FileText, path: "/dashboard/claim" },
  { title: "Claims Settings", icon: Cog, path: "/dashboard/claim/settings" },
];

export const assetItems = [
  { title: "Asset Dashboard", icon: Box, path: "/dashboard/asset" },
  { title: "Asset Settings", icon: Cog, path: "/dashboard/asset/settings" },
];

export const financeItems = [
  { title: "Finance Dashboard", icon: DollarSign, path: "/dashboard/finance" },
  { title: "Finance Settings", icon: Cog, path: "/dashboard/finance/settings" },
];

export const programmesItems = [
  { title: "Programmes Dashboard", icon: List, path: "/dashboard/programmes" },
  { title: "Programmes Settings", icon: Cog, path: "/dashboard/programmes/settings" },
];

export const reportItems = [
  { title: "Reports Dashboard", icon: ChartBar, path: "/dashboard/reports" },
  { title: "Usage Sessions", icon: Timer, path: "/dashboard/usage-sessions" },
];

export const workflowItems = [
  { title: "Workflow Dashboard", icon: List, path: "/dashboard/workflow" },
];

export const memberManagementItems = [
  { title: "Personal Details", icon: User, path: "/dashboard/members/details" },
  { title: "Registration", icon: UserPlus, path: "/dashboard/members/registration" },
  { title: "Activity Logs", icon: Activity, path: "/dashboard/members/activity" },
];

export const serviceModuleItems = [
  { title: "Service Information", icon: Database, path: "/dashboard/services/info" },
  { title: "Transactions", icon: CreditCard, path: "/dashboard/services/transactions" },
];

export const communityItems = [
  { title: "Community Dashboard", icon: MessageSquare, path: "/dashboard/community" },
  { title: "Moderation", icon: Flag, path: "/dashboard/community/moderation" },
];

export const financialItems = [
  { title: "Wallet", icon: Wallet, path: "/dashboard/financial/wallet" },
  { title: "Transactions", icon: Receipt, path: "/dashboard/financial/transactions" },
];

export const complianceItems = [
  { title: "Audit Logs", icon: FileCheck, path: "/dashboard/compliance/audit" },
  { title: "System Reports", icon: Gauge, path: "/dashboard/compliance/reports" },
];
