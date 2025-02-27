
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { MenuVisibility, SubmoduleVisibility } from "../types/menu-visibility.types";
import { UserType } from "@/types/auth";

// Map between role names and UserType enum values
const roleToUserTypeMap: Record<string, UserType> = {
  'super_admin': 'super_admin',
  'admin': 'staff_internal',
  'user': 'member',
  // Add other mappings as needed
};

export const useVisibilityData = () => {
  const { toast } = useToast();
  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility[]>([]);
  const [submoduleVisibility, setSubmoduleVisibility] = useState<SubmoduleVisibility[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load menu visibility
        const { data: menuData, error: menuError } = await supabase
          .from('menu_visibility')
          .select('*');

        if (menuError) throw menuError;
        setMenuVisibility(menuData || []);

        // Load submodule visibility
        const { data: submoduleData, error: submoduleError } = await supabase
          .from('submodule_visibility')
          .select('*');

        if (submoduleError) throw submoduleError;
        setSubmoduleVisibility(submoduleData || []);

        // Load user types from roles table instead of profiles
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('name');

        if (roleError) throw roleError;
        
        // Map role names to valid UserType enum values
        const validUserTypes = roleData
          .map(r => roleToUserTypeMap[r.name])
          .filter((type): type is UserType => type !== undefined);

        setUserTypes(Array.from(new Set(validUserTypes)));

      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load visibility settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  return {
    menuVisibility,
    submoduleVisibility,
    userTypes,
    isLoading,
    setMenuVisibility,
    setSubmoduleVisibility
  };
};
