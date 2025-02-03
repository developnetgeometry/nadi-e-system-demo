import React from "react";
import { useSidebar } from "@/hooks/use-sidebar";

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  return <div className="sidebar-provider">{children}</div>;
};