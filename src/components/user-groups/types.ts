
export interface UserGroup {
  id: number; // Changed from string to number to match bigint in the database
  group_name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface UserGroupFormData {
  group_name: string;
  description: string;
}
