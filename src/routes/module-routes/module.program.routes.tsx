import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy load components
const ProgrammesDashboard = lazy(() => import("@/pages/dashboard/programmes/ProgrammesDashboard"));
const ProgrammeSettings = lazy(() => import("@/pages/dashboard/programmes/ProgrammeSettings"));
// const ProgrammeRegister = lazy(() => import("@/pages/dashboard/programmes/ProgrammeRegister"));
// const ProgrammeNADI4U = lazy(() => import("@/pages/dashboard/programmes/ProgrammeNADI4U"));
// const ProgrammeNADI2U = lazy(() => import("@/pages/dashboard/programmes/ProgrammeNADI2U"));

export const programmeRoutes = [
    {
        path: "/programmes",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ProgrammesDashboard />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/settings",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ProgrammeSettings />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    // {
    //     path: "/programmes/register",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             {/* <ProtectedRoute requiredPermission=""> */}
    //             <ProgrammeRegister />
    //             {/* </ProtectedRoute> */}
    //         </Suspense>
    //     ),
    // },
    // {
    //     path: "/programmes/NADI4U",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             {/* <ProtectedRoute requiredPermission=""> */}
    //             <ProgrammeNADI4U />
    //             {/* </ProtectedRoute> */}
    //         </Suspense>
    //     ),
    // },
    // {
    //     path: "/programmes/NADI2U",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             {/* <ProtectedRoute requiredPermission=""> */}
    //             <ProgrammeNADI2U />
    //             {/* </ProtectedRoute> */}
    //         </Suspense>
    //     ),
    // },
    // {
    //     path: "/programmes/others",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             {/* <ProtectedRoute requiredPermission=""> */}
    //             <ProgrammeSettings />
    //             {/* </ProtectedRoute> */}
    //         </Suspense>
    //     ),
    // },
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
