import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import { useSiteManagementPdfData } from "@/hooks/report/use-site-management-pdf-data";
import { useStableLoading } from "@/hooks/report/use-stable-loading";
import { ModularReportFilters } from "@/components/reports/filters";
import { SiteManagementReportDownloadButton } from "@/components/reports/pdftemplate/components";
import { useMcmcLogo, useDuspLogo } from "@/hooks/use-brand";
import {
  InsuranceCard,
  AuditCard,
  AgreementCard,
  UtilitiesCard,
  LocalAuthorityCard,
  AwarenessProgrammeCard,
} from "@/components/reports/component/sitemanagement";

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

const ReportSiteManagement = () => {
  // Filter states
  const [duspFilterState, setDuspFilter] = useState<(string | number)[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string | number | null>(null);
  const [nadiFilterState, setNadiFilter] = useState<(string | number)[]>([]);
  const [tpFilterState, setTpFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null);

  // Memoized filters to ensure stable references
  const duspFilter = useMemo(() => duspFilterState, [duspFilterState]);
  const nadiFilter = useMemo(() => nadiFilterState, [nadiFilterState]);
  const tpFilter = useMemo(() => tpFilterState, [tpFilterState]);

  // PDF generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Fetch filter options from API
  const { phases, dusps, nadiSites, tpProviders, loading: filtersLoading } = useReportFilters();
  // Fetch site management data for UI
  const {
    sites,
    utilities,
    insurance,
    localAuthority,
    audits,
    agreements,
    awarenessPromotion,
    loading: dataLoading,
    error
  } = useSiteManagementPdfData(duspFilter, phaseFilter, nadiFilter, monthFilter, yearFilter, tpFilter);

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
            <h1 className="text-xl font-bold">Site Management Report</h1>
            <p className="text-gray-500 mt-1">
              View and analyze site management data across all NADI sites
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SiteManagementReportDownloadButton
              duspLabel={
                duspFilter.length === 1
                  ? dusps.find((d) => d.id === duspFilter[0])?.name || ""
                  : duspFilter.length > 1
                  ? `${duspFilter.length} DUSPs selected`
                  : ""}              phaseLabel={phaseFilter !== null
                ? phases.find(p => p.id === phaseFilter)?.name || "All Phases"
                : "All Phases"}
              periodType={monthFilter ? "MONTH / YEAR" : (yearFilter ? "YEAR" : "All Time")}
              periodValue={monthFilter 
                ? `${monthOptions.find(m => m.id === monthFilter)?.label || ""} / ${yearFilter || ""}`
                : yearFilter 
                  ? `${yearFilter}` 
                  : "All Records"}
              duspFilter={duspFilter}
              phaseFilter={phaseFilter}
              nadiFilter={nadiFilter}
              tpFilter={tpFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
              mcmcLogo={mcmcLogo}
              duspLogo={duspLogo}
              onGenerationStart={handleGenerationStart}
              onGenerationComplete={handleGenerationComplete}
            />
          </div>
        </div>
        {/* Filters */}

        <ModularReportFilters
          // Show all filters for site management report
          showFilters={{
            dusp: true,
            phase: true,
            nadi: true,
            tp: true,
            date: true,
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
          nadiSites={nadiSites}
          tpOptions={tpProviders}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          // Loading state
          isLoading={filtersLoading}
        />        {/* Statistics Cards Grid */}        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LocalAuthorityCard
            loading={dataStableLoading}
            siteCount={sites?.length || 0}
            laRecordSiteCount={localAuthority ? new Set(localAuthority.map(la => la.site_id)).size : 0}
          />

          <InsuranceCard
            loading={dataStableLoading}
            siteCount={sites?.length || 0}
            insuredSiteCount={insurance ? new Set(insurance.map(i => i.site_id)).size : 0}
          />

          <AuditCard
            loading={dataStableLoading}
            siteCount={sites?.length || 0}
            auditedSiteCount={audits ? new Set(audits.map(a => a.site_id)).size : 0}
          />

          <AgreementCard
            loading={dataStableLoading}
            siteCount={sites?.length || 0}
            agreementSiteCount={agreements ? new Set(agreements.map(a => a.site_id)).size : 0}          />
          
          <UtilitiesCard
            loading={dataStableLoading}
            siteCount={sites?.length || 0}
            utilitySiteCount={utilities ? new Set(utilities.map(u => u.site_id)).size : 0}
            totalBills={utilities ? utilities.reduce((sum, u) => sum + (u.total_bills || 0), 0) : 0}
            totalAmount={utilities ? utilities.reduce((sum, u) => sum + (u.total_amount || 0), 0) : 0}
            utilityTypes={utilities ? [
              ...(utilities.filter(u => u.has_water).length > 0 ? ['Water'] : []),
              ...(utilities.filter(u => u.has_electricity).length > 0 ? ['Electricity'] : []),
              ...(utilities.filter(u => u.has_sewerage).length > 0 ? ['Sewerage'] : [])
            ] : []}          />
          <AwarenessProgrammeCard
            loading={dataStableLoading}
            siteCount={sites?.length || 0}
            programmesSiteCount={awarenessPromotion ? new Set(awarenessPromotion.map(ap => ap.site_id)).size : 0}
            totalProgrammes={awarenessPromotion ? awarenessPromotion.length : 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportSiteManagement;
