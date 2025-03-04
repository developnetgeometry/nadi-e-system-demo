
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSessionTracking } from '@/hooks/use-session-tracking';

export const DashboardActivityTracker: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const { logPageVisit } = useSessionTracking(user);
  
  // Track initial page load and subsequent navigations
  useEffect(() => {
    if (user) {
      // Get current page title from document or fallback to route path
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const pageTitle = document.title || 
        (pathSegments.length > 0 
          ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + 
            pathSegments[pathSegments.length - 1].slice(1)
          : 'Dashboard');
      
      // Log the page visit
      logPageVisit(location.pathname, pageTitle);
      
      console.log(`Tracking page visit: ${location.pathname} (${pageTitle})`);
    }
  }, [location.pathname, user]);
  
  return <>{children}</>;
};
