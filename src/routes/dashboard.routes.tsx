
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
const OrganizationDetails = lazy(() => import("@/pages/dashboard/OrganizationDetails"));

export const dashboardRoutes = [
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin/users",
    element: <Users />,
  },
  {
    path: "/admin/roles",
    element: <Roles />,
  },

  {
    path: "/dashboard/roles/:id",
    element: <RoleConfig />,
  },
  {
    path: "/admin/access-control",
    element: <AccessControl />,
  },
  {
    path: "/admin/menu-visibility",
    element: <MenuVisibility />,
  },
  {
    path: "/admin/activity",
    element: <Activity />,
  },
  {
    path: "/admin/reports",
    element: <Reports />,
  },
  {
    path: "/admin/calendar",
    element: <Calendar />,
  },
  {
    path: "/admin/notifications",
    element: <Notifications />,
  },
  {
    path: "/admin/siteManagement",
    element: <SiteManagement />,
  },
  {
    path: "/admin/settings",
    element: <Settings />,
  },

  {
    path: "/dashboard/organizations",
    element: <Organizations />,
  },
  {
    path: "/dashboard/organizations/:id",
    element: <OrganizationDetails />,
  }
];
