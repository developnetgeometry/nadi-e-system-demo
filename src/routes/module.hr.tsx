import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Apply lazy loading to all HR components
const HRDashboardPage = lazy(() => import("@/pages/dashboard/hr/HRDashboard"));
const HRSettingsPage = lazy(() => import("@/pages/dashboard/hr/HRSettings"));
const EmployeesPage = lazy(() => import("@/pages/dashboard/hr/Employees"));
const SiteStaffPage = lazy(() => import("@/pages/dashboard/hr/SiteStaff"));
const AttendancePage = lazy(() => import("@/pages/dashboard/hr/Attendance"));
const LeavePage = lazy(() => import("@/pages/dashboard/hr/Leave"));
const PayrollPage = lazy(() => import("@/pages/dashboard/hr/Payroll"));

export const hrRoutes = [
    // HR Routes
    {
        path: "/hr",
        element: (

            <Suspense fallback={<LoadingSpinner />}>
                {/*<ProtectedRoute requiredPermission=""> */}
                <HRDashboardPage />
                {/*</ProtectedRoute>*/}
            </Suspense>

        ),
    },
    {
        path: "/hr/settings",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <HRSettingsPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/hr/employees",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <EmployeesPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/hr/site-staff",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <SiteStaffPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/hr/attendance",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <AttendancePage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/hr/leave",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <LeavePage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/hr/payroll",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <PayrollPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
];

export const HrRoutes = () => {
    return (
        <Routes>
            {hrRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};
