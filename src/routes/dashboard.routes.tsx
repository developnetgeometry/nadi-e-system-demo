import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import Profile from "@/pages/dashboard/Profile";
import Settings from "@/pages/dashboard/Settings";
import Users from "@/pages/dashboard/Users";
import Roles from "@/pages/dashboard/Roles";
import AccessControl from "@/pages/dashboard/AccessControl";
import Activity from "@/pages/dashboard/Activity";
import Notifications from "@/pages/dashboard/Notifications";
import Calendar from "@/pages/dashboard/Calendar";
import Reports from "@/pages/dashboard/Reports";
import UsageSessions from "@/pages/dashboard/UsageSessions";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: "/dashboard/settings",
    element: <ProtectedRoute requiredPermission="manage_settings"><Settings /></ProtectedRoute>,
  },
  {
    path: "/dashboard/users",
    element: <ProtectedRoute requiredPermission="manage_users"><Users /></ProtectedRoute>,
  },
  {
    path: "/dashboard/roles",
    element: <ProtectedRoute requiredPermission="manage_roles"><Roles /></ProtectedRoute>,
  },
  {
    path: "/dashboard/access-control",
    element: <ProtectedRoute requiredPermission="manage_permissions"><AccessControl /></ProtectedRoute>,
  },
  {
    path: "/dashboard/activity",
    element: <ProtectedRoute requiredPermission="view_activity"><Activity /></ProtectedRoute>,
  },
  {
    path: "/dashboard/notifications",
    element: <ProtectedRoute><Notifications /></ProtectedRoute>,
  },
  {
    path: "/dashboard/calendar",
    element: <ProtectedRoute><Calendar /></ProtectedRoute>,
  },
  {
    path: "/dashboard/reports",
    element: <ProtectedRoute requiredPermission="view_reports"><Reports /></ProtectedRoute>,
  },
  {
    path: "/dashboard/usage-sessions",
    element: <ProtectedRoute requiredPermission="view_usage_sessions"><UsageSessions /></ProtectedRoute>,
  },
];