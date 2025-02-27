
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { menuGroups } from "@/utils/menu-groups";
import { UserType } from "@/types/auth";
import { useVisibilityData } from "./hooks/useVisibilityData";
import { VisibilityControls } from "./components/VisibilityControls";

export const MenuVisibilitySettings = () => {
  const { toast } = useToast();
  const {
    menuVisibility,
    submoduleVisibility,
    userTypes,
    isLoading,
    setMenuVisibility,
    setSubmoduleVisibility
  } = useVisibilityData();

  const handleUpdateMenuVisibility = async (menuKey: string, userType: UserType, checked: boolean) => {
    const currentMenu = menuVisibility.find(m => m.menu_key === menuKey) || {
      menu_key: menuKey,
      visible_to: []
    };

    const updatedVisibleTo = checked
      ? [...new Set([...currentMenu.visible_to, userType])]
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

  const handleUpdateSubmoduleVisibility = async (
    parentModule: string,
    submoduleKey: string,
    userType: UserType,
    checked: boolean
  ) => {
    const currentSubmodule = submoduleVisibility.find(
      s => s.parent_module === parentModule && s.submodule_key === submoduleKey
    ) || {
      parent_module: parentModule,
      submodule_key: submoduleKey,
      visible_to: []
    };

    const updatedVisibleTo = checked
      ? [...new Set([...currentSubmodule.visible_to, userType])]
      : currentSubmodule.visible_to.filter(t => t !== userType);

    try {
      const { error } = await supabase
        .from('submodule_visibility')
        .upsert({
          parent_module: parentModule,
          submodule_key: submoduleKey,
          visible_to: updatedVisibleTo
        });

      if (error) throw error;

      setSubmoduleVisibility(prev => 
        prev.map(s => 
          s.parent_module === parentModule && s.submodule_key === submoduleKey
            ? { ...s, visible_to: updatedVisibleTo }
            : s
        )
      );

      toast({
        title: "Success",
        description: "Submodule visibility updated successfully",
      });
    } catch (error) {
      console.error('Error updating submodule visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update submodule visibility",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !userTypes.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>Loading user types...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu & Submodule Visibility</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-4">
          {menuGroups.map((group) => (
            <AccordionItem key={group.label} value={group.label}>
              <AccordionTrigger className="text-lg font-semibold">
                {group.label}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 pl-4">
                  {/* Main menu visibility */}
                  <VisibilityControls
                    label="Main Menu Visibility"
                    userTypes={userTypes}
                    visibilityList={menuVisibility.filter(m => m.menu_key === group.label)}
                    identifier={group.label}
                    onUpdateVisibility={(userType, checked) => 
                      handleUpdateMenuVisibility(group.label, userType, checked)
                    }
                  />

                  {/* Submodules visibility */}
                  {group.items.map((item) => (
                    <div key={item.title} className="border-l-2 border-gray-200 pl-4">
                      <VisibilityControls
                        label={item.title}
                        userTypes={userTypes}
                        visibilityList={submoduleVisibility.filter(
                          s => s.parent_module === group.label && s.submodule_key === item.title
                        )}
                        identifier={`${group.label}-${item.title}`}
                        onUpdateVisibility={(userType, checked) => 
                          handleUpdateSubmoduleVisibility(group.label, item.title, userType, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
