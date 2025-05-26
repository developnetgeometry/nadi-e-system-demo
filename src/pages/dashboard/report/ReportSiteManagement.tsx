import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import { useSiteManagementData } from "@/hooks/report/use-site-management-data";
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

// TP options will be fetched from the useReportFilters hook

const ReportSiteManagement = () => {
  // Filter states
  const [duspFilter, setDuspFilter] = useState<(string | number)[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string | number | null>(null);
  const [nadiFilter, setNadiFilter] = useState<(string | number)[]>([]);
  const [tpFilter, setTpFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null); // Default to null instead of current year

  // PDF generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false); // Fetch filter options from API
  const {
    phases,
    dusps,
    nadiSites,
    tpProviders,
    loading: filtersLoading,
  } = useReportFilters(); // Fetch site management data based on filters
  const {
    sites,
    utilities,
    insurance,
    localAuthority,
    audits,
    agreements,
    loading: dataLoading,
  } = useSiteManagementData(
    duspFilter,
    phaseFilter,
    nadiFilter,
    monthFilter,
    yearFilter,
    tpFilter
  );

  // Calculate utilities summary from the utilities data we already have
  const utilitiesSummary = useMemo(() => {
    // Calculate totals
    const totalCount = utilities.length;
    const totalAmount = utilities.reduce(
      (sum, u) => sum + (u.amount_bill || 0),
      0
    );

    // Group utilities by type
    const typeGroups = utilities.reduce((groups, utility) => {
      const type = utility.type_name;
      if (!groups[type]) {
        groups[type] = {
          type,
          count: 0,
          amount: 0,
        };
      }
      groups[type].count += 1;
      groups[type].amount += utility.amount_bill || 0;
      return groups;
    }, {});

    return {
      totalCount,
      totalAmount,
      byType: Object.values(typeGroups),
    };
  }, [utilities]);

  // Calculate stats for cards
  const activeInsurance = insurance.filter((i) => i.status === "Active").length;
  const expiringInsurance = insurance.filter(
    (i) => i.status === "Expiring Soon"
  ).length;
  const expiredInsurance = insurance.filter(
    (i) => i.status === "Expired"
  ).length;

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
              nadiFilter={nadiFilter}
              totalSites={sites.length}
              mcmcLogo={mcmcLogo}
              duspLogo={duspLogo}
              sites={sites.map((site) => ({
                standard_code: site.standard_code || "",
                name: site.sitename || "",
                state: site.phase_name || "",
              }))}
              utilities={utilities.map((utility) => ({
                site_id: utility.site_id,
                site_name: utility.sitename || "",
                state: "",
                has_water: utility.type_name === "Water",
                has_electricity: utility.type_name === "Electricity",
                has_sewerage: utility.type_name === "Sewerage",
              }))}
              insurance={insurance.map((ins) => ({
                standard_code: ins.site_id || "",
                site_name: ins.sitename || "",
                state: "",
                duration:
                  ins.start_date && ins.end_date
                    ? `${new Date(
                        ins.start_date
                      ).toLocaleDateString()} - ${new Date(
                        ins.end_date
                      ).toLocaleDateString()}`
                    : "N/A",
              }))}
              localAuthority={localAuthority.map((la) => ({
                standard_code: la.site_id || "",
                site_name: la.sitename || "",
                state: "",
              }))}
              audits={audits.map((audit) => ({
                standard_code: audit.site_id || "",
                site_name: audit.sitename || "",
                state: "",
              }))}
              agreements={agreements.map((agreement) => ({
                standard_code: agreement.site_id || "",
                site_name: agreement.sitename || "",
                state: "",
              }))}
              programmes={[]}
              fileName={`site-management-report-${
                new Date().toISOString().split("T")[0]
              }.pdf`}
              onGenerationStart={handleGenerationStart}
              onGenerationComplete={handleGenerationComplete}
            />
          </div>
        </div>{" "}
        {/* Filters */}{" "}
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
          setYearFilter={setYearFilter} // Filter data
          dusps={dusps}
          phases={phases}
          nadiSites={nadiSites}
          tpOptions={tpProviders}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          // Loading state
          isLoading={filtersLoading}
        />
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LocalAuthorityCard
            loading={dataStableLoading}
            siteCount={sites.length}
            laRecordSiteCount={
              new Set(localAuthority.map((la) => la.site_id)).size
            }
          />

          <InsuranceCard
            loading={dataStableLoading}
            siteCount={sites.length}
            insuredSiteCount={new Set(insurance.map((i) => i.site_id)).size}
            activeCount={activeInsurance}
            expiringCount={expiringInsurance}
            expiredCount={expiredInsurance}
          />

          <AuditCard
            loading={dataStableLoading}
            siteCount={sites.length}
            auditedSiteCount={new Set(audits.map((a) => a.site_id)).size}
          />

          <AgreementCard
            loading={dataStableLoading}
            siteCount={sites.length}
            agreementSiteCount={new Set(agreements.map((a) => a.site_id)).size}
          />

          <UtilitiesCard
            loading={dataStableLoading}
            siteCount={sites.length}
            utilitySiteCount={new Set(utilities.map((u) => u.site_id)).size}
            totalBills={utilitiesSummary.totalCount}
            totalAmount={utilitiesSummary.totalAmount}
            utilityTypes={(utilitiesSummary.byType as any[]).map((t) => t.type)}
          />

          <AwarenessProgrammeCard
            loading={dataStableLoading}
            siteCount={sites.length}
            programmesSiteCount={0} // No data available yet
            totalProgrammes={0}
            completedCount={0}
            upcomingCount={0}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportSiteManagement;
