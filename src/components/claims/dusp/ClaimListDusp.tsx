import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Plus, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TableRowNumber } from "@/components/ui/TableRowNumber";
import { Eye } from "lucide-react"; // Import the Eye icon
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; // Import Tooltip components
import React, { useState } from "react";
import ClaimViewDialog from "../component/ClaimViewDialog"; // Import the dialog
import { useFetchClaimDUSP } from "./hooks/fetch-claim-dusp";
import ClaimStatusDescriptionDialog from "../component/ClaimStatusLegend";
import DuspAddAttachmentDialog from "./DuspAddAttachmentDialog";
import DuspSubmitDialog from "./DuspSubmitDialog";
import DuspUpdatePaymentDialog from "./DuspUpdatePaymentDialog";

export function ClaimListDusp() {
  const { data: claimDUSPData, isLoading: isclaimDUSPCLoading } = useFetchClaimDUSP();
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false); // State for TPSubmitDialog
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);


  const [isAddAttachmentDialogOpen, setIsAddAttachmentDialogOpen] = useState(false); // State for DuspAddAttachmentDialog
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  const handleOpenDescriptionDialog = (status: string) => {
    setSelectedStatus(status);
    setIsDescriptionDialogOpen(true);
  };

  const handleView = (claim: any) => {
    setSelectedClaim(claim);
    setIsViewDialogOpen(true);
  };

  const handleSubmitDUSP = (claim: any) => {
    setSelectedClaim(claim);
    setIsSubmitDialogOpen(true); // Open the TPSubmitDialog
  };

  const handleUpdatePayment = (claim: any) => {
    setSelectedClaim(claim);
    setIsPaymentDialogOpen(true); // Open the TPSubmitDialog
  };

  const handleAddAttachment = (claimId: number) => {
    setSelectedClaim(claimId); // Pass only the claim ID
    setIsAddAttachmentDialogOpen(true); // Open the DuspAddAttachmentDialog
  };

  if (isclaimDUSPCLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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

  return (
    <div className="rounded-md border">
      {/* <pre>{JSON.stringify(claimDUSPData, null, 2)}</pre> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">No.</TableHead>
            <TableHead>TP Name</TableHead>
            <TableHead>Reference Number</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claimDUSPData?.length > 0 ? (
            claimDUSPData.map((claim, index) => (
              <TableRow key={claim.id}>
                <TableRowNumber index={index} />
                <TableCell>{claim.tp_dusp_id.name}</TableCell>
                <TableCell>{claim.ref_no}</TableCell>
                <TableCell>{claim.year}</TableCell>
                <TableCell>{claim.month}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Badge className="min-w-[6rem] text-center" variant={getStatusBadgeVariant(claim.claim_status.name)}>
                    {claim.claim_status.name}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full p-0 w-6 h-6 flex items-center justify-center"
                    onClick={() => handleOpenDescriptionDialog(claim.claim_status.name)}
                  >
                    i
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => handleView(claim)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View</TooltipContent>
                    </Tooltip>

                    {claim.claim_status.name === "SUBMITTED" && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleAddAttachment(claim.id)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add Attachment</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleSubmitDUSP(claim)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Submit to MCMC</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                    {claim.claim_status.name === "PROCESSING" && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleUpdatePayment(claim)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Update Payment Status</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>


      {/* Claim Status Description Dialog */}
      <ClaimStatusDescriptionDialog
        isOpen={isDescriptionDialogOpen}
        onClose={() => setIsDescriptionDialogOpen(false)}
        status={selectedStatus}
      />

      {/* Dusp Submit Dialog */}
      {selectedClaim && (
        <DuspSubmitDialog
          isOpen={isSubmitDialogOpen}
          onClose={() => setIsSubmitDialogOpen(false)}
          claim={selectedClaim}
        />
      )}

      {/* Claim View Dialog */}
      {selectedClaim && (
        <ClaimViewDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          claim={selectedClaim}
        />
      )}

      {/* Dusp Add Attachment Dialog */}
      {selectedClaim && (
        <DuspAddAttachmentDialog
          isOpen={isAddAttachmentDialogOpen}
          onClose={() => setIsAddAttachmentDialogOpen(false)}
          claimId={selectedClaim} // Pass only the claim ID
        />
      )}

      {/* Dusp Update Payment Dialog */}
      {selectedClaim && (
        <DuspUpdatePaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
          claim={selectedClaim}
        />
      )}
    </div>
  );
}