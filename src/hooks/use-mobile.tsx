
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with the current window width if available (client-side)
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    // Default to false for server-side rendering
    return false;
  });

  React.useEffect(() => {
    // Use the more modern matchMedia API
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const handleResize = () => {
      setIsMobile(mql.matches);
    }

    // Set the initial value
    handleResize();
    
    // Add event listener
    mql.addEventListener("change", handleResize);
    
    // Clean up
    return () => mql.removeEventListener("change", handleResize);
  }, []);

  return isMobile;
}
