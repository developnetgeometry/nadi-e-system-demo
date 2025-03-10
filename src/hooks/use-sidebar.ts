
import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { useIsMobile } from './use-mobile';

interface SidebarContextType {
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  state: 'expanded' | 'collapsed';
  setState: (state: 'expanded' | 'collapsed') => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  return (
    <SidebarContext.Provider
      value={{
        isMobile,
        openMobile,
        setOpenMobile,
        state,
        setState,
        toggleSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Backward compatibility
export const useSidebar = () => {
  try {
    return useSidebarContext();
  } catch (error) {
    // Fallback to standalone hook behavior if no provider
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = useState(false);
    const [state, setState] = useState<'expanded' | 'collapsed'>('expanded');

    const toggleSidebar = useCallback(() => {
      if (isMobile) {
        setOpenMobile(prev => !prev);
      } else {
        setState(prev => prev === 'expanded' ? 'collapsed' : 'expanded');
      }
    }, [isMobile]);

    return {
      isMobile,
      openMobile,
      setOpenMobile,
      state,
      setState,
      toggleSidebar
    };
  }
};
