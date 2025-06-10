import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


const TakwimPage = lazy(() => import("@/pages/dashboard/takwim/Takwim"));

export const takwimRoutes = [
  // Setup routes for the module
  {
    path: "/takwim",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/*<ProtectedRoute requiredPermission="view_site_details"> */}
        <TakwimPage />
        {/*</ProtectedRoute> */}
      </Suspense>
    ),
  },  
  // {
  //   path: "/takwim/settings",
  //   element: (
  //     <Suspense fallback={<LoadingSpinner />}>
  //       {/*<ProtectedRoute requiredPermission="view_site_details"> */}
  //       <TakwimSettings />
  //       {/*</ProtectedRoute> */}
  //     </Suspense>
  //   ),
  // },
];

export const TakwimRoutes = () => {
  return (
    <Routes>
      {takwimRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};
