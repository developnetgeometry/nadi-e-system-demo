
import { SidebarAccordion } from "./SidebarAccordion";
import { menuGroups } from "@/utils/menu-groups";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { MenuVisibility } from "@/components/settings/types/menu-visibility.types";
import { UserType } from "@/types/auth";

interface UserRoleResponse {
  roles: {
    name: string;
  };
}

export const SidebarContent = () => {
  const { user } = useAuth();
  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility[]>([]);
  const [userType, setUserType] = useState<UserType | null>(null);

  // Fetch menu visibility settings
  useEffect(() => {
    const fetchMenuVisibility = async () => {
      const { data, error } = await supabase
        .from('menu_visibility')
        .select('*');
      
      if (error) {
        console.error('Error fetching menu visibility:', error);
        return;
      }
      
      setMenuVisibility(data || []);
    };

    fetchMenuVisibility();
  }, []);

  // Fetch user's role/type
  useEffect(() => {
    const fetchUserType = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      // Type assertion to ensure proper typing
      const roleData = data as UserRoleResponse;
      if (roleData?.roles?.name) {
        setUserType(roleData.roles.name as UserType);
      }
    };

    fetchUserType();
  }, [user]);

  // Filter menu groups based on visibility settings
  const visibleMenuGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      // Find visibility setting for this menu item
      const visibility = menuVisibility.find(v => 
        v.menu_key === item.path || 
        v.menu_key === `/${item.path.split('/')[1]}`  // Check main route
      );

      // If no visibility setting found, show by default
      if (!visibility) return true;

      // If user type not found, hide item
      if (!userType) return false;

      // Check if user type is in the visible_to array
      return visibility.visible_to.includes(userType);
    })
  })).filter(group => group.items.length > 0); // Remove empty groups

  return (
    <>
      {visibleMenuGroups.map((group) => (
        <SidebarAccordion
          key={group.label}
          label={group.label}
          items={group.items}
        />
      ))}
    </>
  );
};
