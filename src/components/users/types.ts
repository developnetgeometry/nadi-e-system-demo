import { UserType } from "@/types/auth";

export interface UserFormData {
  email: string;
  full_name: string;
  user_type: UserType;
  phone_number?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  phone_number?: string;
}