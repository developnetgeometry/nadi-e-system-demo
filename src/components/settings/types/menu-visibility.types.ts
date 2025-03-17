
import { UserType } from "@/types/auth";

export interface MenuVisibility {
  menu_key: string;
  menu_path: string;
  visible_to: UserType[];
}

export interface SubmoduleVisibility {
  parent_module: string;
  submodule_key: string;
  submodule_path: string;
  visible_to: UserType[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
}
