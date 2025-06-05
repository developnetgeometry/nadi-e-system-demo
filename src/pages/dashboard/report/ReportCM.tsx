import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModularReportFilters } from "@/components/reports/filters";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import ReportCMByNadi from "./Tab/ReportCM-ByNadi";
import ReportCMByPhase from "./Tab/ReportCM-ByPhase";
import { CMByNadiReportDownloadButton } from "@/components/reports/pdftemplate/components/CMByNadiReportDownloadButton";
import { useDuspLogo, useMcmcLogo } from "@/hooks/use-brand";
import { CMByPhaseReportDownloadButton } from "@/components/reports/pdftemplate/components/CMByPhaseReportDownloadButton";


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

const currentYear = new Date().getFullYear();
const yearOptions = [
  { id: currentYear, label: currentYear.toString() },
  { id: currentYear - 1, label: (currentYear - 1).toString() },
  { id: currentYear - 2, label: (currentYear - 2).toString() },
  { id: currentYear - 3, label: (currentYear - 3).toString() },
];

const ReportCM = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("nadi");
  // Filter states
  const [duspFilter, setDuspFilter] = useState<(string | number)[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string | number | null>(null);
  const [nadiFilter, setNadiFilter] = useState<(string | number)[]>([]);
  const [tpFilter, setTpFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null) // Default to current year

  // PDF generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const { dusps, nadiSites,phases, tpProviders, loading: filtersLoading } = useReportFilters();

  // Reset all filters
  const resetFilters = () => {
    setDuspFilter([]);
    setPhaseFilter(null);
    setNadiFilter([]);
    setTpFilter([]);
    setMonthFilter(null);
    setYearFilter(null);
  };

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


  return (
    <div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Comprehensive Maintenance</h1>
            <p className="text-gray-500 mt-1">
              View and analyze maintenance dockets across all sites
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="secondary" className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Excel
            </Button> */}
            {activeTab === "nadi" ? (
              <CMByNadiReportDownloadButton
                duspLabel={duspFilter.length === 1
                  ? dusps.find(d => d.id === duspFilter[0])?.name || ""
                  : duspFilter.length > 1
                    ? `${duspFilter.length} DUSPs selected`
                    : ""}

                periodType={monthFilter ? "MONTH / YEAR" : "All Time"}
                periodValue={monthFilter ? `${monthFilter || ""} / ${yearFilter || ""}` : "All Records"}
                duspFilter={duspFilter}
                nadiFilter={nadiFilter}
                monthFilter={monthFilter}
                yearFilter={yearFilter}
                mcmcLogo={mcmcLogo}
                duspLogo={duspLogo}
                onGenerationStart={handleGenerationStart}
                onGenerationComplete={handleGenerationComplete}
              />
            ) : activeTab === 'phase' ? (
              <CMByPhaseReportDownloadButton
                duspLabel={duspFilter.length === 1
                  ? dusps.find(d => d.id === duspFilter[0])?.name || ""
                  : duspFilter.length > 1
                    ? `${duspFilter.length} DUSPs selected`
                    : ""}
                phaseLabel={phaseFilter !== null
                  ? phases.find(p => p.id === phaseFilter)?.name || "All Phases"
                  : "All Phases"}
                periodType={monthFilter ? "MONTH / YEAR" : "All Time"}
                periodValue={monthFilter ? `${monthFilter || ""} / ${yearFilter || ""}` : "All Records"}
                duspFilter={duspFilter}
                phaseFilter={phaseFilter}
                monthFilter={monthFilter}
                yearFilter={yearFilter}
                mcmcLogo={mcmcLogo}
                duspLogo={duspLogo}
                onGenerationStart={handleGenerationStart}
                onGenerationComplete={handleGenerationComplete}
              />
            ) : null}
          </div>
        </div>

        <Tabs defaultValue="nadi" value={activeTab} onValueChange={(tab) => { resetFilters(); setActiveTab(tab); }} className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="nadi">By NADI</TabsTrigger>
            <TabsTrigger value="phase">By Phase</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <ModularReportFilters
            // Show all filters for HR report
            showFilters={{
              dusp: true,
              phase: activeTab === "phase",
              nadi: activeTab === "nadi",
              tp: true,
              date: true
            }}

            // Filter state
            duspFilter={duspFilter}
            setDuspFilter={setDuspFilter}
            phaseFilter={phaseFilter}
            setPhaseFilter={setPhaseFilter}
            nadiFilter={nadiFilter}
            setNadiFilter={setNadiFilter}
            tpFilter={tpFilter}
            setTpFilter={setTpFilter}
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}

            // Filter data
            dusps={dusps}
            phases={phases}
            monthOptions={monthOptions}
            yearOptions={yearOptions}
            tpOptions={tpProviders}
            nadiSites={nadiSites}
            // Loading state
            isLoading={filtersLoading}
          />

          {/* By NADI Tab */}
          <TabsContent value="nadi" className="mt-4">
            {/* Main Content for NADI tab */}
            <ReportCMByNadi

              duspFilter={duspFilter}
              phaseFilter={phaseFilter}
              nadiFilter={nadiFilter}
              tpFilter={tpFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}

            />
          </TabsContent>

          {/* By Phase Tab */}
          <TabsContent value="phase" className="mt-4">
            {/* Main Content for Phase tab */}
            <ReportCMByPhase
              duspFilter={duspFilter}
              phaseFilter={phaseFilter}
              nadiFilter={nadiFilter}
              tpFilter={tpFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportCM;
