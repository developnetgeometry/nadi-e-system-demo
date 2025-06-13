import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import POSDashboard from "@/pages/dashboard/pos/POSDashboard";
import Products from "@/pages/dashboard/pos/Products";
import POSTransactions from "@/pages/dashboard/pos/Transactions";
import POSSales from "@/pages/dashboard/pos/POSSales";
import POSPickupDropOff from "@/pages/dashboard/pos/POSPickupDropOff";

const POSDashboardPage = lazy(() => import("@/pages/dashboard/pos/POSDashboard"));
const ProductsPage = lazy(() => import("@/pages/dashboard/pos/Products"));
const POSTransactionsPage = lazy(() => import("@/pages/dashboard/pos/Transactions"));
const POSSalesPage = lazy(() => import("@/pages/dashboard/pos/POSSales"));
const POSPickupDropOffPage = lazy(() => import("@/pages/dashboard/pos/POSPickupDropOff"));


export const posRoutes = [
  {
    path: "/pos",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <POSDashboardPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/pos/products",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <ProductsPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/pos/transactions",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <POSTransactionsPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/pos/sales",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <POSSalesPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/pos/pudo",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission=""> */}
        <POSPickupDropOffPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
];

export const PosRoutes = () => {
  return (
    <Routes>
      {posRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};