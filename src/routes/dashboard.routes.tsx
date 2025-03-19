import { Suspense, React } from 'react';
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

const dashboardRoutes = [
  {
    path: '/admin/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/admin/users',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/Users')) />
    </Suspense>
  },
  {
    path: '/admin/user-groups',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/UserGroups')) />
    </Suspense>
  },
  {
    path: '/admin/roles',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/Roles')) />
    </Suspense>
  },
  {
    path: '/admin/access-control',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/AccessControl')) />
    </Suspense>
  },
  {
    path: '/admin/menu-visibility',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/MenuVisibility')) />
    </Suspense>
  },
  {
    path: '/admin/activity',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/ActivityLog')) />
    </Suspense>
  },
  {
    path: '/admin/reports',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/Reports')) />
    </Suspense>
  },
  {
    path: '/admin/calendar',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/Calendar')) />
    </Suspense>
  },
  {
    path: '/admin/state-holidays',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/StateHolidays')) />
    </Suspense>
  },
  {
    path: '/admin/notifications',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/Notifications')) />
    </Suspense>
  },
  {
    path: '/admin/organizations',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/Organizations')) />
    </Suspense>
  },
  {
    path: '/admin/settings',
    element: <Suspense fallback={<Loading />}>
      <React.lazy(() => import('@/pages/dashboard/Settings')) />
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
