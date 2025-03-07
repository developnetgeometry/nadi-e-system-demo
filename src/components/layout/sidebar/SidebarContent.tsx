
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
  const [loading, setLoading] = useState(true);

  // Fetch menu visibility settings
  useEffect(() => {
    const fetchVisibilitySettings = async () => {
      setLoading(true);
      try {
        // Fetch menu visibility
        const { data: menuData, error: menuError } = await supabase
          .from('menu_visibility')
          .select('*');
        
        if (menuError) {
          console.error('Error fetching menu visibility:', menuError);
          return;
        }
        
        console.log('Fetched menu visibility:', menuData);
        setMenuVisibility(menuData || []);

        // Fetch submodule visibility
        const { data: submoduleData, error: submoduleError } = await supabase
          .from('submodule_visibility')
          .select('*');
        
        if (submoduleError) {
          console.error('Error fetching submodule visibility:', submoduleError);
          return;
        }
        
        console.log('Fetched submodule visibility:', submoduleData);
        setSubmoduleVisibility(submoduleData || []);
      } catch (error) {
        console.error('Error in fetchVisibilitySettings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisibilitySettings();
  }, []);

  // Fetch user's role/type
  useEffect(() => {
    const fetchUserType = async () => {
      if (!user?.id) return;

      try {
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
      } catch (error) {
        console.error('Error in fetchUserType:', error);
      }
    };

    fetchUserType();
  }, [user, toast]);

  // Debug logging to check what's being applied
  useEffect(() => {
    if (userType) {
      console.log('Current user type:', userType);
      console.log('Menu visibility settings:', menuVisibility);
      console.log('Submodule visibility settings:', submoduleVisibility);
    }
  }, [userType, menuVisibility, submoduleVisibility]);

  // Filter menu groups based on visibility settings and user role
  const visibleMenuGroups = menuGroups.filter(group => {
    // If this is a super_admin, show everything
    if (userType === 'super_admin') {
      return true;
    }

    if (!userType) {
      return false; // Don't show any menus if user type isn't determined yet
    }

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
  }).map(group => {
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

  if (loading) {
    return <div className="p-4 text-center">Loading menu...</div>;
  }

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
