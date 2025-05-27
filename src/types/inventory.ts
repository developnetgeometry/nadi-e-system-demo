import { Site } from "@/types/site";

export interface Inventory {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  type_id: number;
  type: InventoryType;
  retail_type?: number;
  price?: number;
  quantity?: number;
  site_id?: number;
  site?: Site;
  nd_inventory_attachment?: InventoryAttachment[];
  image_url?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface InventoryType {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface InventoryStatsData {
  total: number;
  active: number;
  maintenance: number;
  value: number;
}

export interface InventoryStatsCardProps {
  title: string;
  value: string;
  color?: string;
  description: string;
}

export interface InventoryAttachment {
  id?: string;
  file_path: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  inventory_id?: string;
}