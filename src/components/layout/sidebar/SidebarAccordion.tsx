import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MenuItem } from "@/types/menu";

interface SidebarAccordionProps {
  label: string;
  items: MenuItem[];
}

export const SidebarAccordion = ({ label, items }: SidebarAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="mb-2">
      <AccordionItem value={label} className="border-none">
        <AccordionTrigger 
          className="py-2 px-4 text-sm font-medium text-sidebar-foreground rounded-md transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent/50"
        >
          {label}
        </AccordionTrigger>
        <AccordionContent className="pb-1">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link 
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-sidebar-foreground rounded-md transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
                  >
                    <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};