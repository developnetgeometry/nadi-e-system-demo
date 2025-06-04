import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadAttachment, deleteAttachment, updateRemark } from "@/components/claims/hook/upload-attachment";
import { Download, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ViewSiteDialog from "../ViewSiteDialog";
import FrontPage from "../../template/component/FrontPage";
import Appendix from "../../template/component/Appendix";
const fileInputLabelClass =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[#5147dd] bg-background text-[#5147dd] hover:bg-[#5147dd]/10 hover:text-[#5147dd] h-6 px-4 py-2"

type ClaimData = {
  id: number;
  claim_type: string;
  year: number;
  quarter: number | null;
  month: number | null;
  ref_no: string;
  date_paid: string | null;
  payment_status: boolean;
  phase_id: { id: number; name: string };
  claim_status: { id: number; name: string };
  tp_dusp_id: { id: string; name: string; parent_id: { id: string; name: string; logo_url: string; description: string } };
  requests: {
    id: number;
    name: string;
    items: {
      id: number;
      item: {
        id: number;
        name: string;
        need_support_doc: boolean;
        need_summary_report: boolean;
        status_item: boolean;
        remark: string | null;
        site_ids: number[];
        suppport_doc_file: { id: number; file_path: string }[]; // Updated type
        summary_report_file: { id: number; file_path: string } | null;
      };
    }[];
  }[];
};

type ApplicationTabProps = {
  claimData: ClaimData;
  refetch: () => void;
};

export function ApplicationTab({ claimData, refetch }: ApplicationTabProps) {
  const { toast } = useToast();
  const [editingRemark, setEditingRemark] = useState<{ itemId: number; remark: string | null } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewSiteDialogOpen, setIsViewSiteDialogOpen] = useState(false);
  const [selectedSiteIds, setSelectedSiteIds] = useState<number[]>([]);

  const handleUpdateRemark = async (itemId: number, remark: string) => {
    try {
      const result = await updateRemark(itemId, remark);
      if (result.success) {
        toast({
          title: "Success",
          description: "Remark updated.",
          variant: "default",
        });
        setEditingRemark(null);
      } else {
        alert("Failed to update remark.");
      }
      refetch();
    } catch (error) {
      console.error("Error updating remark:", error);
    }
  };

  const handleDownloadAllReports = async () => {
    setIsDownloading(true); // Set loading state to true
    try {
      const pdfDoc = await PDFDocument.create();

      // Add the FrontPage as the first page
      const frontPageFile = await FrontPage({
        duspName: claimData.tp_dusp_id.parent_id.description,
        claimType: claimData.claim_type,
        year: claimData.year,
        quarter: claimData.quarter,
        month: claimData.month,
        dusplogo: claimData.tp_dusp_id.parent_id.logo_url,
      });
      const frontPageBytes = await frontPageFile.arrayBuffer();
      const frontPagePdf = await PDFDocument.load(frontPageBytes);
      const frontPagePages = await pdfDoc.copyPages(frontPagePdf, frontPagePdf.getPageIndices());
      frontPagePages.forEach((page) => pdfDoc.addPage(page));

      // Iterate over all requests and their items
      for (const request of claimData.requests) {
        for (const item of request.items) {
          // Add the summary report file
          if (item.item.summary_report_file) {
            const summaryResponse = await fetch(item.item.summary_report_file.file_path);
            const summaryBytes = await summaryResponse.arrayBuffer();
            const summaryPdf = await PDFDocument.load(summaryBytes);
            const summaryPages = await pdfDoc.copyPages(summaryPdf, summaryPdf.getPageIndices());
            summaryPages.forEach((page) => pdfDoc.addPage(page));
          }

          // Add the supporting document files using Appendix.tsx
          if (item.item.suppport_doc_file?.length > 0) {
            const appendixFile = await Appendix({
              appendixNumber: "APPENDIX",
              title: item.item.name,
              attachments: item.item.suppport_doc_file.map((file) => ({
                path: file.file_path,
                description: `Supporting Document for ${item.item.name}`,
              })),
            });
            const appendixBytes = await appendixFile.arrayBuffer();
            const appendixPdf = await PDFDocument.load(appendixBytes);
            const appendixPages = await pdfDoc.copyPages(appendixPdf, appendixPdf.getPageIndices());
            appendixPages.forEach((page) => pdfDoc.addPage(page));
          }
        }
      }

      // Serialize the combined PDF
      const combinedPdfBytes = await pdfDoc.save();

      // Create a blob and trigger download
      const blob = new Blob([combinedPdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `ClaimData_Combined_Report.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error combining and downloading reports:", error);
    } finally {
      setIsDownloading(false); // Reset loading state
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Claim Data</h2>
        {/* <pre>{JSON.stringify(claimData, null, 2)}</pre> */}

        <Button
          variant="outline"
          onClick={handleDownloadAllReports}
          disabled={isDownloading}
          className="relative flex items-center justify-center"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500 mr-2"></div>
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Combined Reports
            </>
          )}
        </Button>
      </div>

      {/* <pre>{JSON.stringify(claimData, null, 2)}</pre> */}

      <Table className="border border-gray-300 w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 border w-[120px]">Category</TableHead>
            <TableHead className="px-4 py-2 border w-[200px]">Items</TableHead>
            <TableHead className="px-4 py-2 border w-[120px]">Sites</TableHead>
            <TableHead className="px-4 py-2 text-center border w-[120px]">Summary Report</TableHead>
            <TableHead className="px-4 py-2 text-center border">Attachment</TableHead>
            <TableHead className="px-4 py-2 text-center border w-[300px]">Remark</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {claimData.requests.map((request) => (
            <React.Fragment key={request.id}>
              {request.items.map((item, index) => (
                <TableRow key={item.id}>
                  {index === 0 && (
                    <TableCell
                      className="px-4 py-2 align-top border"
                      rowSpan={request.items.length}
                    >
                      {request.name}
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-2 border">{item.item.name}</TableCell>
                  <TableCell className="px-4 py-2 text-center border">
                    {item.item.site_ids.length > 0 ? (
                      <div className="flex flex-col items-center">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedSiteIds(item.item.site_ids); // Pass the site_ids to the dialog
                            setIsViewSiteDialogOpen(true); // Open the dialog
                          }}
                          className="h-6"
                        >
                          View Sites
                        </Button>
                        <div className="text-xs text-muted-foreground mt-1">
                          {`${item.item.site_ids.length} site${item.item.site_ids.length !== 1 ? "s" : ""} selected`}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">No Sites</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center border">
                    {item.item.need_summary_report ? (
                      item.item.summary_report_file ? (
                        <a
                          href={item.item.summary_report_file.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Report
                        </a>
                      ) : (
                        <span className="text-gray-500">Not Available</span>
                      )
                    ) : (
                      <span className="text-gray-500">Not Required</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center border">
                    {item.item.need_support_doc ? (
                      <div className="flex flex-col items-center gap-2">
                        {item.item.suppport_doc_file?.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {item.item.suppport_doc_file.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <a
                                  href={file.file_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  View File
                                </a>
                                {(claimData.claim_status.name === "DRAFTED" &&
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-600"
                                    onClick={async () => {
                                      try {
                                        const result = await deleteAttachment(file.id, file.file_path);
                                        if (result.success) {
                                          toast({
                                            title: "Success",
                                            description: "Attachment deleted.",
                                            variant: "default",
                                          });
                                          refetch(); // Refresh the data
                                        } else {
                                          alert("Failed to delete attachment.");
                                        }
                                      } catch (error) {
                                        console.error("Error deleting attachment:", error);
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No Files</span>
                        )}
                        {(claimData.claim_status.name === "DRAFTED" &&
                          <div>
                            <input
                              type="file"
                              id={`fileInput-${item.id}`}
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              multiple
                              onChange={async (e) => {
                                if (e.target.files) {
                                  const files = Array.from(e.target.files);
                                  try {
                                    for (const file of files) {
                                      console.log("Uploading file:", item.id);
                                      const result = await uploadAttachment(
                                        file,
                                        claimData.tp_dusp_id,
                                        claimData.year,
                                        claimData.ref_no,
                                        item.id,
                                        1 // Claim type ID for supporting documents
                                      );
                                      if (!result.success) {
                                        alert(`Failed to upload file: ${file.name}`);
                                      }
                                    }
                                    toast({
                                      title: "Success",
                                      description: "Attachments uploaded.",
                                      variant: "default",
                                    });
                                    console.log("item.id", item.id);
                                    refetch();
                                  } catch (error) {
                                    console.error("Error uploading attachments:", error);
                                  }
                                }
                              }}
                            />
                            <label
                              htmlFor={`fileInput-${item.id}`}
                              className={fileInputLabelClass}
                            >
                              Upload File
                            </label>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">Not Required</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center border">
                    {editingRemark?.itemId === item.id ? (
                      <div className="flex flex-col gap-2">
                        <Textarea
                          value={editingRemark.remark ?? ""}
                          onChange={(e) =>
                            setEditingRemark({
                              itemId: item.id,
                              remark: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                        <div className="flex justify-between items-center gap-2">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setEditingRemark(null)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleUpdateRemark(item.id, editingRemark.remark ?? "")
                            }
                            className="flex-1"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span className={
                          claimData.claim_status.name === "DRAFTED"
                            ? "border border-gray-300 rounded px-2 py-1 w-full"
                            : ""
                        }>  {item.item.remark?.trim() ? item.item.remark : "No Remark"}
                        </span>
                        {(claimData.claim_status.name === "DRAFTED" &&
                          <Button
                            variant="outline"
                            onClick={() =>
                              setEditingRemark({
                                itemId: item.id,
                                remark: item.item.remark,
                              })
                            }
                            className="h-6"
                          >
                            {item.item.remark?.trim() ? "Update Remark" : "Add Remark"}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>


                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* View Site DIalog */}
      <ViewSiteDialog
        isOpen={isViewSiteDialogOpen}
        onClose={() => setIsViewSiteDialogOpen(false)} // Close the dialog
        siteIds={selectedSiteIds} // Pass the selected site IDs
      />
    </div>
  );
}