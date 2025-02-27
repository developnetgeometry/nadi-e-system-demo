
import { UserType } from "@/types/auth";

export interface MenuVisibility {
  menu_key: string;
  visible_to: UserType[];
}

export interface SubmoduleVisibility {
  parent_module: string;
  submodule_key: string;
  visible_to: UserType[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
}
