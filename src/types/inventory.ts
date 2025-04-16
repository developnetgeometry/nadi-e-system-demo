import { Site } from "@/types/site";

export interface Inventory {
  id: number;
  name: string;
  description?: string;
  type_id: number;
  type: InventoryType;
  retail_type?: number;
  price?: number;
  quantity?: number;
  barcode?: number;
  site_id?: number;
  site?: Site;
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
