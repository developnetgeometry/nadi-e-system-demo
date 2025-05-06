import React, { useState, useEffect } from "react";
import { useSiteBilling } from "../hook/use-site-billing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableRowNumber } from "@/components/ui/TableRowNumber";
import { ArrowUp, ArrowDown, ArrowUpDown, FilePlus, Settings, Trash2 } from "lucide-react";
import BillingFormDialog from "../BillingFormDialog";
import { supabase } from "@/lib/supabase";
import { BUCKET_NAME_UTILITIES } from "@/integrations/supabase/client";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface BillingPageProps {
  siteId: string;
}

type SortDirection = "asc" | "desc" | null;
type SortField = "id" | "type_name" | "year" | "month" | "reference_no" | "amount_bill" | "remark" | null;

const BillingPage: React.FC<BillingPageProps> = ({ siteId }) => {
  const [refreshBilling, setRefreshBilling] = useState(false); // State to trigger re-fetch
  const { data, loading, error } = useSiteBilling(siteId, refreshBilling); // Pass refreshBilling to hook
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const [selectedBilling, setSelectedBilling] = useState<any>(null); // State to store the selected billing data

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const sortedData = () => {
    if (!sortField || !sortDirection) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = typeof bValue === "string" ? bValue.toLowerCase() : bValue;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleEdit = (billing: any) => {
    setSelectedBilling(billing); // Set the selected billing data
    setIsDialogOpen(true); // Open the dialog
  };

  // Trigger re-fetch when the dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      setRefreshBilling((prev) => !prev); // Toggle refreshBilling state
    }
  }, [isDialogOpen]);

  // Function to handle delete a record
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;

    try {
      const { data: attachmentData, error: attachmentError } = await supabase
        .from("nd_utilities_attachment") // Replace with your actual table name
        .select("file_path")
        .eq("utilities_id", id) // Assuming `utilities_id` links the file to the record
        .single();

      if (attachmentError) {
        console.warn("No associated file found or error fetching file path:", attachmentError);
        // Proceed with record deletion even if the file path is not found
      } else if (attachmentData?.file_path) {
        const filePath = attachmentData.file_path;

        // Extract the part of the file path after "//"
        const relativeFilePath = filePath.split(`${BUCKET_NAME_UTILITIES}/`)[1];

        // Delete the file from storage
        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME_UTILITIES) // Replace with your storage bucket name
          .remove([relativeFilePath]);

        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          alert("Failed to delete the associated file. Please try again.");
          return;
        }
      }

      // Proceed with record deletion
      const { error } = await supabase
        .from("nd_utilities")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting record:", error);
        alert("An error occurred while deleting the record.");
        return;
      }

      alert("Record and associated file deleted successfully.");
      setRefreshBilling((prev) => !prev); // Toggle refreshBilling state to trigger re-fetch
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const sorted = sortedData();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Billing Information</h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="w-full md:w-[400px]">
          {/* Optional: search or input field can go here */}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={() => {
              setSelectedBilling(null); // Clear selected billing for new entry
              setIsDialogOpen(true); // Open the dialog
            }}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Add New Billing
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">No.</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("id")}
                  className="p-0 hover:bg-transparent font-medium flex items-center"
                >
                  ID{renderSortIcon("id")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("type_name")}
                  className="p-0 hover:bg-transparent font-medium flex items-center"
                >
                  Type{renderSortIcon("type_name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("year")}
                  className="p-0 hover:bg-transparent font-medium flex items-center"
                >
                  Year{renderSortIcon("year")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("month")}
                  className="p-0 hover:bg-transparent font-medium flex items-center"
                >
                  Month{renderSortIcon("month")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("reference_no")}
                  className="p-0 hover:bg-transparent font-medium flex items-center"
                >
                  Reference No{renderSortIcon("reference_no")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("amount_bill")}
                  className="p-0 hover:bg-transparent font-medium flex items-center"
                >
                  Amount{renderSortIcon("amount_bill")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("remark")}
                  className="p-0 hover:bg-transparent font-medium flex items-center"
                >
                  Remark{renderSortIcon("remark")}
                </Button>
              </TableHead>
              <TableHead>File</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((item, index) => (
              <TableRow key={item.id}>
                <TableRowNumber index={index} />
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.type_name}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.month}</TableCell>
                <TableCell>{item.reference_no}</TableCell>
                <TableCell>{item.amount_bill}</TableCell>
                <TableCell>{item.remark}</TableCell>
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
                  <div className="flex space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(item)} // Open dialog with initial data
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Billing Form Dialog */}
      <BillingFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        siteId={siteId} // Pass the siteId to the dialog
        initialData={selectedBilling} // Pass the selected billing data
      />
    </div>
  );
};

export default BillingPage;