
import { MenuGroup } from "@/types/menu";
import { MenuVisibility, SubmoduleVisibility } from "@/components/settings/types/menu-visibility.types";
import { UserType } from "@/types/auth";

export const filterMenuGroups = (
  menuGroups: MenuGroup[],
  userType: UserType | null,
  menuVisibility: MenuVisibility[],
  submoduleVisibility: SubmoduleVisibility[]
): MenuGroup[] => {
  if (!userType) {
    return []; // Don't show any menus if user type isn't determined yet
  }

  // If this is a super_admin, show everything
  if (userType === 'super_admin') {
    return menuGroups;
  }

  return menuGroups
    .filter(group => {
      // Find visibility setting for this menu group
      const groupVisibility = menuVisibility.find(v => v.menu_key === group.label);
      
      // If no visibility setting exists or user type is not in visible_to array, don't show this group
      if (!groupVisibility || !groupVisibility.visible_to.includes(userType)) {
        console.log(`Menu ${group.label} not visible to ${userType}`);
        return false;
      }

      // Check if any items in this group are visible to the user
      const hasVisibleItems = group.items.some(item => {
        const itemVisibility = submoduleVisibility.find(
          v => v.parent_module === group.label && v.submodule_key === item.title
        );

        // If no visibility setting exists for this item, it's visible by default if the parent is visible
        if (!itemVisibility) {
          return true;
        }

        // Check if user type is in the visible_to array
        return itemVisibility.visible_to.includes(userType);
      });

      return hasVisibleItems;
    })
    .map(group => {
      // Filter items within the group
      return {
        ...group,
        items: group.items.filter(item => {
          // If super_admin, show all items
          if (userType === 'super_admin') {
            return true;
          }

          // Find visibility setting for this menu item
          const itemVisibility = submoduleVisibility.find(
            v => v.parent_module === group.label && v.submodule_key === item.title
          );

          // If no visibility setting exists, it's visible by default if the parent is visible
          if (!itemVisibility) {
            return true;
          }

          // Check if user type is in the visible_to array
          const isVisible = itemVisibility.visible_to.includes(userType);
          if (!isVisible) {
            console.log(`Submodule ${item.title} not visible to ${userType}`);
          }
          return isVisible;
        })
      };
    });
};
