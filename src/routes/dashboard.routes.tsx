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
const Settings = lazy(() => import("@/pages/dashboard/Settings"));

export const dashboardRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dashboard/users",
    element: <Users />,
  },
  {
    path: "/dashboard/roles",
    element: <Roles />,
  },
  {
    path: "/dashboard/access-control",
    element: <AccessControl />,
  },
  {
    path: "/dashboard/menu-visibility",
    element: <MenuVisibility />,
  },
  {
    path: "/dashboard/activity",
    element: <Activity />,
  },
  {
    path: "/dashboard/reports",
    element: <Reports />,
  },
  {
    path: "/dashboard/calendar",
    element: <Calendar />,
  },
  {
    path: "/dashboard/notifications",
    element: <Notifications />,
  },
  {
    path: "/dashboard/settings",
    element: <Settings />,
  },
];
