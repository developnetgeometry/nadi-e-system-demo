import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  PayrollFormData,
  PayrollDeduction,
  StaffEmployee,
  COMMON_DEDUCTIONS,
} from "@/types/payroll";
import { Plus, Trash2, Calculator } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface PayrollFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PayrollFormData) => Promise<boolean>;
  employees: StaffEmployee[];
  initialData?: PayrollFormData | null;
}

export function PayrollForm({
  isOpen,
  onClose,
  onSave,
  employees,
  initialData,
}: PayrollFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Debug useEffect to track employees prop changes
  useEffect(() => {
    console.log("=== PayrollForm - Employees prop changed ===");
    console.log("Employees length:", employees.length);
    console.log("Employees data:", employees);
    if (employees.length > 0) {
      console.log("First employee:", employees[0]);
    } else {
      console.log("No employees found in props");
    }
  }, [employees]);

  const [formData, setFormData] = useState<PayrollFormData>({
    staffId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    payToDate: new Date().toISOString().split("T")[0],
    earnings: {
      basicPay: 0,
      allowance: 0,
      overtime: 0,
      customEarnings: [],
      performanceIncentive: {
        enabled: false,
        amount: 0,
      },
      grossPay: 0,
    },
    employerDeductions: [],
    employeeDeductions: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form when opening for new record
      setFormData({
        staffId: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        payToDate: new Date().toISOString().split("T")[0],
        earnings: {
          basicPay: 0,
          allowance: 0,
          overtime: 0,
          customEarnings: [],
          performanceIncentive: {
            enabled: false,
            amount: 0,
          },
          grossPay: 0,
        },
        employerDeductions: [],
        employeeDeductions: [],
      });
    }
  }, [initialData, isOpen]);

  // Calculate gross pay when any earnings component changes
  useEffect(() => {
    const customEarningsTotal =
      formData.earnings.customEarnings?.reduce(
        (sum, earning) => sum + earning.amount,
        0
      ) || 0;

    const performanceIncentiveAmount = formData.earnings.performanceIncentive
      ?.enabled
      ? formData.earnings.performanceIncentive.amount
      : 0;

    const grossPay =
      formData.earnings.basicPay +
      formData.earnings.allowance +
      formData.earnings.overtime +
      customEarningsTotal +
      performanceIncentiveAmount;

    if (grossPay !== formData.earnings.grossPay) {
      setFormData((prev) => ({
        ...prev,
        earnings: {
          ...prev.earnings,
          grossPay,
        },
      }));
    }
  }, [
    formData.earnings.basicPay,
    formData.earnings.allowance,
    formData.earnings.overtime,
    formData.earnings.customEarnings,
    formData.earnings.performanceIncentive,
  ]);

  const handleEarningsChange = (
    field: keyof typeof formData.earnings,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        [field]: value,
      },
    }));
  };

  const addDeduction = (type: "employer" | "employee") => {
    const newDeduction: PayrollDeduction = {
      id: Date.now().toString(),
      name: "",
      amount: 0,
      type,
      mandatory: false,
    };

    setFormData((prev) => ({
      ...prev,
      [`${type}Deductions`]: [...prev[`${type}Deductions`], newDeduction],
    }));
  };

  const updateDeduction = (
    type: "employer" | "employee",
    index: number,
    field: keyof PayrollDeduction,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}Deductions`]: prev[`${type}Deductions`].map((deduction, i) =>
        i === index ? { ...deduction, [field]: value } : deduction
      ),
    }));
  };

  const removeDeduction = (type: "employer" | "employee", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}Deductions`]: prev[`${type}Deductions`].filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addCommonDeduction = (
    type: "employer" | "employee",
    deductionName: string
  ) => {
    const commonDeduction = COMMON_DEDUCTIONS[type].find(
      (d) => d.name === deductionName
    );
    if (!commonDeduction) return;

    const calculatedAmount =
      (formData.earnings.grossPay * commonDeduction.percentage) / 100;

    const newDeduction: PayrollDeduction = {
      id: Date.now().toString(),
      name: deductionName,
      amount: calculatedAmount,
      type,
      mandatory: true,
    };

    setFormData((prev) => ({
      ...prev,
      [`${type}Deductions`]: [...prev[`${type}Deductions`], newDeduction],
    }));
  };

  const calculateTotals = () => {
    const totalEmployerDeductions = formData.employerDeductions.reduce(
      (sum, d) => sum + d.amount,
      0
    );
    const totalEmployeeDeductions = formData.employeeDeductions.reduce(
      (sum, d) => sum + d.amount,
      0
    );
    const netPay = formData.earnings.grossPay - totalEmployeeDeductions;

    return {
      totalEmployerDeductions,
      totalEmployeeDeductions,
      netPay,
      basicRate: formData.earnings.grossPay,
    };
  };

  const handleSubmit = async () => {
    if (!formData.staffId) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive",
      });
      return;
    }

    if (formData.earnings.basicPay <= 0) {
      toast({
        title: "Error",
        description: "Basic pay must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await onSave(formData);
      if (success) {
        toast({
          title: "Success",
          description: "Payroll record saved successfully",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to save payroll record",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomEarning = () => {
    const newEarning = {
      name: "",
      amount: 0,
    };

    setFormData((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        customEarnings: [...(prev.earnings.customEarnings || []), newEarning],
      },
    }));
  };

  const updateCustomEarning = (
    index: number,
    field: "name" | "amount",
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        customEarnings:
          prev.earnings.customEarnings?.map((earning, i) =>
            i === index ? { ...earning, [field]: value } : earning
          ) || [],
      },
    }));
  };

  const removeCustomEarning = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        customEarnings:
          prev.earnings.customEarnings?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const togglePerformanceIncentive = (enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        performanceIncentive: {
          enabled,
          amount: enabled ? prev.earnings.performanceIncentive?.amount || 0 : 0,
        },
      },
    }));
  };

  const updatePerformanceIncentiveAmount = (amount: number) => {
    setFormData((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        performanceIncentive: {
          ...prev.earnings.performanceIncentive,
          amount,
        },
      },
    }));
  };

  const totals = calculateTotals();

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Payroll Record" : "Add Payroll Record"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Select
                    value={formData.staffId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, staffId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.fullname} - {employee.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Debug Information - Remove this in production */}
                  {/* <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
                    <strong>Debug - Selected Staff ID:</strong>{" "}
                    {formData.staffId || "None"}
                    <br />
                    <strong>Employees Count:</strong> {employees.length}
                    <br />
                    {employees.length > 0 && (
                      <>
                        <strong>Sample Employee:</strong>{" "}
                        {JSON.stringify(employees[0], null, 2)}
                      </>
                    )}
                  </div> */}
                </div>

                <div>
                  <Label htmlFor="payToDate">Pay To Date</Label>
                  <Input
                    id="payToDate"
                    type="date"
                    value={formData.payToDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        payToDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="month">Month</Label>
                  <Select
                    value={formData.month.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        month: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={formData.year.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        year: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: 5 },
                        (_, i) => new Date().getFullYear() - 2 + i
                      ).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator size={20} />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="basicPay">Basic Pay (RM)</Label>
                  <Input
                    id="basicPay"
                    type="number"
                    value={formData.earnings.basicPay}
                    onChange={(e) =>
                      handleEarningsChange(
                        "basicPay",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="allowance">Allowance (RM)</Label>
                  <Input
                    id="allowance"
                    type="number"
                    value={formData.earnings.allowance}
                    onChange={(e) =>
                      handleEarningsChange(
                        "allowance",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="overtime">Overtime (RM)</Label>
                  <Input
                    id="overtime"
                    type="number"
                    value={formData.earnings.overtime}
                    onChange={(e) =>
                      handleEarningsChange(
                        "overtime",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <Label htmlFor="grossPay">Gross Pay (RM)</Label>
                  <Input
                    id="grossPay"
                    type="number"
                    value={formData.earnings.grossPay}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Custom Earnings */}
              <div className="mt-6">
                <Label className="block text-sm font-medium text-gray-700">
                  Custom Earnings
                </Label>
                <div className="space-y-3">
                  {formData.earnings.customEarnings?.map((earning, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-center border p-4 rounded-md"
                    >
                      <div className="flex-1">
                        <Label className="block text-xs font-medium text-gray-500">
                          Earning Name
                        </Label>
                        <Input
                          value={earning.name}
                          onChange={(e) =>
                            updateCustomEarning(index, "name", e.target.value)
                          }
                          placeholder="Enter earning name"
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="block text-xs font-medium text-gray-500">
                          Amount (RM)
                        </Label>
                        <Input
                          type="number"
                          value={earning.amount}
                          onChange={(e) =>
                            updateCustomEarning(
                              index,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCustomEarning(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addCustomEarning}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Custom Earning
                  </Button>
                </div>
              </div>

              {/* Performance Incentive */}
              <div className="mt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="performanceIncentive"
                    checked={
                      formData.earnings.performanceIncentive?.enabled || false
                    }
                    onCheckedChange={(checked) =>
                      togglePerformanceIncentive(checked as boolean)
                    }
                  />
                  <Label htmlFor="performanceIncentive">
                    Performance Incentive
                  </Label>
                </div>
                {formData.earnings.performanceIncentive?.enabled && (
                  <div className="mt-4">
                    <Label
                      htmlFor="performanceAmount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Performance Incentive Amount (RM)
                    </Label>
                    <Input
                      id="performanceAmount"
                      type="number"
                      value={formData.earnings.performanceIncentive.amount}
                      onChange={(e) =>
                        updatePerformanceIncentiveAmount(
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employer Deductions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employer Deductions</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {COMMON_DEDUCTIONS.employer.map((deduction) => (
                  <Button
                    key={deduction.name}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addCommonDeduction("employer", deduction.name)
                    }
                    disabled={formData.employerDeductions.some(
                      (d) => d.name === deduction.name
                    )}
                  >
                    Add {deduction.name} ({deduction.percentage}%)
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.employerDeductions.map((deduction, index) => (
                  <div key={deduction.id} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Label>Deduction Name</Label>
                      <Input
                        value={deduction.name}
                        onChange={(e) =>
                          updateDeduction(
                            "employer",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Enter deduction name"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Amount (RM)</Label>
                      <Input
                        type="number"
                        value={deduction.amount}
                        onChange={(e) =>
                          updateDeduction(
                            "employer",
                            index,
                            "amount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDeduction("employer", index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addDeduction("employer")}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add Custom Deduction
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employee Deductions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Deductions</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {COMMON_DEDUCTIONS.employee.map((deduction) => (
                  <Button
                    key={deduction.name}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addCommonDeduction("employee", deduction.name)
                    }
                    disabled={formData.employeeDeductions.some(
                      (d) => d.name === deduction.name
                    )}
                  >
                    Add {deduction.name} ({deduction.percentage}%)
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.employeeDeductions.map((deduction, index) => (
                  <div key={deduction.id} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Label>Deduction Name</Label>
                      <Input
                        value={deduction.name}
                        onChange={(e) =>
                          updateDeduction(
                            "employee",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Enter deduction name"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Amount (RM)</Label>
                      <Input
                        type="number"
                        value={deduction.amount}
                        onChange={(e) =>
                          updateDeduction(
                            "employee",
                            index,
                            "amount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDeduction("employee", index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addDeduction("employee")}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add Custom Deduction
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payroll Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    RM {formData.earnings.grossPay.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Gross Pay / Basic Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    RM {totals.totalEmployerDeductions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Employer Deductions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    RM {totals.totalEmployeeDeductions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Employee Deductions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    RM {totals.netPay.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Net Pay</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Payroll Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
