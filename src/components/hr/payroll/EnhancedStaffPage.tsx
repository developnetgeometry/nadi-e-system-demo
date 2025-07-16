import { useState, useEffect, useMemo } from "react";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { StatCard } from "@/components/hr/payroll/StatCard";
import { EnhancedPayrollTable } from "@/components/hr/payroll/EnhancedPayrollTable";
import { EnhancedPayrollFilters } from "@/components/hr/payroll/EnhancedPayrollFilters";
import { PayrollService } from "@/services/payroll-service";
import { PayrollRecord, PayrollFilter } from "@/types/payroll";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Banknote,
  CircleDollarSign,
  HandCoins,
  FileText,
} from "lucide-react";

export function EnhancedStaffPage() {
  const { toast } = useToast();
  const userMetadata = useUserMetadata();

  // State management
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState<PayrollFilter>({
    search: "",
    month: undefined,
    year: undefined,
    status: undefined,
  });

  // Parse user metadata to get user ID
  const userId = useMemo(() => {
    if (!userMetadata) return null;

    console.log("Raw userMetadata:", userMetadata);

    try {
      // If it's already a plain string UUID, use it directly
      if (typeof userMetadata === "string" && !userMetadata.startsWith("{")) {
        return userMetadata;
      }

      // If it's a JSON string, parse it
      if (userMetadata.startsWith("{")) {
        const parsed = JSON.parse(userMetadata);
        console.log("Parsed userMetadata:", parsed);

        // Try different possible user ID fields
        return (
          parsed.user_id || parsed.id || parsed.group_profile?.user_id || null
        );
      }
    } catch (error) {
      console.error("Error parsing user metadata:", error);
    }

    return null;
  }, [userMetadata]);

  // Load payroll records for the current user
  useEffect(() => {
    console.log(
      "useEffect triggered - userId:",
      userId,
      "userMetadata:",
      userMetadata
    );

    if (userId) {
      loadPayrollRecords();
    } else {
      console.warn("No userId found, cannot load payroll records");
      setIsLoading(false);
    }
  }, [userId, filters]);

  const loadPayrollRecords = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      console.log("Loading payroll records for staff user:", userId);

      // Use the dedicated staff payroll method instead of the general one
      const payrollData = await PayrollService.fetchStaffOwnPayroll(
        userId,
        filters
      );

      console.log("Loaded payroll data:", payrollData);
      setPayrollRecords(payrollData);
    } catch (error) {
      console.error("Error loading payroll records:", error);
      toast({
        title: "Error",
        description: "Failed to load your payroll data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter payroll records based on search
  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          record.organizationName.toLowerCase().includes(searchLower) ||
          `${record.month}/${record.year}`.includes(searchLower);

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [payrollRecords, filters.search]);

  // Calculate statistics
  const stats = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentYearRecords = filteredRecords.filter(
      (record) => record.year === currentYear
    );

    const latestRecord = filteredRecords[0]; // Assuming records are sorted by date desc
    const totalYearlyGross = currentYearRecords.reduce(
      (sum, record) => sum + record.earnings.grossPay,
      0
    );
    const totalYearlyNet = currentYearRecords.reduce(
      (sum, record) => sum + record.netPay,
      0
    );
    const totalYearlyDeductions = currentYearRecords.reduce(
      (sum, record) => sum + record.totalEmployeeDeductions,
      0
    );

    return {
      currentSalary: latestRecord?.earnings.grossPay || 0,
      currentIncentives: latestRecord?.earnings.allowance || 0,
      yearlyIncome: totalYearlyNet,
      yearlyDeductions: totalYearlyDeductions,
      totalRecords: filteredRecords.length,
    };
  }, [filteredRecords]);

  const handleDownloadAnnualStatement = () => {
    const currentYear = new Date().getFullYear();
    toast({
      title: "Downloading annual income statement",
      description: `Your annual income statement for ${currentYear} is being prepared.`,
    });

    setTimeout(() => {
      toast({
        title: "Annual income statement downloaded",
      });
    }, 1500);
  };

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] || "Unknown";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your payroll data...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Unable to load payroll data
          </h3>
          <p className="text-gray-600">
            User authentication information is not available. Please try logging
            out and logging in again.
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Debug info: userMetadata = {JSON.stringify(userMetadata)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Current Monthly Salary"
          value={`RM ${stats.currentSalary.toLocaleString()}`}
          icon={<CircleDollarSign size={24} className="text-blue-500" />}
          colorVariant="primary"
          backgroundColor="bg-blue-50"
          textColor="text-blue-700"
        />
        <StatCard
          title="Current Allowances"
          value={`RM ${stats.currentIncentives.toLocaleString()}`}
          icon={<HandCoins size={24} className="text-green-500" />}
          colorVariant="success"
          backgroundColor="bg-green-50"
          textColor="text-green-700"
        />
        <StatCard
          title="Year-to-Date Income"
          value={`RM ${stats.yearlyIncome.toLocaleString()}`}
          icon={<Banknote size={24} className="text-gray-500" />}
          colorVariant="default"
          backgroundColor="bg-gray-50"
          textColor="text-gray-700"
        />
        <StatCard
          title="Total Deductions (YTD)"
          value={`RM ${stats.yearlyDeductions.toLocaleString()}`}
          icon={<FileText size={24} className="text-orange-500" />}
          colorVariant="warning"
          backgroundColor="bg-orange-50"
          textColor="text-orange-700"
        />
      </div>

      {/* Header and Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Payroll History</h2>
          <p className="text-gray-600 mt-1">
            View your salary history, deductions, and download payslips
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleDownloadAnnualStatement}
        >
          <Download size={16} />
          Download Annual Statement
        </Button>
      </div>

      {/* Filters - simplified for staff view */}
      <EnhancedPayrollFilters
        filters={filters}
        onFiltersChange={setFilters}
        employees={[]} // Staff don't need employee filter
        isTPUser={false}
      />

      {/* Payroll Table */}
      <EnhancedPayrollTable
        data={filteredRecords}
        isTPUser={false}
        isStaffUser={true}
        userId={userId}
      />

      {/* No data message */}
      {filteredRecords.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No payroll records found
          </h3>
          <p className="text-gray-600">
            Your payroll records will appear here once they are processed by
            your organization.
          </p>
        </div>
      )}

      {/* Payroll Breakdown for Latest Record */}
      {filteredRecords.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            Latest Payroll Breakdown
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <h4 className="font-medium text-green-700 mb-3">Earnings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Basic Pay:</span>
                  <span className="font-medium">
                    RM {filteredRecords[0].earnings.basicPay.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Allowances:</span>
                  <span className="font-medium">
                    RM {filteredRecords[0].earnings.allowance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Gross Pay:</span>
                  <span>
                    RM {filteredRecords[0].earnings.grossPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="font-medium text-red-700 mb-3">Deductions</h4>
              <div className="space-y-2 text-sm">
                {filteredRecords[0].employeeDeductions.map(
                  (deduction, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{deduction.name}:</span>
                      <span className="font-medium">
                        RM {deduction.amount.toLocaleString()}
                      </span>
                    </div>
                  )
                )}
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total Deductions:</span>
                  <span>
                    RM{" "}
                    {filteredRecords[0].totalEmployeeDeductions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 text-green-600">
                  <span>Net Pay:</span>
                  <span>RM {filteredRecords[0].netPay.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information Notice */}
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm text-blue-700">
        <p>
          <strong>Note:</strong> Payslips are typically processed by the 15th of
          each month. If you have any questions about your payroll, please
          contact your HR department or organization administrator.
        </p>
      </div>
    </div>
  );
}
