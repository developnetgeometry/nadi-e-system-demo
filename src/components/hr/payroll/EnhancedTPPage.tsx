import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { StatCard } from "@/components/hr/payroll/StatCard";
import { EnhancedPayrollTable } from "@/components/hr/payroll/EnhancedPayrollTable";
import { EnhancedPayrollFilters } from "@/components/hr/payroll/EnhancedPayrollFilters";
import { PayrollForm } from "@/components/hr/payroll/PayrollForm";
import { PayrollService } from "@/services/payroll-service";
import {
  PayrollRecord,
  PayrollFormData,
  PayrollFilter,
  StaffEmployee,
} from "@/types/payroll";
import {
  Plus,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function EnhancedTPPage() {
  const { toast } = useToast();
  const userMetadata = useUserMetadata();

  // State management
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<StaffEmployee[]>([]);
  const [sites, setSites] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPayrollForm, setShowPayrollForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(
    null
  );
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);

  // Debug useEffect to track employees state changes
  useEffect(() => {
    console.log("=== EnhancedTPPage - Employees state changed ===");
    console.log("Employees length:", employees.length);
    console.log("Employees data:", employees);
  }, [employees]);

  // Filter state
  const [filters, setFilters] = useState<PayrollFilter>({
    search: "",
    month: undefined,
    year: undefined,
    status: undefined,
    staffId: undefined,
    siteId: undefined,
  });

  // Parse user metadata to get organization ID
  const organizationId = useMemo(() => {
    if (!userMetadata) return null;

    try {
      if (userMetadata.startsWith("{")) {
        const parsed = JSON.parse(userMetadata);
        return parsed.organization_id;
      }
    } catch (error) {
      console.error("Error parsing user metadata:", error);
    }
    return null;
  }, [userMetadata]);

  // Load initial data
  useEffect(() => {
    console.log("=== EnhancedTPPage useEffect triggered ===");
    console.log("organizationId:", organizationId);
    if (organizationId) {
      console.log("Calling loadData...");
      loadData();
    } else {
      console.log("No organizationId, not calling loadData");
    }
  }, [organizationId]);

  const loadData = async () => {
    if (!organizationId) return;

    console.log("=== DEBUG: EnhancedTPPage loadData ===");
    console.log("Organization ID from userMetadata:", organizationId);
    console.log("User metadata raw:", userMetadata);

    setIsLoading(true);
    try {
      console.log("Calling PayrollService.fetchEmployees...");
      const [employeesData, payrollData] = await Promise.all([
        PayrollService.fetchEmployees(organizationId),
        PayrollService.fetchPayrollRecords(filters, organizationId),
      ]);

      console.log("Employees data received:", employeesData);
      console.log("Payroll data received:", payrollData);

      setEmployees(employeesData);
      setPayrollRecords(payrollData);

      // Extract unique sites from employees
      const uniqueSites = Array.from(
        new Map(
          employeesData
            .filter((emp) => emp.siteName && emp.siteId)
            .map((emp) => [
              emp.siteId,
              { id: emp.siteId!, name: emp.siteName! },
            ])
        ).values()
      );
      setSites(uniqueSites);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load payroll data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reload payroll records when filters change
  useEffect(() => {
    if (organizationId) {
      loadPayrollRecords();
    }
  }, [filters, organizationId]);

  const loadPayrollRecords = async () => {
    if (!organizationId) return;

    try {
      const payrollData = await PayrollService.fetchPayrollRecords(
        filters,
        organizationId
      );
      setPayrollRecords(payrollData);
    } catch (error) {
      console.error("Error loading payroll records:", error);
    }
  };

  // Filter payroll records based on search and filters
  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          record.employeeName.toLowerCase().includes(searchLower) ||
          record.position.toLowerCase().includes(searchLower) ||
          record.organizationName.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [payrollRecords, filters.search]);

  // Calculate statistics
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const currentMonthRecords = filteredRecords.filter(
      (record) => record.month === currentMonth && record.year === currentYear
    );

    const totalGrossPay = currentMonthRecords.reduce(
      (sum, record) => sum + record.earnings.grossPay,
      0
    );
    const totalNetPay = currentMonthRecords.reduce(
      (sum, record) => sum + record.netPay,
      0
    );
    const totalDeductions = currentMonthRecords.reduce(
      (sum, record) => sum + record.totalEmployeeDeductions,
      0
    );
    const pendingRecords = currentMonthRecords.filter(
      (record) => record.status === "pending"
    ).length;

    return {
      totalEmployees: employees.length,
      currentMonthRecords: currentMonthRecords.length,
      totalGrossPay,
      totalNetPay,
      totalDeductions,
      pendingRecords,
    };
  }, [filteredRecords, employees]);

  const handleAddPayroll = () => {
    setEditingRecord(null);
    setShowPayrollForm(true);
  };

  const handleEditPayroll = (record: PayrollRecord) => {
    setEditingRecord(record);
    setShowPayrollForm(true);
  };

  const handleSavePayroll = async (
    formData: PayrollFormData
  ): Promise<boolean> => {
    if (!organizationId || !userMetadata) return false;

    try {
      const success = await PayrollService.savePayrollRecord(
        formData,
        organizationId,
        userMetadata
      );
      if (success) {
        await loadPayrollRecords();
        setShowPayrollForm(false);
        setEditingRecord(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving payroll record:", error);
      return false;
    }
  };

  const handleDeletePayroll = async () => {
    if (!deleteRecordId) return;

    try {
      const success = await PayrollService.deletePayrollRecord(deleteRecordId);
      if (success) {
        await loadPayrollRecords();
        toast({
          title: "Success",
          description: "Payroll record deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete payroll record",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting payroll record:", error);
      toast({
        title: "Error",
        description: "Failed to delete payroll record",
        variant: "destructive",
      });
    } finally {
      setDeleteRecordId(null);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast({
      title: "Export functionality",
      description: "Export feature will be implemented soon",
    });
  };

  const convertRecordToFormData = (record: PayrollRecord): PayrollFormData => {
    return {
      staffId: record.staffId,
      month: record.month,
      year: record.year,
      payToDate: record.payToDate,
      earnings: record.earnings,
      employerDeductions: record.employerDeductions,
      employeeDeductions: record.employeeDeductions,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees.toString()}
          icon={<Users size={24} className="text-blue-500" />}
          colorVariant="primary"
        />
        <StatCard
          title="Current Month Payroll"
          value={`RM ${stats.totalNetPay.toLocaleString()}`}
          icon={<DollarSign size={24} className="text-green-500" />}
          colorVariant="success"
        />
        <StatCard
          title="Total Deductions"
          value={`RM ${stats.totalDeductions.toLocaleString()}`}
          icon={<TrendingUp size={24} className="text-orange-500" />}
          colorVariant="warning"
        />
        <StatCard
          title="Pending Records"
          value={stats.pendingRecords.toString()}
          icon={<AlertTriangle size={24} className="text-red-500" />}
          colorVariant="danger"
        />
      </div>

      {/* Header and Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payroll Management</h2>
          <p className="text-gray-600 mt-1">
            Manage payroll records for staff under your organization
          </p>
        </div>
        <Button
          onClick={handleAddPayroll}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus size={16} />
          Add Payroll Record
        </Button>
      </div>

      {/* Filters */}
      <EnhancedPayrollFilters
        filters={filters}
        onFiltersChange={setFilters}
        employees={employees}
        sites={sites}
        onExport={handleExport}
        isTPUser={true}
      />

      {/* Payroll Table */}
      <EnhancedPayrollTable
        data={filteredRecords}
        onEdit={handleEditPayroll}
        onDelete={setDeleteRecordId}
        isTPUser={true}
      />

      {/* No data message */}
      {filteredRecords.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No payroll records found
          </h3>
          <p className="text-gray-600 mb-6">
            {employees.length === 0
              ? "No employees found under your organization."
              : "Start by adding your first payroll record."}
          </p>
          {employees.length > 0 && (
            <Button onClick={handleAddPayroll} className="gap-2">
              <Plus size={16} />
              Add First Payroll Record
            </Button>
          )}
        </div>
      )}

      {/* Payroll Form Dialog */}
      <PayrollForm
        isOpen={showPayrollForm}
        onClose={() => {
          setShowPayrollForm(false);
          setEditingRecord(null);
        }}
        onSave={handleSavePayroll}
        employees={employees}
        initialData={
          editingRecord ? convertRecordToFormData(editingRecord) : null
        }
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteRecordId}
        onOpenChange={() => setDeleteRecordId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payroll Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payroll record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayroll}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Information Notice */}
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm text-blue-700">
        <p>
          <strong>Note:</strong> You can manage payroll records for staff
          members (NADI Manager and NADI Assistant Manager) under your
          organization. All payroll calculations include basic pay, allowances,
          and various deductions as per Malaysian employment standards.
        </p>
      </div>
    </div>
  );
}
