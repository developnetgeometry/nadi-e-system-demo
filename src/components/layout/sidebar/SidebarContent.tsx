
import { SidebarAccordion } from "./SidebarAccordion";
import { menuGroups } from "@/utils/menu-groups";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { MenuVisibility, SubmoduleVisibility } from "@/components/settings/types/menu-visibility.types";
import { UserType } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";

interface UserRoleResponse {
  roles: {
    name: string;
  }[];
}

export const SidebarContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility[]>([]);
  const [submoduleVisibility, setSubmoduleVisibility] = useState<SubmoduleVisibility[]>([]);
  const [userType, setUserType] = useState<UserType | null>(null);

  // Fetch menu visibility settings
  useEffect(() => {
    const fetchVisibilitySettings = async () => {
      // Fetch menu visibility
      const { data: menuData, error: menuError } = await supabase
        .from('menu_visibility')
        .select('*');
      
      if (menuError) {
        console.error('Error fetching menu visibility:', menuError);
        return;
      }
      
      setMenuVisibility(menuData || []);

      // Fetch submodule visibility
      const { data: submoduleData, error: submoduleError } = await supabase
        .from('submodule_visibility')
        .select('*');
      
      if (submoduleError) {
        console.error('Error fetching submodule visibility:', submoduleError);
        return;
      }
      
      setSubmoduleVisibility(submoduleData || []);
    };

    fetchVisibilitySettings();
  }, []);

  // Fetch user's role/type
  useEffect(() => {
    const fetchUserType = async () => {
      if (!user?.id) return;

      // First try to get the user profile to check the user_type
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData?.user_type) {
        console.log('Setting user type from profile:', profileData.user_type);
        setUserType(profileData.user_type as UserType);
        return;
      }

      // Fallback to user_roles if profile check fails
      const { data, error } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        toast({
          title: "Error",
          description: "Could not fetch user permissions",
          variant: "destructive",
        });
        return;
      }

      const roleData = data as UserRoleResponse;
      if (roleData?.roles?.[0]?.name) {
        console.log('Setting user type from roles:', roleData.roles[0].name);
        setUserType(roleData.roles[0].name as UserType);
      }
    };

    fetchUserType();
  }, [user, toast]);

  // Filter menu groups based on visibility settings and user role
  const visibleMenuGroups = menuGroups.map(group => {
    // First check if user has access to the main menu group
    const groupVisibility = menuVisibility.find(v => v.menu_key === group.label);
    const isGroupVisible = !groupVisibility || 
                           !userType ||
                           groupVisibility.visible_to.includes(userType) ||
                           groupVisibility.visible_to.includes('super_admin');

    if (!isGroupVisible) {
      return { ...group, items: [] };
    }

    // If group is visible, filter its items
    return {
      ...group,
      items: group.items.filter(item => {
        // Find visibility setting for this menu item
        const itemVisibility = submoduleVisibility.find(v => 
          v.parent_module === group.label && v.submodule_key === item.title
        );

      // If no visibility setting found or no user type, hide item
      if (!visibility || !userType) {
        console.log(`No visibility setting found for ${item.path} or no user type`);
        return false;
      }

      // Check if user type is in the visible_to array
      const isVisible = visibility.visible_to.includes(userType);
      console.log(`Menu item ${item.path} visibility for ${userType}:`, isVisible);
      return isVisible;
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
