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
        // Throttle resize observations
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

export { Sidebar };
