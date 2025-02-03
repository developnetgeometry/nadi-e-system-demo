import { useState, useCallback } from 'react';
import { useIsMobile } from './use-mobile';

export const useSidebar = () => {
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
    state,
    openMobile,
    setOpenMobile,
    toggleSidebar
  };
};