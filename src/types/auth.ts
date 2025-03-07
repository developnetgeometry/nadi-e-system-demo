
export type UserType =
  | "member"
  | "vendor"
  | "tp"
  | "tp_admin"
  | "sso"
  | "dusp"
  | "super_admin"
  | "medical_office"
  | "staff_internal"
  | "staff_external"
  | string; // Allow any string to support dynamic roles

export type NotificationType = "info" | "warning" | "success" | "error";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  ic_number: string;
  phone_number: string;
  avatar_url?: string;
  user_type: UserType;
  theme_preference: "light" | "dark";
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
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
  description: string | null;
  module: string;
  action: string;
  created_at?: string;
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
