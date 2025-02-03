import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { SidebarAccordion } from "./sidebar/SidebarAccordion";
import { menuGroups } from "@/utils/menu-groups";

export const DashboardSidebar = () => {
  return (
    <Sidebar className="border-r border-border bg-sidebar-background h-screen flex flex-col">
      <div className="p-4 border-b border-border flex-shrink-0">
        <h1 className="nadi-gradient-text">NADI</h1>
      </div>
      <SidebarContent className="p-4 flex-1 overflow-y-auto scrollbar-none">
        {menuGroups.map((group) => (
          <SidebarAccordion
            key={group.label}
            label={group.label}
            items={group.items}
          />
        ))}
      </SidebarContent>
    </Sidebar>
  );
};