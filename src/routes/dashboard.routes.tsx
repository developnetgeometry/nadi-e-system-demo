import { lazy } from "react";
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Users = lazy(() => import("@/pages/dashboard/Users"));
const Roles = lazy(() => import("@/pages/dashboard/Roles"));
const AccessControl = lazy(() => import("@/pages/dashboard/AccessControl"));
const MenuVisibility = lazy(() => import("@/pages/dashboard/MenuVisibility"));
const Activity = lazy(() => import("@/pages/dashboard/Activity"));
const Reports = lazy(() => import("@/pages/dashboard/Reports"));
const Calendar = lazy(() => import("@/pages/dashboard/Calendar"));
const Notifications = lazy(() => import("@/pages/dashboard/Notifications"));
const SiteManagement = lazy(() => import("@/pages/dashboard/SiteManagement"));
const Settings = lazy(() => import("@/pages/dashboard/Settings"));

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
];
