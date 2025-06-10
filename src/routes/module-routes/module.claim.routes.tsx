import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


// Lazy load components
const ClaimDashboardPage = lazy(() => import("@/pages/dashboard/claim/ClaimDashboard"));
const ClaimSettingsPage = lazy(() => import("@/pages/dashboard/claim/ClaimSettings"));
const ClaimRegisterPage = lazy(() => import("@/pages/dashboard/claim/ClaimRegister"));
const ClaimReportPage = lazy(() => import("@/pages/dashboard/claim/ClaimReports"));

export const claimRoutes = [
    {
        path: "/claim",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ClaimDashboardPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/claim/settings",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ClaimSettingsPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/claim/register",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ClaimRegisterPage/>
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
        {
        path: "/claim/report",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ClaimReportPage/>
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
];

export const ClaimRoutes = () => {
    return (
        <Routes>
            {claimRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};
