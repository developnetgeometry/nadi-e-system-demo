import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import { useHRSalaryData } from "@/hooks/report/use-hr-salary-data";
import { useStableLoading } from "@/hooks/report/use-stable-loading";
import { ModularReportFilters } from "@/components/reports/filters";
import { HRSalaryReportDownloadButton } from "@/components/reports/pdftemplate/components";
import { useMcmcLogo, useDuspLogo } from "@/hooks/use-brand";
import {
  StaffMetricsCard,
  SalaryCard,
  IncentivesCard,
  StaffDistributionCard,
  VacancyCard,
  TurnoverRateCard,
  VacancyAnalysisCard,
  TurnoverTrendCard,
} from "@/components/reports/component/hrsalary";

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

// TP options will be fetched from the useReportFilters hook

const ReportHRSalary = () => {
  // Filter states
  const [duspFilter, setDuspFilter] = useState<(string | number)[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string | number | null>(null);
  const [tpFilter, setTpFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null); // Default to null instead of current year

  // PDF generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Fetch filter options from API
  const {
    phases,
    dusps,
    tpProviders,
    loading: filtersLoading,
  } = useReportFilters();

  // Fetch HR salary data based on filters
  const {
    staff,
    totalStaff,
    activeNadiSites,
    sitesWithIncentives,
    averageSalary,
    averageIncentive,
    employeeDistribution,
    vacancies,
    turnoverRates,
    averageTurnoverRate,
    loading: dataLoading,
    error,
  } = useHRSalaryData(
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
            <h1 className="text-xl font-bold">Human Resources</h1>
            <p className="text-gray-500 mt-1">
              View and analyze staff data across all NADI sites
            </p>
          </div>{" "}
          <div className="flex items-center gap-2">
            {" "}
            <HRSalaryReportDownloadButton
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
              duspFilter={duspFilter}
              phaseFilter={phaseFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
              mcmcLogo={mcmcLogo}
              duspLogo={duspLogo}
              fileName={`hr-salary-report-${
                new Date().toISOString().split("T")[0]
              }.pdf`}
              onGenerationStart={handleGenerationStart}
              onGenerationComplete={handleGenerationComplete}
            />
          </div>
        </div>
        {/* Filters */}{" "}
        <ModularReportFilters
          // Show all filters for HR report
          showFilters={{
            dusp: true,
            phase: true,
            nadi: false,
            tp: true,
            date: true,
          }} // Filter state
          duspFilter={duspFilter}
          setDuspFilter={setDuspFilter}
          phaseFilter={phaseFilter}
          setPhaseFilter={setPhaseFilter}
          tpFilter={tpFilter}
          setTpFilter={setTpFilter}
          monthFilter={monthFilter}
          setMonthFilter={setMonthFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter} // Filter data
          dusps={dusps}
          phases={phases}
          tpOptions={tpProviders}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          // Loading state
          isLoading={filtersLoading}
        />{" "}
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          <StaffMetricsCard
            loading={dataStableLoading}
            totalStaff={totalStaff}
            activeNadiSites={activeNadiSites}
            sitesWithIncentives={sitesWithIncentives}
            employeeDistribution={employeeDistribution}
          />
          <SalaryCard
            loading={dataStableLoading}
            averageSalary={averageSalary}
            activeNadiSites={activeNadiSites}
          />
          <IncentivesCard
            loading={dataStableLoading}
            sitesWithIncentives={sitesWithIncentives}
            averageIncentive={averageIncentive}
          />
          <VacancyCard loading={dataStableLoading} vacancies={vacancies} />{" "}
          <TurnoverRateCard
            loading={dataStableLoading}
            turnoverRates={turnoverRates}
            averageTurnoverRate={averageTurnoverRate}
          />
          <div className="md:col-span-3 lg:col-span-4">
            <StaffDistributionCard
              loading={dataStableLoading}
              employeeDistribution={employeeDistribution}
            />
          </div>
          <div className="md:col-span-3 lg:col-span-4">
            <VacancyAnalysisCard
              loading={dataStableLoading}
              vacancies={vacancies}
            />
          </div>
          <div className="md:col-span-3 lg:col-span-4">
            <TurnoverTrendCard
              loading={dataStableLoading}
              turnoverRates={turnoverRates}
              averageTurnoverRate={averageTurnoverRate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHRSalary;
