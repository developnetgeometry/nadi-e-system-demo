
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { SidebarContent as CustomSidebarContent } from "./sidebar/SidebarContent";
import { useAppSettings } from "@/hooks/use-app-settings";

export const DashboardSidebar = () => {
  const { settings } = useAppSettings();
  const sidebarTitle = settings.find(s => s.key === 'sidebar_title')?.value || 'NADI';

  return (
    <Sidebar className="border-r border-border bg-[#000080] h-screen flex flex-col">
      <div className="p-4 border-b border-border/20 flex-shrink-0">
        <h1 className="nadi-gradient-text">{sidebarTitle}</h1>
      </div>
      <SidebarContent className="p-4 flex-1 overflow-y-auto scrollbar-none">
        <CustomSidebarContent />
      </SidebarContent>
    </Sidebar>
  );
};
