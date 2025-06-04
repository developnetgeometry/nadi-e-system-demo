import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Convert to lazy loaded components
const FinanceDashboard = lazy(() => import("@/pages/dashboard/finance/FinanceDashboard"));
const FinanceSettings = lazy(() => import("@/pages/dashboard/finance/FinanceSettings"));

export const financeRoutes = [
    {
        path: "/finance",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <FinanceDashboard />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/finance/settings",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <FinanceSettings />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    // {
    //     path: "/finance/revenue-expenses",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             {/* <ProtectedRoute requiredPermission=""> */}
    //             <FinanceRevExp />
    //             {/* </ProtectedRoute> */}
    //         </Suspense>
    //     ),
    // },
    // {
    //     path: "/finance/einvoices",
    //     element: (
    //         <Suspense fallback={<LoadingSpinner />}>
    //             {/* <ProtectedRoute requiredPermission=""> */}
    //             <FinanceInvoice />
    //             {/* </ProtectedRoute> */}
    //         </Suspense>
    //     ),
    // },
];

export const FinanceRoutes = () => {
    return (
        <Routes>
            {financeRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};
