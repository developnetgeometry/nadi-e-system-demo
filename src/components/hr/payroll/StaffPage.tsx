import { StatCard } from "@/components/hr/payroll/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

// Helper function to safely format currency values
const formatCurrency = (value?: number) => {
  return typeof value === "number" ? value.toLocaleString() : "0";
};

// Helper function to safely format dates
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-MY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

// Mock payslip data
const payslips = [
  { id: 1, month: "April 2025", date: "2025-04-28", amount: 5400 },
  { id: 2, month: "March 2025", date: "2025-03-28", amount: 5400 },
  { id: 3, month: "February 2025", date: "2025-02-28", amount: 5100 },
];

export function StaffPage() {
  const handleDownloadPayslip = (month: string) => {
    toast.success(`Downloading ${month} payslip PDF`);

    // Simulate download delay
    setTimeout(() => {
      toast.info(`${month} payslip downloaded successfully`);
    }, 1500);
  };

  const handleContactSupport = () => {
    toast.info("Opening support message form", {
      description: "You will be contacted by Finance Support shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Current Month Salary"
          value="RM 5,400"
          icon={<Calendar size={18} />}
        />
        <StatCard title="Allowance" value="RM 800" />
        <StatCard
          title="Last Payment Date"
          value="April 28, 2025"
          colorVariant={
            new Date() < new Date("2025-04-28") ? "warning" : "success"
          }
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>My Payslips</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <HelpCircle size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Download your monthly payslips as PDF
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-sm px-3 py-1 rounded-full bg-nadi-gray-dark">
            <span className="text-nadi-purple font-medium">
              Salary Processed
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payslips.map((payslip) => (
              <div
                key={payslip.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div>
                  <h3 className="font-medium">{payslip.month}</h3>
                  <p className="text-sm text-muted-foreground">
                    Paid: {formatDate(payslip.date)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">
                    RM {formatCurrency(payslip.amount)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDownloadPayslip(payslip.month)}
                  >
                    <Download size={14} />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm">
        <div className="flex items-start gap-2">
          <HelpCircle size={18} className="text-blue-700 mt-0.5" />
          <div>
            <p className="text-blue-700 font-medium">Need help?</p>
            <p className="text-blue-600">
              If you have questions about your salary or benefits,
              <Button
                variant="link"
                className="h-auto p-0 text-blue-700 underline"
                onClick={handleContactSupport}
              >
                contact Finance Support
              </Button>{" "}
              at finance@nadi-esystem.gov.my or call ext. 2143.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
