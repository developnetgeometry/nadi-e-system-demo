
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserType } from "@/types/auth";
import { menuItems } from "@/components/layout/sidebar/menu-items";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface MenuVisibility {
  menu_key: string;
  visible_to: UserType[];
}

export const MenuVisibilitySettings = () => {
  const { toast } = useToast();
  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility[]>([]);

  const userTypes: UserType[] = [
    'member',
    'vendor',
    'tp',
    'sso',
    'dusp',
    'super_admin',
    'medical_office',
    'staff_internal',
    'staff_external'
  ];

  useEffect(() => {
    const loadMenuVisibility = async () => {
      try {
        const { data: menuData } = await supabase
          .from('menu_visibility')
          .select('*');
        if (menuData) {
          setMenuVisibility(menuData);
        }
      } catch (error) {
        console.error('Error loading menu visibility:', error);
        toast({
          title: "Error",
          description: "Failed to load menu visibility settings",
          variant: "destructive",
        });
      }
    };

    loadMenuVisibility();
  }, [toast]);

  const handleUpdateMenuVisibility = async (menuKey: string, userType: UserType, checked: boolean) => {
    const currentMenu = menuVisibility.find(m => m.menu_key === menuKey) || {
      menu_key: menuKey,
      visible_to: []
    };

    const updatedVisibleTo = checked
      ? [...currentMenu.visible_to, userType]
      : currentMenu.visible_to.filter(t => t !== userType);

    try {
      const { error } = await supabase
        .from('menu_visibility')
        .upsert({
          menu_key: menuKey,
          visible_to: updatedVisibleTo
        });

      if (error) throw error;

      setMenuVisibility(prev => 
        prev.map(m => m.menu_key === menuKey ? { ...m, visible_to: updatedVisibleTo } : m)
      );

      toast({
        title: "Success",
        description: "Menu visibility updated successfully",
      });
    } catch (error) {
      console.error('Error updating menu visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update menu visibility",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Visibility</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {menuItems.map((item) => (
            <div key={item.title} className="space-y-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userTypes.map((userType) => (
                  <div key={userType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${item.title}-${userType}`}
                      checked={menuVisibility.some(
                        m => m.menu_key === item.title && m.visible_to.includes(userType)
                      )}
                      onCheckedChange={(checked) => 
                        handleUpdateMenuVisibility(item.title, userType, checked as boolean)
                      }
                    />
                    <Label htmlFor={`${item.title}-${userType}`}>
                      {userType.replace(/_/g, ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
