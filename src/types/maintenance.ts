import { Asset } from "@/types/asset";

export interface MaintenanceRequest {
  id: number;
  name: string;
  description: string;
  asset_id: number;
  asset: Asset;
  type_id: number;
  type?: TypeMaintenance;
  status: boolean;
  requester_by: string;
  attachment?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export enum MaintenanceStatus {
  Completed = "completed",
  Rejected = "rejected",
  Issued = "issued",
  InProgress = "in_progress",
  Defferred = "deferred",
}

export interface TypeMaintenance {
  id: number;
  name: string;
  description: string;
}

export interface SLACategories {
  id: number;
  name: string;
  min_day: number;
  max_day: number;
}
