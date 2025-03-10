import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy load dashboard components
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Users = lazy(() => import("@/pages/dashboard/Users"));
const Roles = lazy(() => import("@/pages/dashboard/Roles"));
const RoleConfig = lazy(() => import("@/pages/dashboard/RoleConfig"));
const Settings = lazy(() => import("@/pages/dashboard/Settings"));
const AccessControl = lazy(() => import("@/pages/dashboard/AccessControl"));
const MenuVisibility = lazy(() => import("@/pages/dashboard/MenuVisibility"));
const Activity = lazy(() => import("@/pages/dashboard/Activity"));
const Reports = lazy(() => import("@/pages/dashboard/Reports"));
const Calendar = lazy(() => import("@/pages/dashboard/Calendar"));
const Notifications = lazy(() => import("@/pages/dashboard/Notifications"));
const Profile = lazy(() => import("@/pages/dashboard/Profile"));
const UsageSessions = lazy(() => import("@/pages/dashboard/UsageSessions"));
const Organizations = lazy(() => import("@/pages/dashboard/Organizations"));
const OrganizationDetails = lazy(() => import("@/pages/dashboard/OrganizationDetails"));
const StateHolidays = lazy(() => import("@/pages/dashboard/StateHolidays"));

export const dashboardRoutes = [
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/users",
    element: <ProtectedRoute><Users /></ProtectedRoute>,
  },
  {
    path: "/dashboard/roles",
    element: <ProtectedRoute><Roles /></ProtectedRoute>,
  },
  {
    path: "/dashboard/roles/:id",
    element: <ProtectedRoute><RoleConfig /></ProtectedRoute>,
  },
  {
    path: "/dashboard/access-control",
    element: <ProtectedRoute><AccessControl /></ProtectedRoute>,
  },
  {
    path: "/dashboard/menu-visibility",
    element: <ProtectedRoute><MenuVisibility /></ProtectedRoute>,
  },
  {
    path: "/dashboard/activity",
    element: <ProtectedRoute><Activity /></ProtectedRoute>,
  },
  {
    path: "/dashboard/reports",
    element: <ProtectedRoute><Reports /></ProtectedRoute>,
  },
  {
    path: "/dashboard/calendar",
    element: <ProtectedRoute><Calendar /></ProtectedRoute>,
  },
  {
    path: "/dashboard/notifications",
    element: <ProtectedRoute><Notifications /></ProtectedRoute>,
  },
  {
    path: "/dashboard/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: "/dashboard/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: "/dashboard/usage-sessions",
    element: <ProtectedRoute><UsageSessions /></ProtectedRoute>,
  },
  {
    path: "/dashboard/organizations",
    element: <ProtectedRoute><Organizations /></ProtectedRoute>,
  },
  {
    path: "/dashboard/organizations/:id",
    element: <ProtectedRoute><OrganizationDetails /></ProtectedRoute>,
  },
  {
    path: "/dashboard/state-holidays",
    element: <ProtectedRoute><StateHolidays /></ProtectedRoute>,
  },
];
