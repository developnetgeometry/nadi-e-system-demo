import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// import SiteManagement from "@/pages/dashboard/site/SiteManagement";
// import SiteDetails from "@/pages/dashboard/site/SiteDetail";
// import Site from "@/pages/dashboard/site/Site";
// import UtilitiesBilling from "@/pages/dashboard/site/UtilitiesBilling";
// import Insurance from "@/pages/dashboard/site/Insurance";
// import Usage from "@/pages/dashboard/site/Usage";
// import NADIClosure from "@/pages/dashboard/site/SiteClosure";
// import KPI from "@/pages/dashboard/site/KPIPerformance";
// import NMS from "@/pages/dashboard/site/NMS";
// import InventoryDashboard from "@/pages/dashboard/inventory/InventoryDashboard";
// import BookingManagement from "@/pages/dashboard/site/BookingManagement";
// import InventorySettings from "@/pages/dashboard/inventory/InventorySettings";
// import InventoryManagement from "@/pages/dashboard/site/InventoryManagement";
// import VendorManagement from "@/pages/dashboard/vendor/VendorManagement";

const SiteManagementPage = lazy(() => import("@/pages/dashboard/site/SiteManagement"));
const SiteDetailsPage = lazy(() => import("@/pages/dashboard/site/SiteDetail"));
const SitePage = lazy(() => import("@/pages/dashboard/site/Site"));
const UtilitiesBillingPage = lazy(() => import("@/pages/dashboard/site/UtilitiesBilling"));
const InsurancePage = lazy(() => import("@/pages/dashboard/site/Insurance"));
const UsagePage = lazy(() => import("@/pages/dashboard/site/Usage"));
const NADIClosurePage = lazy(() => import("@/pages/dashboard/site/SiteClosure"));
const KPIPage = lazy(() => import("@/pages/dashboard/site/KPIPerformance"));
const NMSPage = lazy(() => import("@/pages/dashboard/site/NMS"));
const BookingManagementPage = lazy(() => import("@/pages/dashboard/site/BookingManagement"));
const InventoryDashboardPage = lazy(() => import("@/pages/dashboard/inventory/InventoryDashboard"));
const InventorySettingsPage = lazy(() => import("@/pages/dashboard/inventory/InventorySettings"));
const PhaseOverviewPage = lazy(() => import("@/pages/dashboard/site/Phase"));
const PhaseFormPage = lazy(() => import("@/components/site/PhaseForm"));

export const siteRoutes = [
  {
    path: "/site-management",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <SiteManagementPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/site",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <SiteDetailsPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <SitePage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/utilities-billing",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <UtilitiesBillingPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/insurance",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <InsurancePage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/usage",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <UsagePage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/closure",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <NADIClosurePage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/kpi-performance",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <KPIPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/nms",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <NMSPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/booking-management",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <BookingManagementPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/inventory-management",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <InventoryDashboardPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/inventory-management/settings",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <InventorySettingsPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/phase",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <PhaseOverviewPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/site-management/phase/form/:id?",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <PhaseFormPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
];

export const SiteRoutes = () => {
  return (
    <Routes>
      {siteRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};
