
import { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useSidebar = () => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [state, setState] = useState<'expanded' | 'collapsed'>('expanded');

  // Update sidebar state based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile, start with sidebar closed
      setOpenMobile(false);
    } else {
      // On desktop, respect the user's choice or default to expanded
      const savedState = localStorage.getItem('sidebarState');
      if (savedState) {
        setState(savedState as 'expanded' | 'collapsed');
      }
    }
  }, [isMobile]);

  // Save sidebar state to localStorage
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebarState', state);
    }
  }, [state, isMobile]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(prev => !prev);
    } else {
      setState(prev => {
        const newState = prev === 'expanded' ? 'collapsed' : 'expanded';
        return newState;
      });
    }
  }, [isMobile]);

  return {
    isMobile,
    state,
    openMobile,
    setOpenMobile,
    toggleSidebar
  };
};
