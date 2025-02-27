
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { MenuVisibility, SubmoduleVisibility } from "../types/menu-visibility.types";
import { UserType } from "@/types/auth";

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

        // Set user types based on the role permissions system
        setUserTypes(['super_admin']);

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
