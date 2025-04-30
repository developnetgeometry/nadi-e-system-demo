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
import { FilePlus, Loader2, Pencil } from "lucide-react";
import SiteClosureForm from "./SiteClosure";
import SiteClosureDetailDialog from "./SiteClosureDetailDialog";
import { useSiteId } from "@/hooks/use-site-id";
import { useQuery } from "@tanstack/react-query";
import { fetchlListClosureData } from "../hook/use-siteclosure";
import { useFormatDate } from "@/hooks/use-format-date";
import { useFormatDuration } from "@/hooks/use-format-duration";
import { useDraftClosure } from "../hook/submit-siteclosure-data";

interface ClosurePageProps {
  siteId: string;
}

const ClosurePage: React.FC<ClosurePageProps> = ({ siteId }) => {
  const [isSiteClosureOpen, setSiteClosureOpen] = useState(false);
  const [selectedClosureId, setSelectedClosureId] = useState<number | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editDraftData, setEditDraftData] = useState<any>(null);
  const { formatDuration } = useFormatDuration();
  const { formatDate } = useFormatDate();
  const { fetchDraftData, loading: loadingDraft } = useDraftClosure();

  if (!siteId) {
    console.log('Site id not pass');
    siteId = useSiteId();
  }
  console.log("siteId", siteId);

  const { data: closurelistdata, isLoading, error, refetch } = useQuery({
    queryKey: ['siteClosureList'],
    queryFn: fetchlListClosureData
  });

  // console.log("closurelistdata", closurelistdata);

  // Helper function for when the dialog is closed - will refetch data
  const handleDialogOpenChange = (open: boolean) => {
    setSiteClosureOpen(open);
    if (!open) {
      // Clear edit data when the dialog is closed
      setEditDraftData(null);
      refetch(); // Refetch data when dialog closes
    }
  };

  const handleViewClosure = (closureId: number) => {
    setSelectedClosureId(closureId);
    setIsDetailDialogOpen(true);
  };

  const handleEditDraft = async (closureId: number) => {
    try {
      const formData = await fetchDraftData(closureId);
      setEditDraftData(formData);
      setSiteClosureOpen(true);
    } catch (err) {
      console.error("Failed to prepare draft for editing:", err);
    }
  };

  // Handle new request button click
  const handleNewRequest = () => {
    // Explicitly clear edit data before opening dialog for a new request
    setEditDraftData(null);
    setSiteClosureOpen(true);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Site Closure Requests</h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="w-full md:w-[400px]">
          {/* Optional content */}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleNewRequest}>
            <FilePlus className="mr-2 h-4 w-4" />
            New Closure Request
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Loading data...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">Error loading data: {(error as Error).message}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">No.</TableHead>
                  <TableHead className="hidden md:table-cell">Request ID</TableHead>
                  <TableHead>Site Name</TableHead>
                  <TableHead className="hidden md:table-cell">Date Requested</TableHead>
                  <TableHead>Closure Period</TableHead>
                  <TableHead className="hidden lg:table-cell">Duration</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closurelistdata && closurelistdata.length > 0 ? (
                  closurelistdata.map((item, index) => {
                    return (
                      <TableRow key={item.id}>
                        <TableRowNumber index={index} />
                        <TableCell className="hidden md:table-cell">{item.id}</TableCell>
                        <TableCell>
                          {item.nd_site_profile?.sitename || 'N/A'}
                          <div className="text-xs text-muted-foreground">
                            {item.nd_site_profile?.nd_site?.[0]?.standard_code || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatDate(item.request_datetime)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">From:</span>
                              <span>{formatDate(item.close_start)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">To:</span>
                              <span>{formatDate(item.close_end)}</span>
                            </div>
                            {formatDuration(item.duration) && (
                              <div className="text-xs text-muted-foreground lg:hidden">
                                Duration: {formatDuration(item.duration)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatDuration(item.duration)}
                        </TableCell>
                        <TableCell>
                          {item.nd_closure_categories?.eng || 'N/A'}
                          <div className="md:hidden text-xs text-muted-foreground">
                            Req: {formatDate(item.request_datetime)}
                          </div>
                        </TableCell>
                        <TableCell>{item.nd_closure_status?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {item.nd_closure_status?.name === 'Draft' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditDraft(item.id)}
                              className="flex items-center gap-1"
                            >
                              <Pencil className="h-3 w-3" />
                              Continue
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewClosure(item.id)}
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">No closure requests found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <SiteClosureForm
        open={isSiteClosureOpen}
        onOpenChange={handleDialogOpenChange}
        siteId={siteId}
        onSuccess={() => refetch()}
        editData={editDraftData}
        clearEditData={() => setEditDraftData(null)}
      />

      <SiteClosureDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        closureId={selectedClosureId}
      />
    </div>
  );
};

export default ClosurePage;
