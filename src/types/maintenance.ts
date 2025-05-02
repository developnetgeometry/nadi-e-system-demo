import { Asset } from "@/types/asset";

export interface MaintenanceRequest {
  id: number;
  description: string;
  asset_id?: number;
  asset?: Asset;
  type_id?: number;
  type?: TypeMaintenance;
  sla_id?: number;
  sla: SLACategories;
  status: boolean;
  requester_by: string;
  attachment?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export enum MaintenanceDocketType {
  Corrective = "Corrective Maintenance (CM)",
  Preventive = "Preventive Maintenance (PM)",
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
