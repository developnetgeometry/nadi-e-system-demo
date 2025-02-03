import React from "react";
import { useSidebar } from "@/hooks/use-sidebar";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const [resizeObserver] = React.useState(() => {
      if (typeof ResizeObserver === "undefined") return null;
      return new ResizeObserver((entries) => {
        if (!entries.length) return;
        const currentRef = sidebarRef.current;
        if (currentRef) {
          requestAnimationFrame(() => {
            if (currentRef) {
              currentRef.style.height = `${entries[0].contentRect.height}px`;
            }
          });
        }
      });
    });

    React.useEffect(() => {
      const sidebar = sidebarRef.current;
      if (!sidebar || !resizeObserver) return;

      resizeObserver.observe(sidebar);
      return () => {
        resizeObserver.disconnect();
      };
    }, [resizeObserver]);

    return (
      <div
        ref={(node) => {
          sidebarRef.current = node;
          if (ref) {
            if (typeof ref === "function") {
              ref(node);
            } else {
              ref.current = node;
            }
          }
        }}
        className={`sidebar ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";

const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="sidebar-provider">{children}</div>;
};

const SidebarContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return <div className={`sidebar-content ${className || ''}`}>{children}</div>;
};

const SidebarTrigger: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <button onClick={toggleSidebar} className="sidebar-trigger">
      Toggle Sidebar
    </button>
  );
};

const SidebarMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="sidebar-menu">{children}</div>;
};

const SidebarMenuItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="sidebar-menu-item">{children}</div>;
};

const SidebarMenuButton: React.FC<{ 
  children: React.ReactNode; 
  asChild?: boolean;
  className?: string;
}> = ({ children, asChild = false, className }) => {
  const Comp = asChild ? 'div' : 'button';
  return (
    <Comp className={`sidebar-menu-button ${className || ''}`}>
      {children}
    </Comp>
  );
};

const SidebarGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="sidebar-group">{children}</div>;
};

const SidebarGroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="sidebar-group-label">{children}</div>;
};

const SidebarGroupContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="sidebar-group-content">{children}</div>;
};

export {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
};
