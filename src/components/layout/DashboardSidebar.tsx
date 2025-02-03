import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { SidebarMenuSection } from "./sidebar/SidebarMenuSection";
import { menuGroups } from "@/utils/menu-groups";

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarMenuSection
            key={group.label}
            label={group.label}
            items={group.items}
          />
        ))}
      </SidebarContent>
    </Sidebar>
  );
};