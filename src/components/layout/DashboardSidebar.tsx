import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { SidebarAccordion } from "./sidebar/SidebarAccordion";
import { menuGroups } from "@/utils/menu-groups";

export const DashboardSidebar = () => {
  return (
    <Sidebar className="border-r border-border bg-sidebar-background">
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