import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useFetchClaimById } from "./claim-data"; // Import the hook
import GeneralTab from "./tab/GeneralTab";
import LogTab from "./tab/LogTab";
import TpSubmitDialog from "@/components/claims/tp/TpSubmitDialog"; // Import TpSubmitDialog
import { useUserMetadata } from "@/hooks/use-user-metadata";
import SignTab from "./tab/SignTab";
import DuspSubmitDialog from "../dusp/DuspSubmitDialog";
import DuspUpdatePaymentDialog from "../dusp/DuspUpdatePaymentDialog";
import { useNavigate } from "react-router-dom";
import { ApplicationTab } from "./tab/ApplicationTab";
import { useToast } from "@/hooks/use-toast";
import DuspRejectDialog from "../dusp/DuspRejectDialog";

interface ClaimViewPageProps {
  claimId: number; // Accept claimId as a prop
}

const ClaimViewPage: React.FC<ClaimViewPageProps> = ({ claimId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userGroup = parsedMetadata?.user_group;
  const userType = parsedMetadata?.user_type;
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false); // State for TpSubmitDialog
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false); // State for TpSubmitDialog
  const [isDuspDialogOpen, setIsDuspDialogOpen] = useState(false); // State for DuspSubmitDialog
  const [isUpdatePaymentDialogOpen, setIsUpdatePaymentDialogOpen] = useState(false); // State for DuspUpdatePaymentDialog

  // Fetch claim data using the hook
  const { data: claimData, isLoading, error, refetch } = useFetchClaimById(claimId);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Claim Details</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </header>
      {/* <pre>{JSON.stringify(claimData, null, 2)}</pre> */}

      <div className="rounded-md border p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <p>Error loading claim data</p>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              {(userGroup === 1 || userGroup === 2) && (
                <TabsTrigger value="sign">Signed Document</TabsTrigger>
              )}
              <TabsTrigger value="log">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralTab claimData={claimData} />
            </TabsContent>
            <TabsContent value="application">
              <ApplicationTab claimData={claimData} refetch={refetch} />
            </TabsContent>
            {(userGroup === 1 || userGroup === 2) && (
              <TabsContent value="sign">
                <SignTab claimData={claimData} />
              </TabsContent>
            )}
            <TabsContent value="log">
              <LogTab claimData={claimData} />
            </TabsContent>
          </Tabs>
        )}

        {/* Submit Button */}
        <div className="mt-4 flex justify-end space-x-4">
          {userGroup === 3 && claimData?.claim_status?.name === "DRAFTED" && (
            <Button
              variant="default"
              onClick={() => setIsSubmitDialogOpen(true)} // Open TpSubmitDialog
              disabled={!claimData} // Disable if claimData is not loaded
            >
              Submit to DUSP
            </Button>
          )}

          {userGroup === 1 && claimData?.claim_status?.name === "SUBMITTED" && (
            <div>
              <Button
              className="mr-2"
                variant="destructive"
                onClick={() => {
                  setIsRejectDialogOpen(true); // Open DuspSubmitDialog
                }}
                disabled={!claimData} // Disable if claimData is not loaded
              >
                Reject
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  if (!claimData.signed_documents || claimData.signed_documents.length === 0) {
                    toast({
                      title: "Signed Document Required",
                      description: "Please upload the signed the document before submitting to MCMC.",
                      variant: "destructive",
                    });
                    setActiveTab("sign");
                    return;
                  }
                  if (claimData.noa === null || claimData.noa === "") {
                    toast({
                      title: "NOA Required",
                      description: "Please insert NOA before submitting to MCMC.",
                      variant: "destructive",
                    });
                    setActiveTab("sign");
                    return;
                  }
                  setIsDuspDialogOpen(true); // Open DuspSubmitDialog
                }}
                disabled={!claimData} // Disable if claimData is not loaded
              >
                Save and Submit
              </Button>
            </div>
          )}

          {userGroup === 1 && claimData?.claim_status?.name === "PROCESSING" && (
            <Button
              variant="default"
              onClick={() => setIsUpdatePaymentDialogOpen(true)} // Open DuspUpdatePaymentDialog
              disabled={!claimData} // Disable if claimData is not loaded
            >
              Update Payment
            </Button>
          )}
        </div>
      </div>

      {/* TpSubmitDialog */}
      {claimData && (
        <TpSubmitDialog
          isOpen={isSubmitDialogOpen}
          onClose={() => setIsSubmitDialogOpen(false)} // Close TpSubmitDialog
          claim={claimData} // Pass claimData to TpSubmitDialog
        />
      )}

      {/* DuspSubmitDialog */}
      {claimData && (
        <DuspSubmitDialog
          isOpen={isDuspDialogOpen}
          onClose={() => setIsDuspDialogOpen(false)} // Close DuspSubmitDialog
          claim={claimData} // Pass claimData to DuspSubmitDialog
        />
      )}

      {/* DuspRejectDialog */}
      {claimData && (
        <DuspRejectDialog
          isOpen={isRejectDialogOpen}
          onClose={() => setIsRejectDialogOpen(false)} // Close DuspSubmitDialog
          claim={claimData} // Pass claimData to DuspSubmitDialog
        />
      )}

      {/* DuspUpdatePaymentDialog */}
      {claimData && (
        <DuspUpdatePaymentDialog
          isOpen={isUpdatePaymentDialogOpen}
          onClose={() => setIsUpdatePaymentDialogOpen(false)} // Close DuspUpdatePaymentDialog
          claim={claimData} // Pass claimData to DuspUpdatePaymentDialog
        />
      )}
    </div>
  );
};

export default ClaimViewPage;