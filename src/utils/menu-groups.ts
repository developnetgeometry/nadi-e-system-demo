import { MenuGroup } from "@/types/menu";
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
} from "@/components/layout/sidebar/menu-items";

export const menuGroups: MenuGroup[] = [
  {
    label: "Admin Console",
    items: menuItems,
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
    label: "Compliance",
    items: complianceItems,
  },
];