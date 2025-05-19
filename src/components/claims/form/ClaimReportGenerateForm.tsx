import { DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ClaimReportGenerator } from "../tp/ClaimReportGenerator";

type ItemData = {
  id: number;
  name: string;
};

type CategoryData = {
  id: number;
  name: string;
  item_ids: ItemData[];
};

type ReportData = {
  category_ids: CategoryData[]; // Updated to match the correct format
  report_file: Uint8Array | null;
  status_item: boolean;
};

type ClaimData = {
  site_profile_ids: number[];
  category_ids: CategoryData[];
  reports: ReportData[];
};

type ClaimReportGenerateFormProps = ClaimData & {
  updateFields: (fields: Partial<ClaimData>) => void;
};

export function ClaimReportGenerateForm({
  site_profile_ids,
  category_ids,
  reports,
  updateFields,
}: ClaimReportGenerateFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleReportsGenerated = (generatedReports: ReportData[]) => {
    updateFields({ reports: generatedReports });
    setIsGenerating(false); // Stop generating after reports are generated
  };
  

  return (
    <>
      <DialogTitle className="mb-4">Report Generation</DialogTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Generate Report Button */}
        <div className="col-span-2 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={() => setIsGenerating(true)}
            disabled={isGenerating || site_profile_ids.length === 0}
          >
            {isGenerating ? "Generating..." : "Generate Reports"}
          </button>
        </div>
      </div>

      {/* Show Report Generator */}
      {isGenerating && (
        <ClaimReportGenerator
          site_profile_ids={site_profile_ids}
          category_ids={category_ids}
          onReportsGenerated={handleReportsGenerated}
        />
      )}

      {/* Display the generated reports */}
      {reports.map((report, index) => (
        <div key={index} className="mt-4">
          <p>Report for Categories:</p>
          <ul>
            {report.category_ids.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
          {report.report_file && (
            <a
              href={URL.createObjectURL(new Blob([report.report_file], { type: "application/pdf" }))}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Open Report
            </a>
          )}
        </div>
      ))}
    </>
  );
}