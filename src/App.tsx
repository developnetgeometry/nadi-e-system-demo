
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loading } from "@/components/layout/Loading";

// Lazily load pages for better initial loading performance
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Login = lazy(() => import("@/pages/auth/Login"));
const AccessControl = lazy(() => import("@/pages/dashboard/AccessControl"));
const Settings = lazy(() => import("@/pages/dashboard/Settings"));
const Profile = lazy(() => import("@/pages/dashboard/Profile"));
const Landing = lazy(() => import("@/pages/Landing"));
const Organizations = lazy(() => import("@/pages/dashboard/Organizations"));
const UIComponents = lazy(() => import("@/pages/UIComponents"));
const Users = lazy(() => import("@/pages/dashboard/Users"));
const UserGroups = lazy(() => import("@/pages/dashboard/UserGroups"));
const Notifications = lazy(() => import("@/pages/dashboard/Notifications"));
const Holidays = lazy(() => import("@/pages/dashboard/Holidays"));
const Employees = lazy(() => import("@/pages/dashboard/hr/Employees"));
const StaffDetails = lazy(() => import("@/pages/dashboard/hr/StaffDetails"));

// Auth Guards
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/components" element={<UIComponents />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/access-control" element={<ProtectedRoute><AccessControl /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard/organizations" element={<ProtectedRoute><Organizations /></ProtectedRoute>} />
        <Route path="/dashboard/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/dashboard/user-groups" element={<ProtectedRoute><UserGroups /></ProtectedRoute>} />
        <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/dashboard/holidays" element={<ProtectedRoute><Holidays /></ProtectedRoute>} />
        <Route path="/dashboard/hr/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
        <Route path="/dashboard/hr/staff/:staffId" element={<ProtectedRoute><StaffDetails /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}

export default App;
