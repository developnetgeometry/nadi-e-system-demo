import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface BillingPageViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any; // Data to display
}

const BillingPageView: React.FC<BillingPageViewProps> = ({
  open,
  onOpenChange,
  data,
}) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Billing Details</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="space-y-6">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">ID</TableCell>
                  <TableCell>{data.id || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Type</TableCell>
                  <TableCell>{data.type_name || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Year</TableCell>
                  <TableCell>{data.year || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Month</TableCell>
                  <TableCell>{data.month || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Reference No</TableCell>
                  <TableCell>{data.reference_no || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Amount</TableCell>
                  <TableCell>{data.amount_bill || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Remark</TableCell>
                  <TableCell>{data.remark || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">File</TableCell>
                  <TableCell>
                    {data.file_path ? (
                      <a
                        href={data.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogDescription>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingPageView;