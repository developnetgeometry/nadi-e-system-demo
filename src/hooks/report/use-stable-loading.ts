import { useState, useEffect } from 'react';

/**
 * A hook that stabilizes loading state to prevent UI flickering
 * by ensuring a minimum loading time and debouncing state changes.
 */
export function useStableLoading(
  isLoading: boolean,
  minLoadingTime = 800,
  delayBeforeHide = 300
): boolean {
  const [stableLoading, setStableLoading] = useState(isLoading);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    // When loading starts
    if (isLoading && !stableLoading) {
      setStableLoading(true);
      setLoadStartTime(Date.now());
      return;
    }

    // When loading stops
    if (!isLoading && stableLoading) {
      const elapsedTime = loadStartTime ? Date.now() - loadStartTime : 0;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      timer = setTimeout(() => {
        setStableLoading(false);
      }, remainingTime + delayBeforeHide);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, stableLoading, loadStartTime, minLoadingTime, delayBeforeHide]);

  return stableLoading;
}