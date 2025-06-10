import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


const CommunityDashboardPage = lazy(() => import("@/pages/dashboard/community/CommunityDashboard"));
const CommunityModerationPage = lazy(() => import("@/pages/dashboard/community/CommunityModeration"));

export const communityRoutes = [
    {
        path: "/community",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <CommunityDashboardPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/community/moderation",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <CommunityModerationPage />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
];

export const CommunityRoutes = () => {
    return (
        <Routes>
            {communityRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};
