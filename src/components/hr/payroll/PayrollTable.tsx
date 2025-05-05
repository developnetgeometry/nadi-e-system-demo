import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/use-users";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FileText, Download, Printer } from "lucide-react";

interface PayrollTableProps {
  data: any[];
  columns: {
    key: string;
    title: string;
    render?: (value: any, record: any) => React.ReactNode;
  }[];
}

export function PayrollTable({ data, columns }: PayrollTableProps) {
  const { useUsersQuery } = useUsers();
  const user_type = useUsersQuery()?.data?.[0]?.user_type || "Guest";
  const isEditable = user_type === "Super Admin";
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
    toast.info(`Viewing details for ${record.name || "record"}`);
  };

  const handleApproveRecord = (record: any) => {
    if (record.status === "Pending") {
      toast.success(`Approved payment for ${record.name || "record"}`);
    } else {
      toast.info(`Payment already approved for ${record.name || "record"}`);
    }
  };

  const handleFlagRecord = (record: any) => {
    toast.warning(`Flagged ${record.name || "record"} for review`);
  };

  const handlePrintRecord = () => {
    if (!selectedRecord) return;
    toast.info(`Printing payslip for ${selectedRecord.name}`);
  };

  const handleDownloadRecord = () => {
    if (!selectedRecord) return;
    toast.success(`Downloading payslip for ${selectedRecord.name}`);
  };

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

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-nadi-gray">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="font-medium">
                {column.title}
              </TableHead>
            ))}
            {isEditable && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow key={index} className="hover:bg-muted/50">
              {columns.map((column) => (
                <TableCell key={`${index}-${column.key}`}>
                  {column.render
                    ? column.render(record[column.key], record)
                    : record[column.key]}
                </TableCell>
              ))}
              {isEditable && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewRecord(record)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={
                        record.status === "Pending"
                          ? "text-nadi-purple"
                          : "text-muted-foreground"
                      }
                      onClick={() => handleApproveRecord(record)}
                    >
                      {record.status === "Pending" ? "Approve" : "Approved"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-nadi-alert"
                      onClick={() => handleFlagRecord(record)}
                    >
                      Flag
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payroll Record Details</DialogTitle>
            <DialogDescription>
              {selectedRecord
                ? `Details for ${selectedRecord.name}`
                : "Loading details..."}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="text-sm text-muted-foreground">Staff Name:</div>
                <div className="text-sm font-medium">
                  {selectedRecord.name || "N/A"}
                </div>

                <div className="text-sm text-muted-foreground">Role:</div>
                <div className="text-sm font-medium">
                  {selectedRecord.role || "N/A"}
                </div>

                <div className="text-sm text-muted-foreground">Center:</div>
                <div className="text-sm font-medium">
                  {selectedRecord.center || "N/A"}
                </div>

                <div className="text-sm text-muted-foreground">
                  Monthly Salary:
                </div>
                <div className="text-sm font-medium">
                  RM {formatCurrency(selectedRecord.salary)}
                </div>

                <div className="text-sm text-muted-foreground">Allowance:</div>
                <div className="text-sm font-medium">
                  RM {formatCurrency(selectedRecord.allowance)}
                </div>

                <div className="text-sm text-muted-foreground">
                  Total Monthly:
                </div>
                <div className="text-sm font-medium">
                  RM{" "}
                  {formatCurrency(
                    typeof selectedRecord.salary === "number" &&
                      typeof selectedRecord.allowance === "number"
                      ? selectedRecord.salary + selectedRecord.allowance
                      : undefined
                  )}
                </div>

                <div className="text-sm text-muted-foreground">Status:</div>
                <div
                  className={`text-sm font-medium ${
                    selectedRecord.status === "Paid"
                      ? "text-nadi-success"
                      : "text-nadi-warning"
                  }`}
                >
                  {selectedRecord.status || "N/A"}
                </div>

                <div className="text-sm text-muted-foreground">
                  Last Paid Date:
                </div>
                <div className="text-sm font-medium">
                  {formatDate(selectedRecord.lastPaid)}
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-3">
                <h4 className="mb-2 text-sm font-medium">Payment History</h4>
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between mb-1">
                    <span>April 2025</span>
                    <span>
                      RM{" "}
                      {formatCurrency(
                        typeof selectedRecord.salary === "number" &&
                          typeof selectedRecord.allowance === "number"
                          ? selectedRecord.salary + selectedRecord.allowance
                          : undefined
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>March 2025</span>
                    <span>
                      RM{" "}
                      {formatCurrency(
                        typeof selectedRecord.salary === "number" &&
                          typeof selectedRecord.allowance === "number"
                          ? selectedRecord.salary + selectedRecord.allowance
                          : undefined
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>February 2025</span>
                    <span>
                      RM{" "}
                      {formatCurrency(
                        typeof selectedRecord.salary === "number" &&
                          typeof selectedRecord.allowance === "number"
                          ? selectedRecord.salary + selectedRecord.allowance
                          : undefined
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadRecord}
                className="gap-2"
              >
                <Download size={16} />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintRecord}
                className="gap-2"
              >
                <Printer size={16} />
                Print
              </Button>
            </div>
            <Button
              size="sm"
              className="bg-nadi-purple hover:bg-nadi-purple/90"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
