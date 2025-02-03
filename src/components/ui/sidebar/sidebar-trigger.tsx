import React from "react";
import { useSidebar } from "@/hooks/use-sidebar";

export const SidebarTrigger: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <button onClick={toggleSidebar} className="sidebar-trigger">
      Toggle Sidebar
    </button>
  );
};