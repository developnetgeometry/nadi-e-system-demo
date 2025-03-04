
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useSessionTracking } from '@/hooks/use-session-tracking';
import { useAuth } from '@/hooks/useAuth';

export const useActivityTracking = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigationType = useNavigationType();
  
  const { 
    logPageVisit, 
    logDatabaseAction 
  } = useSessionTracking(user);

  // Track page visits
  useEffect(() => {
    // Only track if there's a location change that's not a replace
    if (user && navigationType !== 'POP') {
      const pageTitle = document.title;
      logPageVisit(location.pathname, pageTitle);
    }
  }, [location.pathname, user, navigationType]);

  return {
    trackDatabaseAction: logDatabaseAction
  };
};

// Create a wrapper for database operations to automatically log them
export const createTrackedDatabaseOperation = (
  operation: 'create' | 'read' | 'update' | 'delete',
  entityType: string,
  originalFunction: Function
) => {
  return async (...args: any[]) => {
    const { trackDatabaseAction } = useActivityTracking();
    const result = await originalFunction(...args);
    
    if (result.data && !result.error) {
      const entityId = result.data.id || 'batch';
      trackDatabaseAction(operation, entityType, entityId, { 
        affected_records: Array.isArray(result.data) ? result.data.length : 1,
        args: args
      });
    }
    
    return result;
  };
};
