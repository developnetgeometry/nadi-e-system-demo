
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { MenuItem } from "@/types/menu";
import { cn } from "@/lib/utils";
import { sidebarStyles } from "@/utils/sidebar-styles";
import { SidebarItem } from "./SidebarItem";
import { getAccordionIcon } from "@/utils/sidebar-icons";
import { iconColors } from "@/utils/sidebar-styles";
import { useSidebar } from "@/hooks/use-sidebar";

interface SidebarAccordionProps {
  label: string;
  items: MenuItem[];
}

export const SidebarAccordion = ({ label, items }: SidebarAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const Icon = getAccordionIcon(label);
  const iconColor = iconColors[label] || "#6E41E2";

  // Close accordion when sidebar is collapsed
  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  if (isCollapsed) {
    return (
      <div 
        className={cn(sidebarStyles.collapsedIconWrapper, "hover:scale-110 cursor-pointer")}
        onClick={() => setIsOpen(!isOpen)}
        title={label}
      >
        <Icon size={24} color={iconColor} />
      </div>
    );
  }

  return (
    <div className={cn(sidebarStyles.accordionWrapper)}>
      <button
        type="button"
        className={cn(
          sidebarStyles.accordionTrigger,
          isOpen && sidebarStyles.accordionTriggerActive
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Icon size={20} color={iconColor} />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          className={cn(
            sidebarStyles.iconWrapper,
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        ref={panelRef}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="p-3 space-y-1">
          {items.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              path={item.path}
              icon={item.icon}
              iconColor={iconColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
