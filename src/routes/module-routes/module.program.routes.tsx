import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";



const ProgrammesDashboardPage = lazy(() => import("@/pages/dashboard/programmes/ProgrammesDashboard"));
const ProgrammeSettingsPage = lazy(() => import("@/pages/dashboard/programmes/ProgrammeSettings"));
const ProgrammeEditPage = lazy(() => import("@/pages/dashboard/programmes/ProgrammeRegistration"));
const ProgrammeRegistrationPage = lazy(() => import("@/pages/dashboard/programmes/ProgrammeRegistration"));
const SmartServicesNadi4UPage = lazy(() => import("@/pages/dashboard/programmes/SmartServicesNadi4U"));
const SmartServicesNadi2UPage = lazy(() => import("@/pages/dashboard/programmes/SmartServicesNadi2U"));
const OthersProgrammesPage = lazy(() => import("@/pages/dashboard/programmes/OthersProgrammes"));



export const programmeRoutes = [
    {
        path: "/programmes",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ProgrammesDashboardPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/settings",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ProgrammeSettingsPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/edit/:id",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ProgrammeEditPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/registration",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ProgrammeRegistrationPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/nadi4u",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <SmartServicesNadi4UPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/nadi2u",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <SmartServicesNadi2UPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/others",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <OthersProgrammesPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    
];

export const ProgrammeRoutes = () => {
    return (
        <Routes>
            {programmeRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};
