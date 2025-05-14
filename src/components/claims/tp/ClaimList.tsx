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
import { CheckSquare, Send, Settings, Trash2, XSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TableRowNumber } from "@/components/ui/TableRowNumber";
import { useFetchClaimTP } from "../hook/fetch-claim-tp"; // Import the hook
import { Eye } from "lucide-react"; // Import the Eye icon
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; // Import Tooltip components
import React, { useState } from "react";
import ClaimViewDialog from "../component/ClaimViewDialog"; // Import the dialog
import TpSubmitDialog from "../component/TpSubmitDialog"; // Import the dialog
import TPDeleteDialog from "../component/TPDeleteDialog";

export function ClaimList() {
  const { toast } = useToast();
  const { data: claimTPData, isLoading: isClaimTPLoading } = useFetchClaimTP();

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false); // State for TPSubmitDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for TPDeleteDialog
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  const handleView = (claim: any) => {
    setSelectedClaim(claim);
    setIsViewDialogOpen(true);
  };

  const handleSubmitTP = (claim: any) => {
    setSelectedClaim(claim);
    setIsSubmitDialogOpen(true); // Open the TPSubmitDialog
  };

  const handleDelete = (claim: any) => {
    setSelectedClaim(claim);
    setIsDeleteDialogOpen(true); // Open the TPDeleteDialog
  };

  if (isClaimTPLoading) {
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
      {/* <pre>{JSON.stringify(claimTPData, null, 2)}</pre> */}
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
          {claimTPData?.map((claim, index) => (
            <TableRow key={claim.id}>
              <TableRowNumber index={index} />
              <TableCell>{claim.tp_dusp_id.name}</TableCell>
              <TableCell>{claim.ref_no}</TableCell>
              <TableCell>{claim.year}</TableCell>
              <TableCell>{claim.month}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(claim.claim_status.name)}>
                  {claim.claim_status.name}
                </Badge>
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

                  {claim.claim_status.name=== "DRAFTED" && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(claim)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleSubmitTP(claim)}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Submit to DUSP</TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Claim View Dialog */}
      {selectedClaim && (
        <ClaimViewDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          claim={selectedClaim}
        />
      )}

      {/* TP Submit Dialog */}
      {selectedClaim && (
        <TpSubmitDialog
          isOpen={isSubmitDialogOpen}
          onClose={() => setIsSubmitDialogOpen(false)}
          claim={selectedClaim}
        />
      )}

      {/* TP Delete Dialog */}
      {selectedClaim && (
        <TPDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          claimId={selectedClaim.id}
        />
      )}
    </div>
  );
}