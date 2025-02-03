import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { SidebarMenuSection } from "./sidebar/SidebarMenuSection";
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
} from "./sidebar/menu-items";

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenuSection label="Admin Console" items={menuItems} />
        <SidebarMenuSection label="Member Management" items={memberManagementItems} />
        <SidebarMenuSection label="Service Module" items={serviceModuleItems} />
        <SidebarMenuSection label="Community" items={communityItems} />
        <SidebarMenuSection label="Financial" items={financialItems} />
        <SidebarMenuSection label="HR Management" items={hrMenuItems} />
        <SidebarMenuSection label="POS Management" items={posMenuItems} />
        <SidebarMenuSection label="Claim Management" items={claimItems} />
        <SidebarMenuSection label="Asset Management" items={assetItems} />
        <SidebarMenuSection label="Finance Management" items={financeItems} />
        <SidebarMenuSection label="Programmes Management" items={programmesItems} />
        <SidebarMenuSection label="Report Management" items={reportItems} />
        <SidebarMenuSection label="Workflow Management" items={workflowItems} />
        <SidebarMenuSection label="Compliance" items={complianceItems} />
      </SidebarContent>
    </Sidebar>
  );
};