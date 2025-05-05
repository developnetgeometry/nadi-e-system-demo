export interface NADIClosure {
  id: number;
  site_id: string;
  site_name?: string;
  site_code?: string;
  reason: string;
  closure_date: string;
  expected_recovery_date?: string | null;
  affected_services: string[];
  comments?: string | null;
  status_id: number;
  status_description?: string;
  created_by: string;
  created_at: string;
  updated_by?: string | null;
  updated_at?: string | null;
  organization_id?: string;
  organization_name?: string;
  notification_sent?: boolean;
}

export interface NADIClosureFormData {
  site_id: string;
  reason: string;
  closure_date: string | null;
  expected_recovery_date?: string | null;
  affected_services: string[];
  comments?: string | null;
  status_id: number;
}

export interface NADIClosureAttachment {
  id: number;
  closure_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
}

// Status types for NADI closure
export enum NADIClosureStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  CLOSED = 4,
  COMPLETED = 5
}

export interface NADIClosureStatusInfo {
  id: number;
  name: string;
  description: string;
  color: string;
}