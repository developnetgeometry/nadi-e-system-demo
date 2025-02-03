import { Link, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SidebarMenu } from "@/components/ui/sidebar";
import { MenuItem } from "@/types/menu";
import { useSidebar } from "@/hooks/use-sidebar";
import { getAccordionIcon } from "@/utils/sidebar-icons";
import { sidebarStyles } from "@/utils/sidebar-styles";
import { SidebarItem } from "./SidebarItem";
import { cn } from "@/lib/utils";

interface SidebarAccordionProps {
  label: string;
  items: MenuItem[];
}

export const SidebarAccordion = ({ label, items }: SidebarAccordionProps) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isActive = items.some(item => location.pathname.startsWith(item.path));
  const AccordionIcon = getAccordionIcon(label);
  const isCollapsed = state === "collapsed";

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="mb-2"
      defaultValue={isActive ? label : undefined}
    >
      <AccordionItem value={label} className="border-none">
        <AccordionTrigger 
          className={cn(
            sidebarStyles.accordionTrigger,
            isActive && sidebarStyles.accordionTriggerActive
          )}
        >
          <div className="flex items-center gap-3 min-w-0 w-full justify-start">
            <AccordionIcon className={sidebarStyles.iconWrapper} />
            {!isCollapsed && <span className="truncate flex-1 text-left">{label}</span>}
          </div>
        </AccordionTrigger>
        <AccordionContent className={`pb-1 ${isCollapsed ? 'pl-4' : 'pl-11'}`}>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarItem
                key={item.title}
                title={item.title}
                path={item.path}
                icon={item.icon}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarMenu>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};