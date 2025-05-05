import { StatCard } from "@/components/hr/payroll/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PayrollTable } from "@/components/hr/payroll/PayrollTable";
import { toast } from "sonner";

// Mock data for compliance check
const complianceData = [
  {
    id: 1,
    center: "KL Central",
    budgetCompliance: "Compliant",
    delayFlags: 0,
  },
  {
    id: 2,
    center: "Johor Bahru",
    budgetCompliance: "Over Budget",
    delayFlags: 2,
  },
  {
    id: 3,
    center: "Penang",
    budgetCompliance: "Compliant",
    delayFlags: 0,
  },
  {
    id: 4,
    center: "Kuching",
    budgetCompliance: "Under Budget",
    delayFlags: 1,
  },
];

const complianceColumns = [
  {
    key: "center",
    title: "Center",
  },
  {
    key: "budgetCompliance",
    title: "Budget Compliance",
    render: (value: string) => {
      let color = "text-nadi-success";
      if (value === "Over Budget") color = "text-nadi-alert";
      if (value === "Under Budget") color = "text-nadi-warning";

      return <span className={color}>{value || "N/A"}</span>;
    },
  },
  {
    key: "delayFlags",
    title: "Delay Flags",
    render: (value: number) => {
      return typeof value === "number" && value > 0 ? (
        <span className="text-nadi-alert font-medium">{value}</span>
      ) : (
        <span>{value || 0}</span>
      );
    },
  },
];

export function MCMCPage() {
  const handleGenerateReport = () => {
    toast.success("Generating compliance report", {
      description: "The report will be available for download shortly.",
    });

    // Simulate report generation delay
    setTimeout(() => {
      toast.info("Report ready for download", {
        action: {
          label: "Download",
          onClick: () => toast.success("Report downloaded"),
        },
      });
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total National Payroll"
          value="RM 3,450,200"
          trend={{ value: 1.8, isPositive: true }}
        />
        <StatCard title="% Paid On Time" value="92%" colorVariant="success" />
        <StatCard
          title="% Variance from Budget"
          value="+3.2%"
          colorVariant="warning"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Regional Payroll Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
            Bar chart visualization will appear here
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Payment Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
            Line chart visualization will appear here
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Compliance Check</h2>
          <Button
            className="bg-nadi-purple hover:bg-nadi-purple-light gap-2"
            onClick={handleGenerateReport}
          >
            <FileText size={16} />
            Generate Report
          </Button>
        </div>
        <PayrollTable data={complianceData} columns={complianceColumns} />
      </div>
    </div>
  );
}
