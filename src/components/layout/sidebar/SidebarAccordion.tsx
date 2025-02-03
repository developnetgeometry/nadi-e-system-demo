import { Link, useLocation } from "react-router-dom";
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
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  MessageSquare,
  Wallet,
  FileCheck,
  Briefcase,
  ShoppingCart,
  Box,
  DollarSign,
  List,
  ChartBar,
  LucideIcon 
} from "lucide-react";

interface SidebarAccordionProps {
  label: string;
  items: MenuItem[];
}

const getAccordionIcon = (label: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    "Admin Console": LayoutDashboard,
    "Member Management": Users,
    "Service Module": Settings,
    "Community": MessageSquare,
    "Financial": Wallet,
    "Compliance": FileCheck,
    "HR Management": Briefcase,
    "POS Management": ShoppingCart,
    "Asset Management": Box,
    "Finance Management": DollarSign,
    "Programmes Management": List,
    "Report Management": ChartBar,
  };
  return iconMap[label] || LayoutDashboard;
};

export const SidebarAccordion = ({ label, items }: SidebarAccordionProps) => {
  const location = useLocation();
  const isActive = items.some(item => location.pathname.startsWith(item.path));
  const AccordionIcon = getAccordionIcon(label);

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="mb-2"
      defaultValue={isActive ? label : undefined}
    >
      <AccordionItem value={label} className="border-none">
        <AccordionTrigger 
          className={`py-2 px-4 text-sm font-medium text-sidebar-foreground rounded-md transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group ${
            isActive ? 'bg-sidebar-accent/50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <AccordionIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>{label}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-1">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 text-sm text-sidebar-foreground rounded-md transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group ${
                      location.pathname === item.path ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                    }`}
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