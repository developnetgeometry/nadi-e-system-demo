import { SidebarAccordion } from "./SidebarAccordion";
import { menuGroups } from "@/utils/menu-groups";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useMenuVisibility } from "./hooks/useMenuVisibility";
import { filterMenuGroups } from "./utils/menuFilters";
import { SidebarLoading } from "./SidebarLoading";

interface SidebarContentProps {
  state: string; // Pass state as a prop
  isCollapsed: boolean; // Pass isCollapsed as a prop
}

export const SidebarContent = ({ state, isCollapsed }: SidebarContentProps) => {
  const { user } = useAuth();
  const { menuVisibility, submoduleVisibility, userType, loading } =
    useMenuVisibility(user?.id);

  // Debug logging to check what's being applied
  useEffect(() => {
    if (userType) {
      console.log("Current user type:", userType);
      console.log("Menu visibility settings:", menuVisibility);
      console.log("Submodule visibility settings:", submoduleVisibility);
    }
  }, [userType, menuVisibility, submoduleVisibility]);

  // Filter menu groups based on visibility settings and user role
  const visibleMenuGroups = filterMenuGroups(
    menuGroups,
    userType,
    menuVisibility,
    submoduleVisibility
  );

  if (loading) {
    return <SidebarLoading />;
  }

  return (
    <>
      {visibleMenuGroups.map((group) => (
        <SidebarAccordion
          key={group.label}
          label={group.label}
          items={group.items}
          state={state} // Pass state
          isCollapsed={isCollapsed} // Pass isCollapsed
        />
      ))}
    </>
  );
};