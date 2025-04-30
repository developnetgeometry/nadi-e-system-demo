import { Link, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SidebarMenu } from "@/components/ui/sidebar";
import { MenuItem } from "@/types/menu";
import { getAccordionIcon } from "@/utils/sidebar-icons";
import { sidebarStyles } from "@/utils/sidebar-styles";
import { SidebarItem } from "./SidebarItem";
import { cn } from "@/lib/utils";

interface SidebarAccordionProps {
  label: string;
  items: MenuItem[];
  state: string; // Pass state as a prop
  isCollapsed: boolean; // Pass isCollapsed as a prop
}

export const SidebarAccordion = ({
  label,
  items,
  state,
  isCollapsed,
}: SidebarAccordionProps) => {
  const location = useLocation();
  const isActive = items.some((item) =>
    location.pathname.startsWith(item.path)
  );
  const AccordionIcon = getAccordionIcon(label);

  console.log("SidebarAccordion isCollapsed", isCollapsed);
  console.log("SidebarAccordion state", state);

  // Render a simpler version when the sidebar is collapsed
  if (isCollapsed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-10 w-full rounded-md",
          isActive
            ? "bg-[#5147dd] text-white dark:bg-[#5147dd]/90"
            : "text-gray-700 dark:text-gray-200"
        )}
      >
        <AccordionIcon className="h-5 w-5" />
      </div>
    );
  }

  // Regular accordion for expanded state or mobile
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={isActive ? label : undefined}
    >
      <AccordionItem
        value={label}
        className={cn(
          "border-none truncate flex-1 min-h-[1.25rem] leading-tight line-clamp-2 tracking-tight ",
          isActive
        )}
      >
        <AccordionTrigger
          className={cn(
            sidebarStyles.accordionTrigger,
            isActive && sidebarStyles.accordionTriggerActive,
            "h-[40px] w-full group"
          )}
        >
          <div className="flex items-center gap-3 w-full min-h-[1.25rem]">
            <AccordionIcon
              className={cn(
                "h-5 w-5 flex-shrink-0",
                isActive ? "text-white" : "text-[#5147dd]",
                "group-hover:text-white dark:text-white"
              )}
            />
            <span className="truncate flex-1 leading-tight text-left text-xs tracking-tighter">
              {label}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0 pt-1 pl-6">
          <SidebarMenu className="gap-0">
            {items.map((item) => (
              <SidebarItem
                key={item.title}
                title={item.title}
                path={item.path}
                isCollapsed={false}
              />
            ))}
          </SidebarMenu>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};