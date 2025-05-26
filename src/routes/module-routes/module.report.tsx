import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


// const ReportDashboard = lazy(() => import("@/pages/reports/ReportDashboard"));
// const ReportUsageSession = lazy(() => import("@/pages/reports/ReportUsageSession"));
// const ReportInternetAccess = lazy(() => import("@/pages/reports/ReportInternetAccess"));
// const ReportPreset = lazy(() => import("@/pages/reports/ReportPreset"));
// const ReportCustom = lazy(() => import("@/pages/reports/ReportCustom"));

export const reportRoutes = [
    // {
    //     path: "/reports",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             <ProtectedRoute requiredPermission="">
    //                 <ReportDashboard />
    //             </ProtectedRoute>
    //         </Suspense>
    //     ),
    // },
    // {
    //     path: "/reports/usage-session",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             <ProtectedRoute requiredPermission="v">
    //                 <ReportUsageSession />
    //             </ProtectedRoute>
    //         </Suspense>
    //     ),
    // },
    // {
    //     path: "/reports/internet-access",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             <ProtectedRoute requiredPermission="">
    //                 <ReportInternetAccess />
    //             </ProtectedRoute>
    //         </Suspense>
    //     ),
    // },
    // {
    //     path: "/reports/preset",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             <ProtectedRoute requiredPermission="">
    //                 <ReportPreset />
    //             </ProtectedRoute>
    //         </Suspense>
    //     ),
    // },
    // {
    //     path: "/reports/custom",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             <ProtectedRoute requiredPermission="">
    //                 <ReportCustom />
    //             </ProtectedRoute>
    //         </Suspense>
    //     ),
    // },
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
