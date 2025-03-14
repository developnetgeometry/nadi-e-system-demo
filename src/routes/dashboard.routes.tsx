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
const SiteManagement = lazy(() => import("@/pages/dashboard/SiteManagement"));
const Profile = lazy(() => import("@/pages/dashboard/Profile"));
const UsageSessions = lazy(() => import("@/pages/dashboard/UsageSessions"));
const Organizations = lazy(() => import("@/pages/dashboard/Organizations"));
const OrganizationDetails = lazy(
  () => import("@/pages/dashboard/OrganizationDetails")
);
const ParameterSettings = lazy(
  () => import("@/pages/dashboard/OrganizationDetails")
);
const StateHolidays = lazy(() => import("@/pages/dashboard/StateHolidays"));

export const dashboardRoutes = [
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/roles",
    element: (
      <ProtectedRoute>
        <Roles />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/roles/:id",
    element: (
      <ProtectedRoute>
        <RoleConfig />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/access-control",
    element: (
      <ProtectedRoute>
        <AccessControl />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/menu-visibility",
    element: (
      <ProtectedRoute>
        <MenuVisibility />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/activity",
    element: (
      <ProtectedRoute>
        <Activity />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/calendar",
    element: (
      <ProtectedRoute>
        <Calendar />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/notifications",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/siteManagement",
    element: (
      <ProtectedRoute>
        <SiteManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/organizations",
    element: (
      <ProtectedRoute>
        <Organizations />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/organizations/:id",
    element: (
      <ProtectedRoute>
        <OrganizationDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/state-holidays",
    element: (
      <ProtectedRoute>
        <StateHolidays />
      </ProtectedRoute>
    ),
  },
];
