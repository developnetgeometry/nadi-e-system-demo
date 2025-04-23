import { MenuItem } from "@/types/menu";

export const menuItems = [
  { title: "Dashboard", path: "/admin/dashboard" },
  { title: "User Management", path: "/admin/users" },
  { title: "User Groups", path: "/admin/user-groups" },
  { title: "Roles & Permissions", path: "/admin/roles" },
  { title: "Menu Visibility", path: "/admin/menu-visibility" },
  { title: "Activity Log", path: "/admin/activity" },
  {
    title: "State Holidays",
    path: "/admin/state-holidays",
    visibleTo: ["super_admin"],
  },
  { title: "Notifications", path: "/admin/notifications" },
  { title: "Organizations", path: "/admin/organizations" },
  { title: "Settings", path: "/admin/settings" },
];

export const hrMenuItems = [
  { title: "HR Dashboard", path: "/hr" },
  { title: "HR Settings", path: "/under-development" },
  { title: "Staff Management", path: "/hr/employees" },
  { title: "Site Staff Management", path: "/hr/site-staff" },
  { title: "Leave Management", path: "/hr/leave" },
  { title: "Attendance", path: "/hr/attendance" },
  { title: "Staff Training", path: "/hr/staff-training" },
  { title: "Payroll", path: "/hr/payroll" },
];

export const posMenuItems = [
  { title: "POS Dashboard", path: "/pos" },
  { title: "Products", path: "/pos/products" },
  { title: "Transactions", path: "/pos/transactions" },
  { title: "PUDO", path: "/pos/pudo" },
];

export const claimItems = [
  { title: "Claims Dashboard", path: "/claim" },
  { title: "Claims Settings", path: "/claim/settings" },
  { title: "Registration", path: "/claim/registration" },
  { title: "List Record", path: "/claim/list-record" },
  { title: "Reports", path: "/claim/report" },
];

export const assetItems = [
  { title: "Asset Dashboard", path: "/asset" },
  { title: "Asset Settings", path: "/asset/settings" },
  { title: "Asset Registration", path: "/asset/registration" },
  { title: "Asset Performance", path: "/asset/performance" },
  { title: "Asset Maintenance", path: "/asset/maintenance" },
];

export const inventoryItems = [
  { title: "Inventory Dashboard", path: "/inventory" },
  { title: "Inventory Settings", path: "/inventory/settings" },
];

export const financeItems = [
  { title: "Finance Dashboard", path: "/finance" },
  { title: "Finance Settings", path: "/finance/settings" },
  { title: "Revenue & Expenses", path: "/finance/revenue-expenses" },
  { title: "E-Invoices", path: "/finance/e-invoice" },
];

export const programmesItems = [
  { title: "Programmes Dashboard", path: "/programmes" },
  { title: "Programmes Settings", path: "/programmes/settings" },
  { title: "Registration", path: "/programmes/registration" },
  { title: "Smart Services NADI4U", path: "/programmes/nadi4u" },
  { title: "Smart Services NADI2U", path: "/programmes/nadi2u" },
  { title: "Others", path: "/programmes/others" },
];

export const reportItems = [
  { title: "Reports Dashboard", path: "/report/dashboard" },
  { title: "Usage Sessions", path: "/report/usage-sessions" },
  { title: "Internet Access", path: "/report/internet-access" },
  { title: "Preset Reports", path: "/report/preset-reports" },
  { title: "Custom Reports", path: "/report/custom-reports" },
];

export const workflowItems = [
  { title: "Workflow Configurations", path: "/workflow" },
];

export const memberManagementItems = [
  { title: "Member Management", path: "/dashboard/members" },
  { title: "Member Profile", path: "/dashboard/members/details" },
  { title: "Registration", path: "/dashboard/members/registration" },
  { title: "Activity Logs", path: "/dashboard/members/activity" },
];

export const serviceModuleItems = [
  { title: "Service Information", path: "/services/info" },
  { title: "Transactions", path: "/services/transactions" },
];

export const communityItems = [
  { title: "Community Dashboard", path: "/community" },
  { title: "Moderation", path: "/community/moderation" },
];

export const financialItems = [
  { title: "Wallet", path: "/financial/wallet" },
  { title: "Transactions", path: "/financial/transactions" },
];

export const complianceItems = [
  { title: "Audit Logs", path: "/compliance/audit" },

  { title: "System Reports", path: "/compliance/reports" },
];

export const siteManagementItems = [
  { title: "Site Management", path: "/site-management" },
  { title: "Site Profile", path: "/site" },
  { title: "Usage", path: "/site/usage" },
  { title: "Booking Management", path: "/site/booking-management" },
  { title: "NADI Closure", path: "/site/closure" },
  { title: "Insurance", path: "/site/insurance" },
  { title: "Inventory Management", path: "/site/inventory-management" },
  { title: "Utilities Billing", path: "/site/utilities-billing" },
  { title: "Vendor Management", path: "/site/vendor-management" },
  { title: "KPI Performance", path: "/site/kpi" },
  { title: "NMS", path: "/site/nms" },
];

export const dashboardItems = [
  { title: "Home", path: "/dashboard" },
  { title: "Membership", path: "/member" },
  { title: "Smart Services", path: "/smart-services" },
  { title: "Operation", path: "/operation" },
  { title: "Takwim", path: "/takwim" },
  { title: "Claim", path: "/claim" },
  { title: "Staff Summary", path: "/staff-summary" },
  { title: "Leave Summary", path: "/leave-summary" },
  { title: "Attendance", path: "/attendance" },
  { title: "Site Management", path: "/site-management" },
  { title: "Staff Training", path: "/staff-training" },
  { title: "Payroll", path: "/payroll" },
  { title: "Calendar", path: "/calendar" },
  { title: "Leave Application Summary", path: "/leave-application-summary" },
  { title: "Replacement Leave Summary", path: "/replacement-leave-summary" },
  { title: "Events", path: "/events" },
  { title: "Health", path: "/health" },
  { title: "PC Booking", path: "/pc-booking" },
  { title: "Upcoming Event", path: "/upcoming-event" },
  { title: "Participations", path: "/participation" },
  { title: "Event Breakdown", path: "/event-breakdown" },
  { title: "Docket Status", path: "/docket-status" },
  { title: "Technician", path: "/technician" },
  { title: "Graph", path: "/graph" },
];

export const nadiDashboardItems = [
  { title: "NADI Information", path: "/nadi-information" },
  { title: "Membership", path: "/membership" },
  { title: "Events", path: "/events" },
  { title: "Maps", path: "/maps" },
  { title: "NADI Location", path: "/nadi-location" },
  { title: "Operation Hour", path: "/operation-hour" },
  { title: "Service Provider", path: "/service-provider" },
  { title: "Contact Information", path: "/contact-information" },
  { title: "Others", path: "/others" },
];

export const iotDashboardItems = [
  { title: "Rain Gauge", path: "/iot-rain-gauge" },
  { title: "Temperature", path: "/iot-temperature" },
  { title: "Humidity", path: "/iot-humidity" },
  { title: "Pressure", path: "/iot-pressure" },
];
