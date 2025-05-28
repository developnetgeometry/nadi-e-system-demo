import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useSiteProfilesByIds } from "@/components/claims/tp/hooks/use-generate-claim-report";
import { DialogDescription } from "@radix-ui/react-dialog";

interface ViewSiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  siteIds: number[];
}

const ViewSiteDialog: React.FC<ViewSiteDialogProps> = ({ isOpen, onClose, siteIds }) => {
  const { siteProfiles, isLoading, error } = useSiteProfilesByIds(siteIds);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter sites based on the search term
  const filteredSites = siteProfiles?.filter(
    (site) =>
      site.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.refid_mcmc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.refid_tp?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Sites</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search sites by name, refid MCMC, or refid TP"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
        </div>

        {/* Table */}
        <div>
          {isLoading ? (
            <p>Loading site profiles...</p>
          ) : error ? (
            <p className="text-red-500">Error loading site profiles.</p>
          ) : (
            <Table className="border border-gray-300 w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 border">Index</TableHead>
                  <TableHead className="px-4 py-2 border">Name</TableHead>
                  <TableHead className="px-4 py-2 border">Ref ID MCMC</TableHead>
                  <TableHead className="px-4 py-2 border">Ref ID TP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites?.map((site, index) => (
                  <TableRow key={site.id}>
                    <TableCell className="px-4 py-2 border">{index + 1}</TableCell>
                    <TableCell className="px-4 py-2 border">{site.fullname}</TableCell>
                    <TableCell className="px-4 py-2 border">{site.refid_mcmc || "N/A"}</TableCell>
                    <TableCell className="px-4 py-2 border">{site.refid_tp || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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

export default ViewSiteDialog;