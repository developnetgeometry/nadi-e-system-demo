
import { UserType } from "@/types/auth";

export interface UserGroup {
  id: number;
  group_name: string;
  description: string | null;
  user_types?: UserType[];
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface UserGroupFormData {
  group_name: string;
  description: string;
  user_types: UserType[];
}
