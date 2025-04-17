
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
import { sidebarStyles, iconColors } from "@/utils/sidebar-styles";
import { SidebarItem } from "./SidebarItem";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronRight } from "lucide-react";

interface SidebarAccordionProps {
  label: string;
  items: MenuItem[];
}

export const SidebarAccordion = ({ label, items }: SidebarAccordionProps) => {
  const location = useLocation();
  const { state, isMobile } = useSidebar();
  const isActive = items.some((item) =>
    location.pathname.startsWith(item.path)
  );
  const isActiveExact = items.some((item) => location.pathname === item.path);
  const AccordionIcon = getAccordionIcon(label);
  const isCollapsed = state === "collapsed" && !isMobile;

  // If sidebar is collapsed and not mobile, render a simpler version
  if (isCollapsed) {
    return (
      <Accordion
        type="single"
        collapsible
        defaultValue={isActive ? label : undefined}
      >
        <AccordionItem
          value={label}
          className={cn(
            "border-none",
            isActive
          )}
        >
          <AccordionTrigger
            className={cn(
              sidebarStyles.accordionTrigger,
              isActive && sidebarStyles.accordionTriggerActive,
              isActiveExact && "text-white dark:text-white",
              "flex justify-between items-center text-sm tracking-tight h-10" // Adjust text size, letter spacing, and button height
            )}
          >
            <div className="flex items-center gap-3 min-w-0 w-full">
              <div className="relative">
                <AccordionIcon className={cn("h-5 w-5 flex-shrink-0")} />
              </div>
              <span className="truncate flex-1 min-h-[1.25rem] leading-tight line-clamp-2">

              </span>
            </div>
            {/* Chevron icon moved to the right */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent AccordionTrigger click
              }}
            >
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-1 pt-1 pl-6">
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
    )
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
          "border-none truncate flex-1 min-h-[1.25rem] leading-tight line-clamp-2 tracking-tight",
          isActive
        )}
      >
        <AccordionTrigger
          className={cn(
            sidebarStyles.accordionTrigger,
            isActive && sidebarStyles.accordionTriggerActive,
            isActiveExact && "text-white dark:text-white",
            "flex justify-between items-center text-sm tracking-tight",
            "w-[200px]" // 👈 fixed width
          )}
        >
          <div className="flex items-start gap-3 min-w-0 w-full">
            <div className="h-5 w-5 flex-shrink-0">
              <AccordionIcon className="h-5 w-5" />
            </div>
            <span className="truncate flex-1 min-h-[1.25rem] leading-tight line-clamp-2 text-left text-sm tracking-tighter">
              {label}
            </span>

          </div>

          {/* Chevron icon moved to the right */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent AccordionTrigger click
            }}
          >
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
