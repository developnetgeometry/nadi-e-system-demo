
import { format } from "date-fns";

// Types
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: any;
  ip_address: string;
  created_at: string;
  userEmail?: string;
  userType?: string;
}

export interface Session {
  id: string;
  user_id: string;
  session_type: string;
  start_time: string;
  end_time: string | null;
  ip_address: string;
  user_agent: string;
  device_info: any;
  created_at: string;
  duration_minutes?: number;
  userEmail?: string;
  userType?: string;
}

export interface Profile {
  id: string;
  email: string;
  user_type: string;
}

// Function to create profile lookup map
export const createProfileMap = (profiles: Profile[]) => {
  return profiles.reduce((acc, profile) => {
    acc[profile.id] = {
      email: profile.email,
      user_type: profile.user_type
    };
    return acc;
  }, {});
};

// Process audit logs with user information
export const processAuditLogs = (logs: any[], profileMap: Record<string, any>) => {
  return logs.map(log => {
    const userProfile = log.user_id ? profileMap[log.user_id] : null;
    return {
      ...log,
      userEmail: userProfile?.email,
      userType: userProfile?.user_type
    };
  });
};

// Process sessions with user information and duration
export const processSessions = (sessions: any[], profileMap: Record<string, any>) => {
  return sessions.map(session => {
    const userProfile = session.user_id ? profileMap[session.user_id] : null;
    const startTime = new Date(session.start_time);
    const endTime = session.end_time ? new Date(session.end_time) : new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    return {
      ...session,
      duration_minutes: durationMinutes,
      userEmail: userProfile?.email,
      userType: userProfile?.user_type
    };
  });
};

// Filter logs based on search term
export const filterLogs = (logs: AuditLog[], searchTerm: string) => {
  if (!searchTerm) return logs;
  
  return logs.filter((log) => {
    const searchFields = [
      log.action,
      log.entity_type,
      log.entity_id,
      log.ip_address,
      log.userEmail,
    ];
    
    return searchFields.some(
      (field) => field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
};

// Filter sessions based on search term
export const filterSessions = (sessions: Session[], searchTerm: string) => {
  if (!searchTerm) return sessions;
  
  return sessions.filter((session) => {
    const searchFields = [
      session.session_type,
      session.ip_address,
      session.user_agent,
      session.userEmail,
    ];
    
    return searchFields.some(
      (field) => field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
};

// Export data as CSV
export const exportToCSV = (data: any[], filename: string) => {
  // Prepare CSV content
  const headers = Object.keys(data[0] || {}).filter(key => !key.startsWith('user'));
  const csvRows = [
    // Add headers
    headers.join(','),
    // Add data rows
    ...data.map(row => {
      return headers
        .map(header => {
          const value = row[header];
          return typeof value === 'object' 
            ? JSON.stringify(value)
            : `"${value?.toString().replace(/"/g, '""') || ''}"`;
        })
        .join(',');
    }),
  ];

  // Create and download the CSV file
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
