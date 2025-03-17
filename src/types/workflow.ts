
export type WorkflowType = 'work_order' | 'training_report' | 'center_management';

export type WorkOrderStatus = 'draft' | 'pending_approval' | 'in_progress' | 'incomplete' | 'complete' | 'cancelled' | 'rejected' | 'approved';

export type ApprovalAction = 'approve' | 'reject';

export type WorkflowStepType = 'approval' | 'form' | 'notification' | 'delay';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: WorkflowStepType;
  estimatedDuration: number;
  requiredFields: string[];
  assignedTo: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  assignedUsers: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  completedInstances: number;
  activeInstances: number;
}

export type WorkflowApprovalStep = {
  id: string;
  name: string;
  description: string;
  approverRoles: string[];
  nextStepOnApprove?: string;
  nextStepOnReject?: string;
  statusOnApprove?: WorkOrderStatus;
  statusOnReject?: WorkOrderStatus;
  requireReason: boolean;
};

export type WorkflowDefinition = {
  id: string;
  type: WorkflowType;
  name: string;
  description: string;
  steps: WorkflowApprovalStep[];
  initialStep: string;
};

export interface WorkOrderData {
  id: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  currentStepId?: string;
  completionNotes?: string;
  rejectionReason?: string;
  requiredApprovals: string[];
  approvals: {
    stepId: string;
    approverId: string;
    approved: boolean;
    reason?: string;
    timestamp: string;
  }[];
}
