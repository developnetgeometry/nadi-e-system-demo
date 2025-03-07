
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSessionTracking } from '@/hooks/use-session-tracking';
import { useAuth } from '@/hooks/useAuth';

export const ActivityTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { logPageVisit } = useSessionTracking(user);
  
  useEffect(() => {
    if (user) {
      // Extract a meaningful title from the pathname if document.title is not set
      const pageTitle = document.title || location.pathname.split('/').filter(Boolean).pop() || 'Dashboard';
      logPageVisit(location.pathname, pageTitle);
    }
  }, [location.pathname, user]);
  
  return <>{children}</>;
};
