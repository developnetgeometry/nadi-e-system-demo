export interface TakwimEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  type: string;
  description?: string;
  location?: string;
  category: string;
  pillar: string;
  programme: string;
  module: string;
  isGroupEvent: boolean;
  mode: "Online" | "Physical";
  targetParticipant: string;
  trainerName: string;
  duration?: string; // Auto calculated duration
}

export interface EventType {
  value: string;
  label: string;
  color: string;
}

export interface EventCategory {
  value: string;
  label: string;
}

export interface Pillar {
  value: string;
  label: string;
  categoryId: string;
}

export interface Programme {
  value: string;
  label: string;
  pillarId: string;
}

export interface Module {
  value: string;
  label: string;
  programmeId: string;
}
