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
import { Eye } from "lucide-react"; // Import the Eye icon
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; // Import Tooltip components
import React, { useState } from "react";
import { useFetchClaimMCMC } from "./hooks/fetch-claim-mcmc";
import ClaimViewDialog from "../component/ClaimViewDialog"; // Import the dialog
import ClaimStatusDescriptionDialog from "../component/ClaimStatusLegend";

export function ClaimListMcmc() {
  const { data: claimMCMCData, isLoading: isclaimMCMCLoading } = useFetchClaimMCMC();
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  const handleOpenDescriptionDialog = (status: string) => {
    setSelectedStatus(status);
    setIsDescriptionDialogOpen(true);
  };

  const handleView = (claim: any) => {
    setSelectedClaim(claim);
    setIsViewDialogOpen(true);
  };

  if (isclaimMCMCLoading) {
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">No.</TableHead>
            <TableHead>DUSP Name</TableHead>
            <TableHead>TP Name</TableHead>
            <TableHead>Reference Number</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claimMCMCData?.length > 0 ? (
            claimMCMCData.map((claim, index) => (
              <TableRow key={claim.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{claim.tp_dusp_id?.parent_id.name || "N/A"}</TableCell>
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
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
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

      {/* Claim View Dialog */}
      {selectedClaim && (
        <ClaimViewDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          claim={selectedClaim}
        />
      )}
    </div>
  );
}