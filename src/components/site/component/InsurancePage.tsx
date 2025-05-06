import React, { useState, useEffect } from "react";
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
import { FilePlus, Settings, Trash2 } from "lucide-react";
import InsuranceFormDialog from "../InsuranceFormDialog";
import { useSiteInsurance } from "../hook/use-site-insurance";
import { supabase } from "@/lib/supabase";
import { BUCKET_NAME_SITE_INSURANCE } from "@/integrations/supabase/client";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface InsurancePageProps {
  siteId: string;
}

const InsurancePage: React.FC<InsurancePageProps> = ({ siteId }) => {
  const [refreshInsurance, setRefreshInsurance] = useState(false);
  const { data, loading, error } = useSiteInsurance(siteId, refreshInsurance);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null);

  const handleEdit = (insurance: any) => {
    setSelectedInsurance(insurance);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setRefreshInsurance((prev) => !prev);
    }
  }, [isDialogOpen]);

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
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;

    try {
      // Step 1: Delete from `nd_site_attachment` and get file path
      const { data: attachmentData, error: attachmentError } = await supabase
        .from("nd_site_attachment")
        .select("file_path")
        .eq("site_remark_id", id)
        .single();

      if (attachmentError) {
        console.warn("No associated file found or error fetching file path:", attachmentError);
      } else if (attachmentData?.file_path) {
        const filePath = attachmentData.file_path;

        // Extract the part of the file path after the bucket name
        const relativeFilePath = filePath.split(`${BUCKET_NAME_SITE_INSURANCE}/`)[1];

        // Step 2: Delete the file from storage
        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME_SITE_INSURANCE)
          .remove([relativeFilePath]);

        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          alert("Failed to delete the associated file. Please try again.");
          return;
        }

        // Step 3: Delete the record from `nd_site_attachment`
        const { error: attachmentDeleteError } = await supabase
          .from("nd_site_attachment")
          .delete()
          .eq("site_remark_id", id);

        if (attachmentDeleteError) {
          console.error("Error deleting from nd_site_attachment:", attachmentDeleteError);
          alert("Failed to delete the attachment record. Please try again.");
          return;
        }
      }

      // Step 4: Delete from `nd_insurance_report`
      const { error: reportError } = await supabase
        .from("nd_insurance_report")
        .delete()
        .eq("site_remark_id", id);

      if (reportError) {
        console.error("Error deleting from nd_insurance_report:", reportError);
        alert("Failed to delete the insurance report. Please try again.");
        return;
      }

      // Step 5: Delete from `nd_site_remark`
      const { error: remarkError } = await supabase
        .from("nd_site_remark")
        .delete()
        .eq("id", id);

      if (remarkError) {
        console.error("Error deleting from nd_site_remark:", remarkError);
        alert("Failed to delete the remark. Please try again.");
        return;
      }

      alert("Record and associated file deleted successfully.");
      setRefreshInsurance((prev) => !prev); // Trigger re-fetch
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Insurance Information</h2>

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            setSelectedInsurance(null);
            setIsDialogOpen(true);
          }}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Add New Insurance
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">No.</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Incident Type</TableHead>
              <TableHead>Insurance Type</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableRowNumber index={index} />
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.type_name}</TableCell>
                <TableCell>{item.insurance_type_name}</TableCell>
                <TableCell>
                  {item.file_path ? (
                    <a href={item.file_path} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
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
                          onClick={() => handleDelete(String(item.id))}
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

      <InsuranceFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        siteId={siteId}
        initialData={selectedInsurance}
      />
    </div>
  );
};

export default InsurancePage;