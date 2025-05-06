import { StatCard } from "@/components/hr/payroll/StatCard";
import { PayrollTable } from "@/components/hr/payroll/PayrollTable";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data
const teamData = [
  {
    id: 1,
    name: "David Chen",
    position: "Senior Developer",
    payment: 8500,
    status: "Paid",
  },
  {
    id: 2,
    name: "Aisha Mohammed",
    position: "UX Designer",
    payment: 7200,
    status: "Paid",
  },
  {
    id: 3,
    name: "Raj Patel",
    position: "QA Engineer",
    payment: 6800,
    status: "Pending",
  },
  {
    id: 4,
    name: "Lee Min",
    position: "Junior Developer",
    payment: 4500,
    status: "Pending",
  },
];

const columns = [
  {
    key: "name",
    title: "Team Member",
  },
  {
    key: "position",
    title: "Position",
  },
  {
    key: "payment",
    title: "Monthly Payment",
    render: (value: number) =>
      typeof value === "number" ? `RM ${value.toLocaleString()}` : "RM 0",
  },
  {
    key: "status",
    title: "Payment Status",
    render: (value: string) => (
      <span
        className={
          value === "Paid"
            ? "text-nadi-success"
            : "text-nadi-warning font-medium"
        }
      >
        {value || "N/A"}
      </span>
    ),
  },
];

export function TPPage() {
  const handleSubmitPayrollClaim = () => {
    toast.info("Preparing payroll claim submission", {
      description: "Please review your team's information before submitting.",
    });

    // Simulate form opening delay
    setTimeout(() => {
      toast.success("Payroll claim form ready", {
        action: {
          label: "Submit",
          onClick: () => toast.success("Claim submitted successfully"),
        },
      });
    }, 1500);
  };

  const handleUploadProof = () => {
    toast.info("Upload payment proof documentation", {
      description: "Accepted formats: PDF, JPEG, PNG (max 10MB)",
      action: {
        label: "Select File",
        onClick: () => {
          // In a real app, this would open a file picker
          setTimeout(() => {
            toast.success("Document uploaded successfully");
          }, 1000);
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Team Monthly Payroll" value="RM 27,000" />
        <StatCard
          title="Training Bonus Awarded"
          value="RM 4,200"
          colorVariant="success"
        />
        <StatCard
          title="Pending Reimbursements"
          value="RM 1,850"
          colorVariant="warning"
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Team Payroll</h2>
        <div className="flex gap-2">
          <Button
            className="bg-nadi-purple hover:bg-nadi-purple-light gap-2"
            onClick={handleSubmitPayrollClaim}
          >
            <FileText size={16} />
            Submit Payroll Claim
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleUploadProof}
          >
            <Upload size={16} />
            Upload Proof
          </Button>
        </div>
      </div>

      <PayrollTable data={teamData} columns={columns} />

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm text-blue-700">
        <p>
          <strong>Note:</strong> Please submit all payroll claims by the 25th of
          each month.
        </p>
      </div>
    </div>
  );
}
