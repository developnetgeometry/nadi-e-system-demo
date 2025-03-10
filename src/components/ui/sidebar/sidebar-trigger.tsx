
import React from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Menu } from "lucide-react"; 
import { Button } from "@/components/ui/button";

export const SidebarTrigger: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className="mb-4"
      aria-label="Toggle Sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};
