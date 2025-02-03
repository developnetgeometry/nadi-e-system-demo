import { SidebarAccordion } from "./SidebarAccordion";
import { menuGroups } from "@/utils/menu-groups";

export const SidebarContent = () => {
  return (
    <>
      {menuGroups.map((group) => (
        <SidebarAccordion
          key={group.label}
          label={group.label}
          items={group.items}
        />
      ))}
    </>
  );
};