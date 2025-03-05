
import { Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard/Dashboard";
import Users from "@/pages/dashboard/Users";
import Roles from "@/pages/dashboard/Roles";
import RoleConfig from "@/pages/dashboard/RoleConfig";
import Settings from "@/pages/dashboard/Settings";
import AccessControl from "@/pages/dashboard/AccessControl";
import MenuVisibility from "@/pages/dashboard/MenuVisibility";
import Activity from "@/pages/dashboard/Activity";
import Reports from "@/pages/dashboard/Reports";
import Calendar from "@/pages/dashboard/Calendar";
import Notifications from "@/pages/dashboard/Notifications";
import Profile from "@/pages/dashboard/Profile";
import UsageSessions from "@/pages/dashboard/UsageSessions";
import Organizations from "@/pages/dashboard/Organizations";
import OrganizationDetails from "@/pages/dashboard/OrganizationDetails";

export const dashboardRoutes = (
  <Route path="dashboard">
    <Route index element={<Dashboard />} />
    <Route path="users" element={<Users />} />
    <Route path="roles" element={<Roles />} />
    <Route path="roles/:id" element={<RoleConfig />} />
    <Route path="access-control" element={<AccessControl />} />
    <Route path="menu-visibility" element={<MenuVisibility />} />
    <Route path="activity" element={<Activity />} />
    <Route path="reports" element={<Reports />} />
    <Route path="calendar" element={<Calendar />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="settings" element={<Settings />} />
    <Route path="profile" element={<Profile />} />
    <Route path="usage-sessions" element={<UsageSessions />} />
    <Route path="organizations" element={<Organizations />} />
    <Route path="organizations/:id" element={<OrganizationDetails />} />
  </Route>
);
