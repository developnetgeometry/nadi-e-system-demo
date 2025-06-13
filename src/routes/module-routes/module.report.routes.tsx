import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const ReportDashboard = lazy(() => import("@/pages/dashboard/report/ReportDashboard"));
const ReportNadiESystem = lazy(() => import("@/pages/dashboard/report/ReportNadiESystem"));
const ReportInternetAccess = lazy(() => import("@/pages/dashboard/report/ReportInternetAccess"));
const ReportSiteManagement = lazy(() => import("@/pages/dashboard/report/ReportSiteManagement"));
const ReportHRSalary = lazy(() => import("@/pages/dashboard/report/ReportHRSalary"));
const ReportTraining = lazy(() => import("@/pages/dashboard/report/ReportTraining"));
const ReportCM = lazy(() => import("@/pages/dashboard/report/ReportCM"));
const ReportSmartService = lazy(() => import("@/pages/dashboard/report/ReportSmartService"));



export const reportRoutes = [
    //Reports Routes
  {
        path: "/reports",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ReportDashboard />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/reports/nadi-e-system",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ReportNadiESystem />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },    {
        path: "/reports/internet-access",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ReportInternetAccess />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/reports/site-management",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ReportSiteManagement />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },    {
        path: "/reports/hr-salary",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ReportHRSalary />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/reports/training",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ReportTraining />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },    {
        path: "/reports/cm",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ReportCM />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/reports/smart-services",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ReportSmartService />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
];

export const ReportRoutes = () => {
    return (
        <Routes>
            {reportRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};
