export type UserType =
  | "member"
  | "vendor"
  | "tp"
  | "sso"
  | "dusp"
  | "super_admin"
  | "medical_office"
  | "staff_internal"
  | "staff_external";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  created_at: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  created_at: string;
}