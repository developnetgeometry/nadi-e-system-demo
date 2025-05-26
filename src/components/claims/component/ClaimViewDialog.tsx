import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useFetchClaimById } from "./claim-data"; // Import the hook
import GeneralTab from "./tab/GeneralTab";
import NadiSites from "./tab/NadiSites";
import LogTab from "./tab/LogTab";
import Application from "./tab/ApplicationTab";

interface ClaimViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: number; // Receive only the claim ID
}

const ClaimViewDialog: React.FC<ClaimViewDialogProps> = ({ isOpen, onClose, claimId }) => {
  const [activeTab, setActiveTab] = useState("general");

  // Fetch claim data using the hook
  const { data: claimData, isLoading, error } = useFetchClaimById(claimId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>



        {/* <pre className="bg-gray-100 p-4 rounded-md text-sm">{JSON.stringify(claimData, null, 2)}</pre> */}
        {/* Tabs for content */}
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
              <TabsTrigger value="nadi-sites">Nadi Sites</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="log">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralTab claimData={claimData} />

            </TabsContent>
            <TabsContent value="application">
              <Application claimData={claimData} />
            </TabsContent>
            <TabsContent value="nadi-sites">
              <NadiSites claimData={claimData} />
            </TabsContent>
            <TabsContent value="report">
              <h1>Report Content</h1>
            </TabsContent>
            <TabsContent value="log">
              <LogTab claimData={claimData} />
            </TabsContent>
          </Tabs>
        )}

        {/* Dummy Submit Button */}
        <DialogFooter>
          <Button variant="outline" onClick={() => console.log("Submit clicked")}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimViewDialog;