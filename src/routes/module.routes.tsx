import { RouteObject } from "react-router-dom";
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
import WorkflowDashboard from "@/pages/dashboard/workflow/WorkflowDashboard";
import ServiceInfo from "@/pages/dashboard/services/ServiceInfo";
import ServiceTransactions from "@/pages/dashboard/services/Transactions";
import CommunityDashboard from "@/pages/dashboard/community/CommunityDashboard";
import CommunityModeration from "@/pages/dashboard/community/CommunityModeration";
import FinancialWallet from "@/pages/dashboard/financial/Wallet";
import FinancialTransactions from "@/pages/dashboard/financial/Transactions";
import AuditLogs from "@/pages/dashboard/compliance/AuditLogs";
import ComplianceReports from "@/pages/dashboard/compliance/ComplianceReports";

export const moduleRoutes: RouteObject[] = [
  // HR Routes
  {
    path: "/dashboard/hr",
    element: <HRDashboard />,
  },
  {
    path: "/dashboard/hr/employees",
    element: <Employees />,
  },
  {
    path: "/dashboard/hr/attendance",
    element: <Attendance />,
  },
  {
    path: "/dashboard/hr/leave",
    element: <Leave />,
  },
  // POS Routes
  {
    path: "/dashboard/pos",
    element: <POSDashboard />,
  },
  {
    path: "/dashboard/pos/products",
    element: <Products />,
  },
  {
    path: "/dashboard/pos/transactions",
    element: <Transactions />,
  },
  // Claim Routes
  {
    path: "/dashboard/claim",
    element: <ClaimDashboard />,
  },
  {
    path: "/dashboard/claim/settings",
    element: <ClaimSettings />,
  },
  // Asset Routes
  {
    path: "/dashboard/asset",
    element: <AssetDashboard />,
  },
  {
    path: "/dashboard/asset/settings",
    element: <AssetSettings />,
  },
  // Finance Routes
  {
    path: "/dashboard/finance",
    element: <FinanceDashboard />,
  },
  {
    path: "/dashboard/finance/settings",
    element: <FinanceSettings />,
  },
  // Programmes Routes
  {
    path: "/dashboard/programmes",
    element: <ProgrammesDashboard />,
  },
  {
    path: "/dashboard/programmes/settings",
    element: <ProgrammeSettings />,
  },
  // Workflow Routes
  {
    path: "/dashboard/workflow",
    element: <WorkflowDashboard />,
  },
  // Service Routes
  {
    path: "/dashboard/services/info",
    element: <ServiceInfo />,
  },
  {
    path: "/dashboard/services/transactions",
    element: <ServiceTransactions />,
  },
  // Community Routes
  {
    path: "/dashboard/community",
    element: <CommunityDashboard />,
  },
  {
    path: "/dashboard/community/moderation",
    element: <CommunityModeration />,
  },
  // Financial Routes
  {
    path: "/dashboard/financial/wallet",
    element: <FinancialWallet />,
  },
  {
    path: "/dashboard/financial/transactions",
    element: <FinancialTransactions />,
  },
  // Compliance Routes
  {
    path: "/dashboard/compliance/audit",
    element: <AuditLogs />,
  },
  {
    path: "/dashboard/compliance/reports",
    element: <ComplianceReports />,
  },
];