import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayrollRecord } from "@/types/payroll";
import { Edit, Trash2, Eye, FileText, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { usePayslipDownload } from "@/hooks/use-payslip-download";

interface EnhancedPayrollTableProps {
  data: PayrollRecord[];
  onEdit?: (record: PayrollRecord) => void;
  onDelete?: (recordId: string) => void;
  onViewDetails?: (record: PayrollRecord) => void;
  isTPUser?: boolean;
  isStaffUser?: boolean;
  userId?: string;
}

export function EnhancedPayrollTable({
  data,
  onEdit,
  onDelete,
  onViewDetails,
  isTPUser = false,
  isStaffUser = false,
  userId,
}: EnhancedPayrollTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(
    null
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { downloadPayslip, isDownloading } = usePayslipDownload();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft", className: "" },
      pending: { variant: "default" as const, label: "Pending", className: "" },
      approved: {
        variant: "outline" as const,
        label: "Approved",
        className: "",
      },
      paid: {
        variant: "outline" as const,
        label: "Paid",
        className: "bg-green-100 text-green-800 border-green-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <Badge variant={config.variant} className={config.className || ""}>
        {config.label}
      </Badge>
    );
  };

  const handleViewDetails = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setShowDetailsDialog(true);
    onViewDetails?.(record);
  };

  const formatCurrency = (amount: number) => `RM ${amount.toLocaleString()}`;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Gross Pay</TableHead>
              <TableHead>Total Deductions</TableHead>
              <TableHead>Net Pay</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No payroll records found
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.employeeName}</div>
                      <div className="text-sm text-gray-500">
                        {record.position}
                      </div>
                      {isTPUser && (
                        <div className="text-xs text-gray-400">
                          {record.organizationName}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{record.siteName || "N/A"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {months[record.month - 1]} {record.year}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(record.earnings.grossPay)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(record.totalEmployeeDeductions)}
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(record.netPay)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(record)}
                      >
                        <Eye size={16} />
                      </Button>
                      {isStaffUser && userId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadPayslip(record.id, userId)}
                          disabled={isDownloading}
                          title="Download Payslip"
                        >
                          <Download size={16} />
                        </Button>
                      )}
                      {isTPUser && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(record)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete?.(record.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Payroll Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText size={20} />
              Payroll Details - {selectedRecord?.employeeName}
            </DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Employee Information</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Name:</strong> {selectedRecord.employeeName}
                    </div>
                    <div>
                      <strong>Position:</strong> {selectedRecord.position}
                    </div>
                    <div>
                      <strong>Organization:</strong>{" "}
                      {selectedRecord.organizationName}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Period Information</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Month:</strong> {months[selectedRecord.month - 1]}{" "}
                      {selectedRecord.year}
                    </div>
                    <div>
                      <strong>Pay To Date:</strong>{" "}
                      {new Date(selectedRecord.payToDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(selectedRecord.status)}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Earnings */}
              <div>
                <h3 className="font-semibold mb-3">Earnings</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Basic Pay</div>
                      <div className="font-medium">
                        {formatCurrency(selectedRecord.earnings.basicPay)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Allowance</div>
                      <div className="font-medium">
                        {formatCurrency(selectedRecord.earnings.allowance)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Gross Pay</div>
                      <div className="font-bold text-lg">
                        {formatCurrency(selectedRecord.earnings.grossPay)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employer Deductions */}
              {selectedRecord.employerDeductions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Employer Deductions</h3>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      {selectedRecord.employerDeductions.map(
                        (deduction, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>{deduction.name}</span>
                            <span className="font-medium">
                              {formatCurrency(deduction.amount)}
                            </span>
                          </div>
                        )
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total Employer Deductions</span>
                        <span>
                          {formatCurrency(
                            selectedRecord.totalEmployerDeductions
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Employee Deductions */}
              {selectedRecord.employeeDeductions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Employee Deductions</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      {selectedRecord.employeeDeductions.map(
                        (deduction, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>{deduction.name}</span>
                            <span className="font-medium">
                              {formatCurrency(deduction.amount)}
                            </span>
                          </div>
                        )
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total Employee Deductions</span>
                        <span>
                          {formatCurrency(
                            selectedRecord.totalEmployeeDeductions
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-600 text-sm">
                      Basic Rate (Gross Pay)
                    </div>
                    <div className="font-bold text-lg">
                      {formatCurrency(selectedRecord.basicRate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Net Pay</div>
                    <div className="font-bold text-2xl text-green-600">
                      {formatCurrency(selectedRecord.netPay)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 border-t pt-4">
                <div>
                  Created: {new Date(selectedRecord.createdAt).toLocaleString()}
                </div>
                <div>
                  Last Updated:{" "}
                  {new Date(selectedRecord.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
