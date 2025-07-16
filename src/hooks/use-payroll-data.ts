import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PayrollService } from "@/services/payroll-service";
import {
  PayrollRecord,
  PayrollFormData,
  PayrollFilter,
  StaffEmployee,
} from "@/types/payroll";
import { useToast } from "@/hooks/use-toast";

export function usePayrollData(
  organizationId: string | null,
  filters: PayrollFilter
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch staff employees
  const {
    data: employees = [],
    isLoading: isLoadingEmployees,
    error: employeesError,
  } = useQuery({
    queryKey: ["staffEmployees", organizationId],
    queryFn: () =>
      organizationId
        ? PayrollService.fetchStaffEmployees(organizationId)
        : Promise.resolve([]),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch payroll records
  const {
    data: payrollRecords = [],
    isLoading: isLoadingPayroll,
    error: payrollError,
    refetch: refetchPayroll,
  } = useQuery({
    queryKey: ["payrollRecords", organizationId, filters],
    queryFn: () =>
      organizationId
        ? PayrollService.fetchPayrollRecords(filters, organizationId)
        : Promise.resolve([]),
    enabled: !!organizationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Save payroll record mutation
  const savePayrollMutation = useMutation({
    mutationFn: ({
      formData,
      userId,
    }: {
      formData: PayrollFormData;
      userId: string;
    }) => {
      if (!organizationId) throw new Error("Organization ID is required");
      return PayrollService.savePayrollRecord(formData, organizationId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payrollRecords", organizationId],
      });
      toast({
        title: "Success",
        description: "Payroll record saved successfully",
      });
    },
    onError: (error) => {
      console.error("Error saving payroll record:", error);
      toast({
        title: "Error",
        description: "Failed to save payroll record",
        variant: "destructive",
      });
    },
  });

  // Delete payroll record mutation
  const deletePayrollMutation = useMutation({
    mutationFn: (recordId: string) =>
      PayrollService.deletePayrollRecord(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payrollRecords", organizationId],
      });
      toast({
        title: "Success",
        description: "Payroll record deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting payroll record:", error);
      toast({
        title: "Error",
        description: "Failed to delete payroll record",
        variant: "destructive",
      });
    },
  });

  // Calculate statistics
  const stats = {
    totalEmployees: employees.length,
    totalRecords: payrollRecords.length,
    ...PayrollService.calculatePayrollStats(payrollRecords),
  };

  return {
    // Data
    employees,
    payrollRecords,
    stats,

    // Loading states
    isLoading: isLoadingEmployees || isLoadingPayroll,
    isLoadingEmployees,
    isLoadingPayroll,

    // Errors
    error: employeesError || payrollError,
    employeesError,
    payrollError,

    // Mutations
    savePayroll: savePayrollMutation.mutate,
    deletePayroll: deletePayrollMutation.mutate,
    isSaving: savePayrollMutation.isPending,
    isDeleting: deletePayrollMutation.isPending,

    // Refetch
    refetchPayroll,
    refetchAll: () => {
      queryClient.invalidateQueries({
        queryKey: ["staffEmployees", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["payrollRecords", organizationId],
      });
    },
  };
}

// Hook for staff to view their own payroll records
export function useStaffPayrollData(
  icNo: string | null,
  filters: PayrollFilter
) {
  const { toast } = useToast();

  // First get staff information
  const { data: staffInfo, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["staffInfo", icNo],
    queryFn: () =>
      icNo ? PayrollService.fetchStaffByIcNo(icNo) : Promise.resolve(null),
    enabled: !!icNo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: payrollRecords = [],
    isLoading: isLoadingPayroll,
    error,
    refetch,
  } = useQuery({
    queryKey: ["staffPayrollRecords", staffInfo?.id, filters],
    queryFn: () => {
      if (!staffInfo?.id) return Promise.resolve([]);
      const staffFilters = { ...filters, staffId: staffInfo.id };
      return PayrollService.fetchPayrollRecords(staffFilters);
    },
    enabled: !!staffInfo?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Calculate personal statistics
  const currentYear = new Date().getFullYear();
  const currentYearRecords = payrollRecords.filter(
    (record) => record.year === currentYear
  );

  const stats = {
    totalRecords: payrollRecords.length,
    currentYearRecords: currentYearRecords.length,
    yearlyGrossPay: currentYearRecords.reduce(
      (sum, record) => sum + record.earnings.grossPay,
      0
    ),
    yearlyNetPay: currentYearRecords.reduce(
      (sum, record) => sum + record.netPay,
      0
    ),
    yearlyDeductions: currentYearRecords.reduce(
      (sum, record) => sum + record.totalEmployeeDeductions,
      0
    ),
    latestRecord: payrollRecords[0] || null,
  };

  return {
    payrollRecords,
    staffInfo,
    stats,
    isLoading: isLoadingStaff || isLoadingPayroll,
    error,
    refetch,
  };
}
