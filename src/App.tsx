import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Dashboard from "@/pages/dashboard/Dashboard";
import Profile from "@/pages/dashboard/Profile";
import Settings from "@/pages/dashboard/Settings";
import Users from "@/pages/dashboard/Users";
import Roles from "@/pages/dashboard/Roles";
import AccessControl from "@/pages/dashboard/AccessControl";
import Activity from "@/pages/dashboard/Activity";
import Notifications from "@/pages/dashboard/Notifications";
import Calendar from "@/pages/dashboard/Calendar";
import PersonalDetails from "@/pages/dashboard/members/PersonalDetails";
import Registration from "@/pages/dashboard/members/Registration";
import ActivityLogs from "@/pages/dashboard/members/ActivityLogs";
import HRDashboard from "@/pages/dashboard/hr/HRDashboard";
import Employees from "@/pages/dashboard/hr/Employees";
import Attendance from "@/pages/dashboard/hr/Attendance";
import Leave from "@/pages/dashboard/hr/Leave";
import POSDashboard from "@/pages/dashboard/pos/POSDashboard";
import Products from "@/pages/dashboard/pos/Products";
import Transactions from "@/pages/dashboard/pos/Transactions";
import ClaimDashboard from "@/pages/dashboard/claim/ClaimDashboard";
import ClaimSettings from "@/pages/dashboard/claim/ClaimSettings";
import AssetDashboard from "@/pages/dashboard/asset/AssetDashboard";
import AssetSettings from "@/pages/dashboard/asset/AssetSettings";
import FinanceDashboard from "@/pages/dashboard/finance/FinanceDashboard";
import FinanceSettings from "@/pages/dashboard/finance/FinanceSettings";
import ProgrammesDashboard from "@/pages/dashboard/programmes/ProgrammesDashboard";
import ProgrammeSettings from "@/pages/dashboard/programmes/ProgrammeSettings";
import Reports from "@/pages/dashboard/Reports";
import UsageSessions from "@/pages/dashboard/UsageSessions";
import WorkflowDashboard from "@/pages/dashboard/workflow/WorkflowDashboard";
import AuditLogs from "@/pages/dashboard/compliance/AuditLogs";
import ComplianceReports from "@/pages/dashboard/compliance/ComplianceReports";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServiceInfo from "@/pages/dashboard/services/ServiceInfo";
import ServiceTransactions from "@/pages/dashboard/services/Transactions";
import CommunityDashboard from "@/pages/dashboard/community/CommunityDashboard";
import CommunityModeration from "@/pages/dashboard/community/CommunityModeration";
import FinancialWallet from "@/pages/dashboard/financial/Wallet";
import FinancialTransactions from "@/pages/dashboard/financial/Transactions";

// Initialize QueryClient outside of component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/roles" element={<Roles />} />
            <Route path="/dashboard/access-control" element={<AccessControl />} />
            <Route path="/dashboard/activity" element={<Activity />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />
            <Route path="/dashboard/calendar" element={<Calendar />} />
            {/* Member Management Routes */}
            <Route path="/dashboard/members/details" element={<PersonalDetails />} />
            <Route path="/dashboard/members/registration" element={<Registration />} />
            <Route path="/dashboard/members/activity" element={<ActivityLogs />} />
            {/* HR Module Routes */}
            <Route path="/dashboard/hr" element={<HRDashboard />} />
            <Route path="/dashboard/hr/employees" element={<Employees />} />
            <Route path="/dashboard/hr/attendance" element={<Attendance />} />
            <Route path="/dashboard/hr/leave" element={<Leave />} />
            {/* POS Module Routes */}
            <Route path="/dashboard/pos" element={<POSDashboard />} />
            <Route path="/dashboard/pos/products" element={<Products />} />
            <Route path="/dashboard/pos/transactions" element={<Transactions />} />
            {/* Management Module Routes */}
            <Route path="/dashboard/claim" element={<ClaimDashboard />} />
            <Route path="/dashboard/claim/settings" element={<ClaimSettings />} />
            <Route path="/dashboard/asset" element={<AssetDashboard />} />
            <Route path="/dashboard/asset/settings" element={<AssetSettings />} />
            <Route path="/dashboard/finance" element={<FinanceDashboard />} />
            <Route path="/dashboard/finance/settings" element={<FinanceSettings />} />
            <Route path="/dashboard/programmes" element={<ProgrammesDashboard />} />
            <Route path="/dashboard/programmes/settings" element={<ProgrammeSettings />} />
            <Route path="/dashboard/reports" element={<Reports />} />
            <Route path="/dashboard/usage-sessions" element={<UsageSessions />} />
            {/* Workflow Management Routes */}
            <Route path="/dashboard/workflow" element={<WorkflowDashboard />} />
            {/* Compliance Routes */}
            <Route path="/dashboard/compliance/audit" element={<AuditLogs />} />
            <Route path="/dashboard/compliance/reports" element={<ComplianceReports />} />
            {/* Service Module Routes */}
            <Route path="/dashboard/services/info" element={<ServiceInfo />} />
            <Route path="/dashboard/services/transactions" element={<ServiceTransactions />} />
            {/* Community Routes */}
            <Route path="/dashboard/community" element={<CommunityDashboard />} />
            <Route path="/dashboard/community/moderation" element={<CommunityModeration />} />
            {/* Financial Routes */}
            <Route path="/dashboard/financial/wallet" element={<FinancialWallet />} />
            <Route path="/dashboard/financial/transactions" element={<FinancialTransactions />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}