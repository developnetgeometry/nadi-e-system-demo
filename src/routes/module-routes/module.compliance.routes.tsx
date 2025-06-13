import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const ActivityLogsPage = lazy(() => import("@/pages/dashboard/compliance/ActivityLogs"));
const AuditLogsPage = lazy(() => import("@/pages/dashboard/compliance/AuditLogs"));
const ComplianceReportsPage = lazy(() => import("@/pages/dashboard/compliance/ComplianceReports"));

export const complianceRoutes = [
  // Compliance Routes
  {
    path: "/compliance/activity",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission="view_audit_logs"> */}
        <ActivityLogsPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/compliance/audit",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission="view_audit_logs"> */}
        <AuditLogsPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
  {
    path: "/compliance/reports",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <ProtectedRoute requiredPermission="view_compliance_reports"> */}
        <ComplianceReportsPage />
        {/* </ProtectedRoute> */}
      </Suspense>
    ),
  },
];

export const ComplianceRoutes = () => {
  return (
    <Routes>
      {complianceRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};
