import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


const AssetDashboardPage = lazy(() => import("@/pages/dashboard/asset/AssetDashboard"));
const AssetDetailsPage = lazy(() => import("@/pages/dashboard/asset/AssetDetails"));
const AssetSettingsPage = lazy(() => import("@/pages/dashboard/asset/AssetSettings"));
const MaintenanceDashboardPage = lazy(() => import("@/pages/dashboard/maintenance/MaintenanceDashboard"));


export const assetRoutes = [
  {
    path: "/asset",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <AssetDashboardPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/asset/detail/:id",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <AssetDetailsPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/asset/settings",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <AssetSettingsPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/asset/maintenance",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <MaintenanceDashboardPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
];

export const AssetRoutes = () => {
  return (
    <Routes>
      {assetRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};


