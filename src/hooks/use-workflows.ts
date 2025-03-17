
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Workflow } from "@/types/workflow";

// Sample data for development
const sampleWorkflows: Workflow[] = [
  {
    id: "workflow-1",
    name: "New Employee Onboarding",
    description: "Standard process for onboarding new employees",
    status: "active",
    steps: [
      {
        id: "step-1",
        name: "HR Documentation",
        description: "Complete all HR paperwork and documentation",
        type: "form",
        estimatedDuration: 2,
        requiredFields: ["name", "email", "position"],
        assignedTo: [{ id: "user-1", name: "HR Manager" }],
      },
      {
        id: "step-2",
        name: "Equipment Setup",
        description: "Prepare and configure employee workstation",
        type: "approval",
        estimatedDuration: 4,
        requiredFields: ["equipment_list"],
        assignedTo: [{ id: "user-2", name: "IT Support" }],
      },
      {
        id: "step-3",
        name: "Training Schedule",
        description: "Create and approve training schedule",
        type: "approval",
        estimatedDuration: 1,
        requiredFields: ["schedule"],
        assignedTo: [{ id: "user-3", name: "Department Manager" }],
      }
    ],
    createdAt: "2023-01-15T09:30:00Z",
    updatedAt: "2023-02-10T14:20:00Z",
    assignedUsers: [
      { id: "user-1", name: "HR Manager" },
      { id: "user-2", name: "IT Support" },
      { id: "user-3", name: "Department Manager" }
    ],
    completedInstances: 12,
    activeInstances: 3,
  },
  {
    id: "workflow-2",
    name: "Expense Approval",
    description: "Process for approving employee expenses",
    status: "active",
    steps: [
      {
        id: "step-1",
        name: "Submit Expense Report",
        description: "Complete and submit expense form with receipts",
        type: "form",
        estimatedDuration: 0.5,
        requiredFields: ["amount", "date", "description", "receipts"],
        assignedTo: [{ id: "user-4", name: "Employee" }],
      },
      {
        id: "step-2",
        name: "Manager Review",
        description: "Department manager reviews and approves expenses",
        type: "approval",
        estimatedDuration: 1,
        requiredFields: [],
        assignedTo: [{ id: "user-3", name: "Department Manager" }],
      },
      {
        id: "step-3",
        name: "Finance Processing",
        description: "Finance team reviews and processes payment",
        type: "approval",
        estimatedDuration: 2,
        requiredFields: ["payment_details"],
        assignedTo: [{ id: "user-5", name: "Finance Manager" }],
      },
      {
        id: "step-4",
        name: "Payment Notification",
        description: "System notification when payment is complete",
        type: "notification",
        estimatedDuration: 0.1,
        requiredFields: [],
        assignedTo: [],
      }
    ],
    createdAt: "2023-02-20T10:15:00Z",
    updatedAt: "2023-02-25T16:30:00Z",
    assignedUsers: [
      { id: "user-3", name: "Department Manager" },
      { id: "user-5", name: "Finance Manager" }
    ],
    completedInstances: 85,
    activeInstances: 7,
  },
  {
    id: "workflow-3",
    name: "Vendor Approval",
    description: "Process for approving new vendors",
    status: "draft",
    steps: [
      {
        id: "step-1",
        name: "Vendor Information",
        description: "Collect vendor information and documentation",
        type: "form",
        estimatedDuration: 1,
        requiredFields: ["company_name", "contact", "services"],
        assignedTo: [{ id: "user-6", name: "Procurement Officer" }],
      },
      {
        id: "step-2",
        name: "Legal Review",
        description: "Legal team reviews vendor contracts",
        type: "approval",
        estimatedDuration: 5,
        requiredFields: [],
        assignedTo: [{ id: "user-7", name: "Legal Counsel" }],
      }
    ],
    createdAt: "2023-03-05T13:45:00Z",
    updatedAt: "2023-03-05T13:45:00Z",
    assignedUsers: [
      { id: "user-6", name: "Procurement Officer" },
      { id: "user-7", name: "Legal Counsel" }
    ],
    completedInstances: 0,
    activeInstances: 0,
  }
];

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | undefined>(sampleWorkflows[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteWorkflow = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setWorkflows(workflows.filter(workflow => workflow.id !== id));
      
      if (selectedWorkflow?.id === id) {
        setSelectedWorkflow(workflows.find(w => w.id !== id));
      }
      
      toast({
        title: "Workflow deleted",
        description: "The workflow has been successfully deleted.",
      });
      
      setIsLoading(false);
    }, 500);
  };

  const handleDuplicateWorkflow = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const workflowToDuplicate = workflows.find(w => w.id === id);
      if (workflowToDuplicate) {
        const duplicatedWorkflow: Workflow = {
          ...workflowToDuplicate,
          id: `workflow-${Date.now()}`,
          name: `${workflowToDuplicate.name} (Copy)`,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          activeInstances: 0,
          completedInstances: 0
        };
        
        setWorkflows([...workflows, duplicatedWorkflow]);
        toast({
          title: "Workflow duplicated",
          description: "A copy of the workflow has been created.",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const handleCreateWorkflow = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newWorkflow: Workflow = {
        id: `workflow-${Date.now()}`,
        name: "Untitled Workflow",
        description: "",
        status: "draft",
        steps: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedUsers: [],
        completedInstances: 0,
        activeInstances: 0
      };
      
      setWorkflows([...workflows, newWorkflow]);
      setSelectedWorkflow(newWorkflow);
      toast({
        title: "New workflow created",
        description: "You can now start building your workflow.",
      });
      setIsLoading(false);
    }, 500);
  };

  return {
    workflows,
    isLoading,
    selectedWorkflow,
    setSelectedWorkflow,
    handleDeleteWorkflow,
    handleDuplicateWorkflow,
    handleCreateWorkflow
  };
}
