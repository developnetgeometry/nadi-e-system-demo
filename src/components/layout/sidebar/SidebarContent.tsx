
import { SidebarAccordion } from "./SidebarAccordion";
import { menuGroups } from "@/utils/menu-groups";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { MenuVisibility } from "@/components/settings/types/menu-visibility.types";
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

  // Filter menu groups based on visibility settings
  const visibleMenuGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      // Find visibility setting for this menu item
      const visibility = menuVisibility.find(v => 
        v.menu_key === item.path || 
        v.menu_key === `/${item.path.split('/')[1]}`  // Check main route
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
