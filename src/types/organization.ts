
import { UserType } from "./auth";

export type OrganizationType = "dusp" | "tp";

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  description?: string;
  logo_url?: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationUser {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationFormData {
  name: string;
  type: OrganizationType;
  description?: string;
  logo_url?: string;
  parent_id?: string | null;
}

export interface OrganizationUserFormData {
  organization_id: string;
  user_id: string;
  role: string;
}

// Enhanced organization user with profile data
export interface EnhancedOrgUser extends OrganizationUser {
  profiles: {
    id: string;
    full_name?: string;
    email?: string;
    user_type: UserType;
    avatar_url?: string;
  };
}
