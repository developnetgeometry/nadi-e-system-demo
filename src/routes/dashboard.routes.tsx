import { RouteObject } from "react-router-dom";
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
    element: <Dashboard />,
  },
  {
    path: "/dashboard/profile",
    element: <Profile />,
  },
  {
    path: "/dashboard/settings",
    element: <Settings />,
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
    path: "/dashboard/activity",
    element: <Activity />,
  },
  {
    path: "/dashboard/notifications",
    element: <Notifications />,
  },
  {
    path: "/dashboard/calendar",
    element: <Calendar />,
  },
  {
    path: "/dashboard/reports",
    element: <Reports />,
  },
  {
    path: "/dashboard/usage-sessions",
    element: <UsageSessions />,
  },
];