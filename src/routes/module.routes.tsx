import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import HRDashboard from "@/pages/dashboard/hr/HRDashboard";
import Employees from "@/pages/dashboard/hr/Employees";
import Attendance from "@/pages/dashboard/hr/Attendance";
import Leave from "@/pages/dashboard/hr/Leave";
import POSDashboard from "@/pages/dashboard/pos/POSDashboard";
import Products from "@/pages/dashboard/pos/Products";
import POSTransactions from "@/pages/dashboard/pos/Transactions";
import ClaimDashboard from "@/pages/dashboard/claim/ClaimDashboard";
import ClaimSettings from "@/pages/dashboard/claim/ClaimSettings";
import AssetDashboard from "@/pages/dashboard/asset/AssetDashboard";
import AssetSettings from "@/pages/dashboard/asset/AssetSettings";
import FinanceDashboard from "@/pages/dashboard/finance/FinanceDashboard";
import FinanceSettings from "@/pages/dashboard/finance/FinanceSettings";
import ProgrammesDashboard from "@/pages/dashboard/programmes/ProgrammesDashboard";
import ProgrammeSettings from "@/pages/dashboard/programmes/ProgrammeSettings";
import ServiceInfo from "@/pages/dashboard/services/ServiceInfo";
import ServiceTransactions from "@/pages/dashboard/services/Transactions";
import CommunityDashboard from "@/pages/dashboard/community/CommunityDashboard";
import CommunityModeration from "@/pages/dashboard/community/CommunityModeration";
import Wallet from "@/pages/dashboard/financial/Wallet";
import FinancialTransactions from "@/pages/dashboard/financial/Transactions";
import AuditLogs from "@/pages/dashboard/compliance/AuditLogs";
import ComplianceReports from "@/pages/dashboard/compliance/ComplianceReports";
import WorkflowDashboard from "@/pages/dashboard/workflow/WorkflowDashboard";

export const moduleRoutes: RouteObject[] = [
  // HR Routes
  {
    path: "/dashboard/hr",
    element: <ProtectedRoute requiredPermission="view_hr_dashboard"><HRDashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/hr/employees",
    element: <ProtectedRoute requiredPermission="manage_employees"><Employees /></ProtectedRoute>,
  },
  {
    path: "/dashboard/hr/attendance",
    element: <ProtectedRoute requiredPermission="manage_attendance"><Attendance /></ProtectedRoute>,
  },
  {
    path: "/dashboard/hr/leave",
    element: <ProtectedRoute requiredPermission="manage_leave"><Leave /></ProtectedRoute>,
  },
  // POS Routes
  {
    path: "/dashboard/pos",
    element: <ProtectedRoute requiredPermission="view_pos_dashboard"><POSDashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/pos/products",
    element: <ProtectedRoute requiredPermission="manage_products"><Products /></ProtectedRoute>,
  },
  {
    path: "/dashboard/pos/transactions",
    element: <ProtectedRoute requiredPermission="view_pos_transactions"><POSTransactions /></ProtectedRoute>,
  },
  // Claim Routes
  {
    path: "/dashboard/claim",
    element: <ProtectedRoute requiredPermission="view_claims"><ClaimDashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/claim/settings",
    element: <ProtectedRoute requiredPermission="manage_claim_settings"><ClaimSettings /></ProtectedRoute>,
  },
  // Asset Routes
  {
    path: "/dashboard/asset",
    element: <ProtectedRoute requiredPermission="view_assets"><AssetDashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/asset/settings",
    element: <ProtectedRoute requiredPermission="manage_asset_settings"><AssetSettings /></ProtectedRoute>,
  },
  // Finance Routes
  {
    path: "/dashboard/finance",
    element: <ProtectedRoute requiredPermission="view_finance"><FinanceDashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/finance/settings",
    element: <ProtectedRoute requiredPermission="manage_finance_settings"><FinanceSettings /></ProtectedRoute>,
  },
  // Programmes Routes
  {
    path: "/dashboard/programmes",
    element: <ProtectedRoute requiredPermission="view_programmes"><ProgrammesDashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/programmes/settings",
    element: <ProtectedRoute requiredPermission="manage_programme_settings"><ProgrammeSettings /></ProtectedRoute>,
  },
  // Service Routes
  {
    path: "/dashboard/services/info",
    element: <ProtectedRoute requiredPermission="view_services"><ServiceInfo /></ProtectedRoute>,
  },
  {
    path: "/dashboard/services/transactions",
    element: <ProtectedRoute requiredPermission="view_service_transactions"><ServiceTransactions /></ProtectedRoute>,
  },
  // Community Routes
  {
    path: "/dashboard/community",
    element: <ProtectedRoute requiredPermission="view_community"><CommunityDashboard /></ProtectedRoute>,
  },
  {
    path: "/dashboard/community/moderation",
    element: <ProtectedRoute requiredPermission="moderate_community"><CommunityModeration /></ProtectedRoute>,
  },
  // Financial Routes
  {
    path: "/dashboard/financial/wallet",
    element: <ProtectedRoute requiredPermission="view_wallet"><Wallet /></ProtectedRoute>,
  },
  {
    path: "/dashboard/financial/transactions",
    element: <ProtectedRoute requiredPermission="view_financial_transactions"><FinancialTransactions /></ProtectedRoute>,
  },
  // Compliance Routes
  {
    path: "/dashboard/compliance/audit",
    element: <ProtectedRoute requiredPermission="view_audit_logs"><AuditLogs /></ProtectedRoute>,
  },
  {
    path: "/dashboard/compliance/reports",
    element: <ProtectedRoute requiredPermission="view_compliance_reports"><ComplianceReports /></ProtectedRoute>,
  },
  // Workflow Routes
  {
    path: "/dashboard/workflow",
    element: <ProtectedRoute requiredPermission="manage_workflows"><WorkflowDashboard /></ProtectedRoute>,
  },
];