import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { exportMembersToPDF, exportMembersToCSV } from "@/utils/export-utils";

interface ExportButtonProps {
  data: any[];
  title?: string;
}

const ExportButton = ({
  data,
  title = "HR Members Report",
}: ExportButtonProps) => {
  const handleExportPDF = () => {
    exportMembersToPDF(data, title);
  };

  const handleExportCSV = () => {
    exportMembersToCSV(data, title);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-white"
        >
          <Download size={16} />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleExportPDF}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileText size={16} />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportCSV}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileSpreadsheet size={16} />
          <span>Export as CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
