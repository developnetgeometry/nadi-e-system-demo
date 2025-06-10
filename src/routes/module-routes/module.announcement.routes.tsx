import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const AnnouncementsPage = lazy(() => import("@/pages/dashboard/announcements/Announcements"));
const AnnouncementSettingsPage = lazy(() => import("@/pages/dashboard/announcements/AnnouncementSettings"));
const CreateAnnouncementPage = lazy(() => import("@/pages/dashboard/announcements/CreateAnnouncement"));
const AnnouncementListPage = lazy(() => import("@/pages/dashboard/announcements/AnnouncementList"));

export const announcementRoutes = [
  // Setup routes for the module
  {
    path: "/announcements",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/*<ProtectedRoute requiredPermission="view_site_details"> */}
        <AnnouncementsPage />
        {/*</ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/announcements/list",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/*<ProtectedRoute requiredPermission="view_site_details"> */}
        <AnnouncementListPage />
        {/*</ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/announcements/create-announcement",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* // <ProtectedRoute requiredPermission="view_site_details"> */}
        <CreateAnnouncementPage />
        {/* // </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/announcements/announcements-settings",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* // <ProtectedRoute requiredPermission="view_site_details"> */}
        <AnnouncementSettingsPage />
        {/* // </ProtectedRoute> */}
      </Suspense>
    ),
  },
];

export const AnnouncementRoutes = () => {
  return (
    <Routes>
      {announcementRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};
