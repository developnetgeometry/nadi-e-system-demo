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

interface InsurancePageViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any; // Data to display
}

const InsurancePageView: React.FC<InsurancePageViewProps> = ({
  open,
  onOpenChange,
  data,
}) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insurance Details</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="space-y-6">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Description</TableCell>
                  <TableCell>{data.description || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Incident Type</TableCell>
                  <TableCell>{data.type_name || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Insurance Type</TableCell>
                  <TableCell>{data.insurance_type_name || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Start Date</TableCell>
                  <TableCell>
                    {data.start_date
                      ? new Intl.DateTimeFormat("en-GB").format(new Date(data.start_date))
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">End Date</TableCell>
                  <TableCell>
                    {data.end_date
                      ? new Intl.DateTimeFormat("en-GB").format(new Date(data.end_date))
                      : "N/A"}
                  </TableCell>
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
                        View File
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

export default InsurancePageView;