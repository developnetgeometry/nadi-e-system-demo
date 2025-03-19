
export interface UserGroup {
  id: string;
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
