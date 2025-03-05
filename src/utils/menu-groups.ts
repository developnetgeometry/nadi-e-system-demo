
import { menuItems, hrMenuItems, posMenuItems, claimItems, assetItems, financeItems, programmesItems, reportItems, workflowItems, memberManagementItems, serviceModuleItems, communityItems, financialItems, complianceItems } from "./sidebar-icons";

export const menuGroups = [
  {
    label: "Admin Console",
    items: [
      { title: "Dashboard", icon: menuItems[0].icon, path: "/dashboard" },
      { title: "User Management", icon: menuItems[1].icon, path: "/dashboard/users" },
      { title: "Roles & Permissions", icon: menuItems[2].icon, path: "/dashboard/roles" },
      { title: "Organizations", icon: menuItems[1].icon, path: "/dashboard/organizations" },
      { title: "Access Control", icon: menuItems[3].icon, path: "/dashboard/access-control" },
      { title: "Menu Visibility", icon: menuItems[4].icon, path: "/dashboard/menu-visibility" },
      { title: "Activity Log", icon: menuItems[5].icon, path: "/dashboard/activity" },
      { title: "Reports", icon: menuItems[6].icon, path: "/dashboard/reports" },
      { title: "Calendar", icon: menuItems[7].icon, path: "/dashboard/calendar" },
      { title: "Notifications", icon: menuItems[8].icon, path: "/dashboard/notifications" },
      { title: "Settings", icon: menuItems[9].icon, path: "/dashboard/settings" },
    ],
  },
  {
    label: "HR Management",
    items: hrMenuItems,
  },
  {
    label: "POS Management",
    items: posMenuItems,
  },
  {
    label: "Claim Management",
    items: claimItems,
  },
  {
    label: "Asset Management",
    items: assetItems,
  },
  {
    label: "Finance Management",
    items: financeItems,
  },
  {
    label: "Programmes Management",
    items: programmesItems,
  },
  {
    label: "Report Management",
    items: reportItems,
  },
  {
    label: "Workflow Management",
    items: workflowItems,
  },
  {
    label: "Member Management",
    items: memberManagementItems,
  },
  {
    label: "Service Module",
    items: serviceModuleItems,
  },
  {
    label: "Community",
    items: communityItems,
  },
  {
    label: "Financial",
    items: financialItems,
  },
  {
    label: "Compliance",
    items: complianceItems,
  },
];
