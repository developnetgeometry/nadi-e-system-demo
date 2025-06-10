import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


const WorkflowConfigurationPage = lazy(() => import("@/pages/dashboard/workflow/WorkflowConfiguration"));
const WorkflowDashboardPage = lazy(() => import("@/pages/dashboard/workflow/WorkflowDashboard"));


export const workflowRoutes = [
  // Setup routes for the module
  // Workflow Routes - Keep only configuration related routes
  {
    path: "/workflow",
    element: (
      // <ProtectedRoute requiredPermission="manage_workflows">
      <WorkflowDashboardPage />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/workflow/configuration",
    element: (
      // <ProtectedRoute requiredPermission="manage_workflow_configuration">
      <WorkflowConfigurationPage />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/workflow/configuration/:id",
    element: (
      // <ProtectedRoute requiredPermission="manage_workflow_configuration">
      <WorkflowConfigurationPage />
      // </ProtectedRoute>
    ),
  },
];

export const WorkflowRoutes = () => {
  return (
    <Routes>
      {workflowRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};
