import React, { useEffect } from "react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { useSiteProfilesByIds } from "./hooks/use-generate-claim-report";

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
  category_ids: CategoryData[];
  report_file: Uint8Array | null;
  status_item: boolean;
};

type ClaimReportGeneratorProps = {
  site_profile_ids: number[];
  category_ids: CategoryData[];
  onReportsGenerated: (reports: ReportData[]) => void;
};

export function ClaimReportGenerator({
  site_profile_ids,
  category_ids,
  onReportsGenerated,
}: ClaimReportGeneratorProps) {
  const { siteProfiles, isLoading, error } = useSiteProfilesByIds(site_profile_ids);

  useEffect(() => {
    if (!siteProfiles || isLoading || error) return;

    const generatePDFs = async () => {
      const reports: ReportData[] = [];

      for (const category of category_ids) {
        const doc = new jsPDF();

        // Add a title for the category
        doc.text(`Report for ${category.name}`, 14, 20);

        // Loop through each item in the category
        for (const item of category.item_ids) {
          // Add a new page for each item (except the first one)
          if (category.item_ids.indexOf(item) !== 0) {
            doc.addPage();
          }

          // Add a sub-title for the item
          doc.text(`Item: ${item.name}`, 14, 30);

          // Define table columns and rows
          const tableColumn = ["Full Name", "Ref ID (MCMC)", "Ref ID (TP)", "Active"];
          const tableRows = siteProfiles.map((profile) => [
            profile.fullname,
            profile.refid_mcmc,
            profile.refid_tp,
            profile.is_active ? "Yes" : "No",
          ]);

          // Add the table to the PDF
          autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
          });
        }

        // Generate the PDF as a Uint8Array
        const pdfData = doc.output("arraybuffer");
        reports.push({
          category_ids: [category], // Include the category in the report
          report_file: new Uint8Array(pdfData),
          status_item: true,
        });
      }

      // Pass the generated reports back to the parent component
      onReportsGenerated(reports);
    };

    generatePDFs();
  }, [siteProfiles, category_ids, isLoading, error, onReportsGenerated]);

  return <p>Generating reports...</p>;
}