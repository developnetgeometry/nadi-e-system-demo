import React, { useState } from "react";
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
import { FilePlus } from "lucide-react";
import SiteClosureForm from "./SiteClosure";
import { useSiteId } from "@/hooks/use-site-id";

interface ClosurePageProps {
  siteId: string;
  // siteDetails: string;
  // location: string;
}

// Sample data for the table
const dummyData = [
  {
    id: "CL001",
    requestDate: "2023-10-15",
    reason: "Relocation",
    status: "Pending",
    requestedBy: "John Doe"
  },
  {
    id: "CL002",
    requestDate: "2023-09-20",
    reason: "Renovation",
    status: "Approved",
    requestedBy: "Jane Smith"
  },
  {
    id: "CL003",
    requestDate: "2023-08-05",
    reason: "Maintenance",
    status: "Completed",
    requestedBy: "Robert Johnson"
  }
];

const ClosurePage: React.FC<ClosurePageProps> = ({ siteId }) => {
  const [isSiteClosureOpen, setSiteClosureOpen] = useState(false);

  if (!siteId) {
    console.log('Site id not pass');
    siteId = useSiteId();
  }
  console.log("siteId", siteId);

  // console.log("closurelistdata", closurelistdata);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Site Closure Requests</h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="w-full md:w-[400px]">
          {/* Optional content */}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button onClick={() => setSiteClosureOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            New Closure Request
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">No.</TableHead>
              <TableHead>Request ID</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyData.map((item, index) => (
              <TableRow key={item.id}>
                <TableRowNumber index={index} />
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.requestDate}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.requestedBy}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>This is a sample view. Use the "New Closure Request" button to create actual closure requests.</p>
      </div> */}

      <SiteClosureForm
        open={isSiteClosureOpen}
        onOpenChange={setSiteClosureOpen}
        siteId={siteId}
        // siteDetails={siteDetails}
        // location={location}
      />
    </div>
  );
};

export default ClosurePage;
