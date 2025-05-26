import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import { useInternetAccessData } from "@/hooks/report/use-internet-access-data";
import { useStableLoading } from "@/hooks/report/use-stable-loading";
import { ModularReportFilters } from "@/components/reports/filters";
import { InternetAccessReportDownloadButton } from "@/components/reports/pdftemplate/components";
import { useMcmcLogo, useDuspLogo } from "@/hooks/use-brand";
import { InternetAccessCard } from "@/components/reports/component/internetaccess";

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

// Define year options (current year plus 3 years back)
const currentYear = new Date().getFullYear();
const yearOptions = [
  { id: currentYear, label: currentYear.toString() },
  { id: currentYear - 1, label: (currentYear - 1).toString() },
  { id: currentYear - 2, label: (currentYear - 2).toString() },
  { id: currentYear - 3, label: (currentYear - 3).toString() },
];

const ReportInternetAccess = () => {
  // Filter states
  const [duspFilter, setDuspFilter] = useState<(string | number)[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string | number | null>(null);
  const [tpFilter, setTpFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null); // Default to null

  // PDF generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  // Fetch filter options from API
  const {
    phases,
    dusps,
    nadiSites,
    tpProviders,
    loading: filtersLoading,
  } = useReportFilters();
  // Fetch internet access data based on filters
  const {
    sites,
    totalSites,
    sitesWithInternet,
    sitesWithoutInternet,
    connectionTypes,
    providers,
    loading: dataLoading,
  } = useInternetAccessData(
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
            <h1 className="text-xl font-bold">Internet Access</h1>
            <p className="text-gray-500 mt-1">
              View and analyze internet connectivity data across all NADI sites
            </p>
          </div>
          <div className="flex items-center gap-2">
            <InternetAccessReportDownloadButton
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
              periodValue={
                monthFilter
                  ? `${monthFilter || ""} / ${yearFilter || ""}`
                  : "All Records"
              }
              monthFilter={monthFilter}
              yearFilter={yearFilter}
              duspFilter={duspFilter}
              phaseFilter={phaseFilter}
              sites={sites}
              totalSites={totalSites}
              sitesWithInternet={sitesWithInternet}
              sitesWithoutInternet={sitesWithoutInternet}
              connectionTypes={connectionTypes}
              providers={providers}
              mcmcLogo={mcmcLogo}
              duspLogo={duspLogo}
              fileName={`internet-access-report-${
                new Date().toISOString().split("T")[0]
              }.pdf`}
              onGenerationStart={handleGenerationStart}
              onGenerationComplete={handleGenerationComplete}
            />
          </div>
        </div>{" "}
        {/* Filters */}{" "}
        <ModularReportFilters
          // Show relevant filters for Internet Access report
          showFilters={{
            dusp: true,
            phase: true,
            nadi: false,
            date: true,
            tp: true,
          }} // Filter state
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
          nadiSites={nadiSites}
          tpOptions={tpProviders}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          // Loading state
          isLoading={filtersLoading}
        />{" "}
        {/* Internet Access Card */}
        <div className="w-full max-w-3xl">
          <InternetAccessCard
            loading={dataStableLoading}
            totalSites={totalSites}
            sitesWithInternet={sitesWithInternet}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportInternetAccess;
