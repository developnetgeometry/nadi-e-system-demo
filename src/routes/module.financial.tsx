import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Replace direct imports with lazy loading
const FinancialTransactions = lazy(() => import("@/pages/dashboard/financial/Transactions"));
const Wallet = lazy(() => import("@/pages/dashboard/financial/Wallet"));

export const financialRoutes = [
    {
        path: "/financial",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <FinancialTransactions />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/financial/wallet",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <Wallet />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
];

export const FinancialRoutes = () => {
    return (
        <Routes>
            {financialRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};
