import { MenuItem } from "@/types/menu";
import { getAccordionIcon } from "./sidebar-icons";
import {
  menuItems,
  hrMenuItems,
  posMenuItems,
  claimItems,
  assetItems,
  financeItems,
  programmesItems,
  reportItems,
  workflowItems,
  memberManagementItems,
  serviceModuleItems,
  communityItems,
  financialItems,
  complianceItems,
  siteManagementItems,
  inventoryItems,
  dashboardItems,
  nadiDashboardItems,
  iotDashboardItems,
  announcementsItems,
  takwimItems,
  bookingItems,
} from "@/components/layout/sidebar/menu-items";

export const menuGroups = [
  {
    label: "Admin Console",
    route: "/admin",
    items: menuItems,
  },
  {
    label: "Dashboard",
    route: "/dashboard",
    items: dashboardItems,
  },
  {
    label: "Nadi Dashboard",
    route: "/nadi-dashboard",
    items: nadiDashboardItems,
  },
  {
    label: "IoT Dashboard",
    route: "/iot-dashboard",
    items: iotDashboardItems,
  },
  {
    label: "Site Management",
    route: "/site-management",
    items: siteManagementItems,
  },

  {
    label: "Member Management",
    route: "/member",
    items: memberManagementItems,
  },
  {
    label: "POS Management",
    route: "/pos",
    items: posMenuItems,
  },
  {
    label: "Asset Management",
    route: "/asset",
    items: assetItems,
  },
  {
    label: "Inventory Management",
    route: "/invetory",
    items: inventoryItems,
  },
  {
    label: "Maintainance Management",
    route: "/maintainance",
    items: serviceModuleItems,
  },
  {
    label: "Human Resource Management",
    route: "/hr",
    items: hrMenuItems,
  },
  {
    label: "Finance Management",
    route: "/finance",
    items: financeItems,
  },
  {
    label: "Financial Management",
    route: "/financial",
    items: financialItems,
  },
  {
    label: "Programmes Management",
    route: "/programmes",
    items: programmesItems,
  },
  {
    label: "Claim Management",
    route: "/claim",
    items: claimItems,
  },
  {
    label: "Reports",
    route: "/report",
    items: reportItems,
  },
  {
    label: "Community",
    route: "/community",
    items: communityItems,
  },
  {
    label: "Compliance",
    route: "/compliance",
    items: complianceItems,
  },
  {
    label: "Workflow Management",
    route: "/workflow",
    items: workflowItems,
  },
  {
    label: "Service Module",
    route: "/services",
    items: serviceModuleItems,
  },
  {
    label: "Announcements",
    route: "/announcements",
    items: announcementsItems,
  },
  {
    label: "Takwim",
    route: "/takwim",
    items: takwimItems,
  },

  {
    label: "Booking Management",
    route: "/booking",
    items: bookingItems,
  },
  // {
  //   label: "PC Booking Management",
  //   route: "/programmes",
  //   items: programmesItems,
  // },
  // {
  //   label: "Health",
  //   route: "/health",
  //   // items: healthItems,
  //   items: programmesItems,
  // },
  // {
  //   label: "Docket Status",
  //   route: "/docket-status",
  //   // items: docketStatusItems,
  //   items: programmesItems,
  // },
  // {
  //   label: "Technician",
  //   route: "/technician",
  //   // items: technicianItems,
  //   items: programmesItems,
  // },
  // {
  //   label: "Attendance Module",
  //   route: "/attendance",
  //   // items: iotItems,
  //   items: programmesItems,
  // },
];
