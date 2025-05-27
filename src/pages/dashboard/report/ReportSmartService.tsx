import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModularReportFilters } from "@/components/reports/filters";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import ReportSmartServiceByPhase from "./Tab/ReportSmartService-ByPhase";
import ReportSmartServicePillarByProgramme from "./Tab/ReportSmartService-PillarByProgramme";
import ReportSmartServiceByMonth from "./Tab/ReportSmartService-ByMonth";
import { SmartServiceByPhaseReportDownloadButton } from "@/components/reports/pdftemplate/components/SmartServiceByPhaseReportDownloadButton";
import { useDuspLogo, useMcmcLogo } from "@/hooks/use-brand";

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

const ReportSmartService = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("phase");
  // Filter states
  const [duspFilter, setDuspFilter] = useState<(string | number)[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string | number | null>(null);
  const [nadiFilter, setNadiFilter] = useState<(string | number)[]>([]);
  const [tpFilter, setTpFilter] = useState<(string | number)[]>([]);
  const [pillarFilter, setPillarFilter] = useState<(string | number)[]>([]);
  const [programFilter, setprogramFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null)

  // PDF generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Use unified report filter data
  const {
    dusps,
    phases,
    nadiSites,
    tpProviders,
    pillarOptions,
    programOptions,
    loading: filtersLoading,
  } = useReportFilters();

  const hasActiveFiltersMonth =
    nadiFilter !== null || monthFilter !== null || yearFilter !== "2025";

  const resetFilters = () => {
    setDuspFilter([]);
    setPhaseFilter(null);
    setNadiFilter([]);
    setTpFilter([]);
    setMonthFilter(null);
    setYearFilter(null);
    setPillarFilter([]);
    setprogramFilter([]);
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
  }
  return (
    <div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Smart Services</h1>
            <p className="text-gray-500 mt-1">
              View and analyze smart service programs and participation data
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="secondary" className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Excel
            </Button> */}
            {activeTab === "phase" ? (

              <SmartServiceByPhaseReportDownloadButton
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
                tpFilter={tpFilter}
                phaseFilter={phaseFilter}
                monthFilter={monthFilter}
                yearFilter={yearFilter}
                mcmcLogo={mcmcLogo}
                duspLogo={duspLogo}
                onGenerationStart={handleGenerationStart}
                onGenerationComplete={handleGenerationComplete}
              />
            ) : activeTab === "pillar" ? (
              <></>
              // <SmartServicePillarByProgrammeReportDownloadButton

              //   duspLabel={duspFilter.length === 1
              //     ? dusps.find(d => d.id === duspFilter[0])?.name || ""
              //     : duspFilter.length > 1
              //       ? `${duspFilter.length} DUSPs selected`
              //       : ""}
              //   phaseLabel={phaseFilter !== null
              //     ? phases.find(p => p.id === phaseFilter)?.name || "All Phases"
              //     : "All Phases"}
              //   periodType={monthFilter ? "MONTH / YEAR" : "All Time"}
              //   periodValue={monthFilter ? `${monthFilter || ""} / ${yearFilter || ""}` : "All Records"}
              //   duspFilter={duspFilter}
              //   tpFilter={tpFilter}
              //   phaseFilter={phaseFilter}
              //   monthFilter={monthFilter}
              //   yearFilter={yearFilter}
              //   mcmcLogo={mcmcLogo}
              //   duspLogo={duspLogo}
              //   onGenerationStart={handleGenerationStart}
              //   onGenerationComplete={handleGenerationComplete}
            ) : activeTab === "month" ? (
              <></>
              // <SmartServiceByMonthReportDownloadButton

              //   duspLabel={duspFilter.length === 1
              //     ? dusps.find(d => d.id === duspFilter[0])?.name || ""
              //     : duspFilter.length > 1
              //       ? `${duspFilter.length} DUSPs selected`
              //       : ""}
              //   phaseLabel={phaseFilter !== null
              //     ? phases.find(p => p.id === phaseFilter)?.name || "All Phases"
              //     : "All Phases"}
              //   periodType={monthFilter ? "MONTH / YEAR" : "All Time"}
              //   periodValue={monthFilter ? `${monthFilter || ""} / ${yearFilter || ""}` : "All Records"}
              //   duspFilter={duspFilter}
              //   tpFilter={tpFilter}
              //   phaseFilter={phaseFilter}
              //   monthFilter={monthFilter}
              //   yearFilter={yearFilter}
              //   mcmcLogo={mcmcLogo}
              //   duspLogo={duspLogo}
              //   onGenerationStart={handleGenerationStart}
              //   onGenerationComplete={handleGenerationComplete}
            ) : null}
          </div>
        </div>

        <Tabs defaultValue="phase" value={activeTab} onValueChange={(tab) => { resetFilters(); setActiveTab(tab); }} className="w-full">
          <TabsList className="grid w-[550px] grid-cols-3">
            <TabsTrigger value="phase">By Phase</TabsTrigger>
            <TabsTrigger value="pillar">Pillar by Programme</TabsTrigger>
            <TabsTrigger value="month">By Month</TabsTrigger>
          </TabsList>
          <ModularReportFilters
            showFilters={{
              dusp: true,
              phase: activeTab === "phase",
              nadi: activeTab === "pillar" || activeTab === "month",
              tp: true,
              date: true,
              pillar: activeTab === "pillar",
              program: activeTab === "pillar",

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
            pillarFilter={pillarFilter}
            setPillarFilter={setPillarFilter}
            programFilter={programFilter}
            setProgramFilter={setprogramFilter}

            // Filter data
            dusps={dusps}
            phases={phases}
            nadiSites={nadiSites}
            tpOptions={tpProviders}
            monthOptions={monthOptions}
            yearOptions={yearOptions}
            pillarOptions={pillarOptions}
            programOptions={programOptions}

            // Loading state
            isLoading={filtersLoading}
          />

          {/* By Phase Tab */}
          <TabsContent value="phase" className="mt-4">

            {/* Main Content for Phase tab - Combined Bar and Line Chart */}
            <ReportSmartServiceByPhase
              duspFilter={duspFilter}
              phaseFilter={phaseFilter}
              tpFilter={tpFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
            />
          </TabsContent>

          {/* By Pillar & Programme Tab */}
          <TabsContent value="pillar" className="mt-4">
            {/* Summary Cards */}
            <ReportSmartServicePillarByProgramme
              duspFilter={duspFilter}
              nadiFilter={nadiFilter}
              tpFilter={tpFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
              pillarFilter={pillarFilter}
              programFilter={programFilter}
            />
          </TabsContent>

          {/* By Month Tab */}
          <TabsContent value="month" className="mt-4">
            {/* Main Content for Month tab - Bar Chart  */}
            <ReportSmartServiceByMonth
              duspFilter={duspFilter}
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

export default ReportSmartService;
