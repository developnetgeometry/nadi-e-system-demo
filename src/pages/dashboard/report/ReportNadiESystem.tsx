import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import { useNadiESystemData } from "@/hooks/report/use-nadi-e-system-data";
import { useStableLoading } from "@/hooks/report/use-stable-loading";
import { ModularReportFilters } from "@/components/reports/filters";
import { NadiESystemReportDownloadButton } from "@/components/reports/pdftemplate/components";
import { useMcmcLogo, useDuspLogo } from "@/hooks/use-brand";
import {
  CmsCard,
  WebsiteMigrationCard,
  EmailMigrationCard,
} from "@/components/reports/component/nadiesystem";

// Define month options
const monthOptions = [
  { id: 1, label: "January" },
  { id: 2, label: "February" },
  { id: 3, label: "March" },
  { id: 4, label: "April" },
  { id: 5, label: "May" },
  { id: 6, label: "June" },
  { id: 7, label: "July" },
  { id: 8, label: "August" },
  { id: 9, label: "September" },
  { id: 10, label: "October" },
  { id: 11, label: "November" },
  { id: 12, label: "December" },
];

// TP options will be fetched from the useReportFilters hook

// Define year options (current year plus 3 years back)
const currentYear = new Date().getFullYear();
const yearOptions = [
  { id: currentYear, label: currentYear.toString() },
  { id: currentYear - 1, label: (currentYear - 1).toString() },
  { id: currentYear - 2, label: (currentYear - 2).toString() },
  { id: currentYear - 3, label: (currentYear - 3).toString() },
];

const ReportNadiESystem = () => {
  // Filter states
  const [duspFilter, setDuspFilter] = useState<(string | number)[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string | number | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null); // Default to null
  const [tpFilter, setTpFilter] = useState<(string | number)[]>([]);

  // PDF generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  // Fetch filter options from API
  const { phases, dusps, tpProviders, loading: filtersLoading } = useReportFilters();
    // Fetch NADI e-System data based on filters
  const {
    sites,
    totalSites,
    sitesWithCms,
    sitesWithWebsiteMigration,
    sitesWithEmailMigration,
    loading: dataLoading,
  } = useNadiESystemData(
    duspFilter,
    phaseFilter,
    monthFilter,
    yearFilter,
    tpFilter
  );

  // Get MCMC and DUSP logos for the PDF report
  const mcmcLogo = useMcmcLogo();
  const duspLogo = useDuspLogo();

  // Handle PDF generation events
  const handleGenerationStart = () => {
    setIsGeneratingPdf(true);
  };

  const handleGenerationComplete = (success: boolean) => {
    setIsGeneratingPdf(false);
    if (!success) {
      console.error("Failed to generate PDF");
      // Could add toast notification here
    }
  };

  // Use individual stable loading states for each component
  const filtersStableLoading = useStableLoading(filtersLoading);
  const dataStableLoading = useStableLoading(dataLoading);

  return (
    <div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">NADI e-System</h1>
            <p className="text-gray-500 mt-1">View and analyze NADI e-System data across all sites</p>
          </div>          
          <div className="flex items-center gap-2">
            <NadiESystemReportDownloadButton
              duspLabel={
                duspFilter.length === 1
                  ? dusps.find((d) => d.id === duspFilter[0])?.name || ""
                  : duspFilter.length > 1
                  ? `${duspFilter.length} DUSPs selected`
                  : ""
              }
              phaseLabel={
                phaseFilter !== null
                  ? phases.find((p) => p.id === phaseFilter)?.name ||
                    "All Phases"
                  : "All Phases"
              }
              periodType={monthFilter ? "MONTH / YEAR" : "All Time"}
              periodValue={monthFilter ? `${monthFilter || ""} / ${yearFilter || ""}` : "All Records"}
              duspFilter={duspFilter}
              phaseFilter={phaseFilter}
              tpFilter={tpFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
              mcmcLogo={mcmcLogo}
              duspLogo={duspLogo}
              fileName={`nadi-e-system-report-${
                new Date().toISOString().split("T")[0]
              }.pdf`}
              onGenerationStart={handleGenerationStart}
              onGenerationComplete={handleGenerationComplete}
            />
          </div>
        </div>        
        
        {/* Filters */}
        <ModularReportFilters
          // Show only relevant filters for NADI e-System report
          showFilters={{
            dusp: true,
            phase: true,
            nadi: false,
            date: true,
            tp: true,
          }}
          // Filter state
          duspFilter={duspFilter}
          setDuspFilter={setDuspFilter}
          phaseFilter={phaseFilter}
          setPhaseFilter={setPhaseFilter}
          monthFilter={monthFilter}
          setMonthFilter={setMonthFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          tpFilter={tpFilter}
          setTpFilter={setTpFilter}         
          
          // Filter data
          dusps={dusps}
          phases={phases}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          tpOptions={tpProviders}
          // Loading state
          isLoading={filtersLoading}
        />
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CmsCard
            loading={dataStableLoading}
            totalSites={totalSites}
            sitesWithCms={sitesWithCms}
          />

          <WebsiteMigrationCard
            loading={dataStableLoading}
            totalSites={totalSites}
            migratedSites={sitesWithWebsiteMigration}
          />

          <EmailMigrationCard
            loading={dataStableLoading}
            totalSites={totalSites}
            migratedEmails={sitesWithEmailMigration}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportNadiESystem;
