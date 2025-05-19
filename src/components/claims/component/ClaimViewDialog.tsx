import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClaimViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  claim: any; // Replace with a proper type if available
}

const ClaimViewDialog: React.FC<ClaimViewDialogProps> = ({ isOpen, onClose, claim }) => {
  if (!claim) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DRAFTED":
        return "default";
      case "SUBMITTED":
        return "info";
      case "PROCESSING":
        return "warning";
      case "COMPLETED":
        return "success";
      default:
        return "secondary";
    }
  };

  const renderAttachments = (attachments: any[] = []) => {
    if (!attachments.length) {
      return <p className="text-muted-foreground">No attachments available</p>;
    }

    return (
      <ul className="list-disc pl-5">
        {attachments.map((attachment: any) => (
          <li key={attachment?.id}>
            <a
              href={attachment?.file_path ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {attachment?.claim_type_id?.name ?? "Unnamed Document"}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  const renderLogs = () => {
    if (!claim?.logs?.length) {
      return <p className="text-muted-foreground">No logs available</p>;
    }

    return (
      <div className="border rounded-md">
        <Table>
          <TableBody>
            {claim.logs.map((log: any) => (
              <TableRow key={log?.id}>
                <TableCell className="w-1/4">
                  <div className="font-medium">
                    {log?.created_at
                      ? new Date(log.created_at).toLocaleString("en-GB")
                      : "N/A"}
                  </div>
                </TableCell>
                <TableCell className="w-2/4">
                  <div>{log?.remark ?? "No remarks"}</div>
                </TableCell>
                <TableCell className="w-1/4 text-right">
                  <Badge variant="outline">{log?.status_id?.name ?? "N/A"}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim Details</DialogTitle>
          <DialogDescription className="text-muted-foreground mb-4">
            View details of the selected claim application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* General Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">General Information</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">DUSP Name</TableCell>
                  <TableCell>{claim?.tp_dusp_id?.parent_id?.name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">TP Name</TableCell>
                  <TableCell>{claim?.tp_dusp_id?.name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Reference Number</TableCell>
                  <TableCell>{claim?.ref_no ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Year</TableCell>
                  <TableCell>{claim?.year ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Month</TableCell>
                  <TableCell>{claim?.month ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Phase</TableCell>
                  <TableCell>{claim?.phase_id?.name ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Claim Status</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(claim?.claim_status?.name ?? "")}>
                      {claim?.claim_status?.name ?? "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Payment Status</TableCell>
                  <TableCell>
                    {claim?.payment_status ? (
                      <Badge variant="success">Paid</Badge>
                    ) : (
                      <Badge variant="destructive">Unpaid</Badge>
                    )}
                  </TableCell>
                </TableRow>
                                <TableRow>
                  <TableCell className="font-medium">Payment Status</TableCell>
                  <TableCell>                    
                    {claim?.date_paid
                      ? new Date(claim.date_paid).toLocaleDateString("en-GB")
                      : "N/A"}
                      </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Supporting Documents Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Claim Attachment</h3>

            {claim?.requests?.length ? (
              claim.requests.map((request: any, index: number) => {
                // Group attachments by type
                const groupedAttachments = {
                  "Summary Report": [],
                  "Supporting Document": [],
                  "Signed Invoice & Self-Declaration": [],
                };

                request.attachments.forEach((attachment: any) => {
                  if (attachment?.claim_type_id?.id === 2) {
                    groupedAttachments["Summary Report"].push(attachment.file_path);
                  } else if (attachment?.claim_type_id?.id === 1) {
                    groupedAttachments["Supporting Document"].push(attachment.file_path);
                  } else if (attachment?.claim_type_id?.id === 3) {
                    groupedAttachments["Signed Invoice & Self-Declaration"].push(attachment.file_path);
                  }
                });

                return (
                  <div key={request?.id ?? index} className="mb-4">
                    <h4 className="font-medium mb-2">
                      Category {index + 1}: {request?.category_id?.name ?? "Unnamed Category"}
                    </h4>
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Attachment Type</TableHead>
                          <TableHead>File Paths</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(groupedAttachments).map(([type, filePaths]) => (
                          <TableRow key={type}>
                            <TableCell>{type}</TableCell>
                            <TableCell>
                              {filePaths.length > 0 ? (
                                filePaths.map((filePath, idx) => (
                                  <div key={idx}>
                                    <a
                                      href={filePath}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 underline"
                                    >
                                      View File {idx + 1}
                                    </a>
                                  </div>
                                ))
                              ) : (
                                "No File Available"
                              )}
                            </TableCell>
                            <TableCell>
                              {filePaths.length > 0 ? (
                                <span className="text-green-500 font-bold">✔</span>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground">No requests available</p>
            )}
          </div>

          {/* Logs Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Logs</h3>
            {renderLogs()}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimViewDialog;
