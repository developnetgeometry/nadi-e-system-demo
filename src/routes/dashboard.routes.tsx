
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from '@/components/ui/loading';
import DashboardPage from '@/pages/dashboard';
import UsersPage from '@/pages/dashboard/Users';
import RolesPage from '@/pages/dashboard/Roles';
import AccessControlPage from '@/pages/dashboard/AccessControl';
import MenuVisibilityPage from '@/pages/dashboard/MenuVisibility';
import ActivityLogPage from '@/pages/dashboard/ActivityLog';
import ReportsPage from '@/pages/dashboard/Reports';
import CalendarPage from '@/pages/dashboard/Calendar';
import StateHolidaysPage from '@/pages/dashboard/StateHolidays';
import NotificationsPage from '@/pages/dashboard/Notifications';
import OrganizationsPage from '@/pages/dashboard/Organizations';
import SettingsPage from '@/pages/dashboard/Settings';
import UserGroupsPage from '@/pages/dashboard/UserGroups';

const dashboardRoutes = [
  {
    path: '/admin/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/admin/users',
    element: <Suspense fallback={<Loading />}>
      <UsersPage />
    </Suspense>
  },
  {
    path: '/admin/user-groups',
    element: <Suspense fallback={<Loading />}>
      <UserGroupsPage />
    </Suspense>
  },
  {
    path: '/admin/roles',
    element: <Suspense fallback={<Loading />}>
      <RolesPage />
    </Suspense>
  },
  {
    path: '/admin/access-control',
    element: <Suspense fallback={<Loading />}>
      <AccessControlPage />
    </Suspense>
  },
  {
    path: '/admin/menu-visibility',
    element: <Suspense fallback={<Loading />}>
      <MenuVisibilityPage />
    </Suspense>
  },
  {
    path: '/admin/activity',
    element: <Suspense fallback={<Loading />}>
      <ActivityLogPage />
    </Suspense>
  },
  {
    path: '/admin/reports',
    element: <Suspense fallback={<Loading />}>
      <ReportsPage />
    </Suspense>
  },
  {
    path: '/admin/calendar',
    element: <Suspense fallback={<Loading />}>
      <CalendarPage />
    </Suspense>
  },
  {
    path: '/admin/state-holidays',
    element: <Suspense fallback={<Loading />}>
      <StateHolidaysPage />
    </Suspense>
  },
  {
    path: '/admin/notifications',
    element: <Suspense fallback={<Loading />}>
      <NotificationsPage />
    </Suspense>
  },
  {
    path: '/admin/organizations',
    element: <Suspense fallback={<Loading />}>
      <OrganizationsPage />
    </Suspense>
  },
  {
    path: '/admin/settings',
    element: <Suspense fallback={<Loading />}>
      <SettingsPage />
    </Suspense>
  },
];

export const DashboardRoutes = () => {
  return (
    <Routes>
      {dashboardRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};
