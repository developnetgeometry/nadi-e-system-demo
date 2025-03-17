
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
    userType?: string;
  }[];
  nextStepId?: string;
  onRejectStepId?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  workflowId: string;
  submittedBy: string;
  submittedAt: string;
  status: WorkOrderStatus;
  data: Record<string, any>;
  currentStepId: string;
  approvalHistory: ApprovalHistoryItem[];
}

export interface ApprovalHistoryItem {
  stepId: string;
  approverId: string;
  action: ApprovalAction;
  timestamp: string;
  notes?: string;
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
  formId?: string;
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

export interface WorkflowFormConfig {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  workflowId?: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'date';
  required: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: any;
  placeholder?: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}
