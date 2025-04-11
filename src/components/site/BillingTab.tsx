import React from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Settings, Trash2 } from "lucide-react";

const BillingTab = ({
  filteredBillingData,
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter,
  typeFilter,
  setTypeFilter,
  handleDelete,
  setSelectedBillingData,
  setIsDialogOpen,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <input
          type="number"
          placeholder="Year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
        <input
          type="number"
          placeholder="Month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
        <input
          type="text"
          placeholder="Utility Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Billing Type</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBillingData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.month}</TableCell>
              <TableCell>{item.type_name}</TableCell>
              <TableCell>
                {item.file_path ? (
                  <a
                    href={item.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedBillingData(item);
                    setIsDialogOpen(true);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BillingTab;