import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { SidebarAccordion } from "./sidebar/SidebarAccordion";
import { menuGroups } from "@/utils/menu-groups";

export const DashboardSidebar = () => {
  return (
    <Sidebar className="border-r border-border bg-sidebar-background">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">NADI</h1>
      </div>
      <SidebarContent className="p-4">
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