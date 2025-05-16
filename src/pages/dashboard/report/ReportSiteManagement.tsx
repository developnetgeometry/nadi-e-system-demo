import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import { useSiteManagementData } from "@/hooks/report/use-site-management-data";
import { useStableLoading } from "@/hooks/report/use-stable-loading";
import { ReportFilters } from "@/components/reports/filters";
import {
  SiteOverviewCard,
  InsuranceCard,
  AuditCard,
  AgreementCard,
  UtilitiesCard,
  LocalAuthorityCard,
  AwarenessProgrammeCard
} from "@/components/reports";

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
  const [duspFilter, setDuspFilter] = useState<string | number | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<(string | number)[]>([]);
  const [nadiFilter, setNadiFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null); // Default to null instead of current year

  // Fetch filter options from API
  const { phases, dusps, nadiSites, loading: filtersLoading } = useReportFilters();

  // Fetch site management data based on filters
  const {
    sites,
    utilities,
    insurance,
    audits,
    agreements,
    loading: dataLoading
  } = useSiteManagementData(duspFilter, phaseFilter, nadiFilter, monthFilter, yearFilter);

  // Calculate utilities summary from the utilities data we already have
  const utilitiesSummary = useMemo(() => {
    // Calculate totals
    const totalCount = utilities.length;
    const totalAmount = utilities.reduce((sum, u) => sum + (u.amount_bill || 0), 0);

    // Group utilities by type
    const typeGroups = utilities.reduce((groups, utility) => {
      const type = utility.type_name;
      if (!groups[type]) {
        groups[type] = {
          type,
          count: 0,
          amount: 0
        };
      }
      groups[type].count += 1;
      groups[type].amount += utility.amount_bill || 0;
      return groups;
    }, {});

    return {
      totalCount,
      totalAmount,
      byType: Object.values(typeGroups)
    };
  }, [utilities]);

  // Calculate stats for cards
  const activeInsurance = insurance.filter(i => i.status === 'Active').length;
  const expiringInsurance = insurance.filter(i => i.status === 'Expiring Soon').length;
  const expiredInsurance = insurance.filter(i => i.status === 'Expired').length;

  const pendingAudits = audits.filter(a => a.status === 'Pending').length;
  const inProgressAudits = audits.filter(a => a.status === 'In Progress').length;
  const completedAudits = audits.filter(a => a.status === 'Completed').length;

  const activeAgreements = agreements.filter(a => a.status === 'Active').length;
  const expiringAgreements = agreements.filter(a => a.status === 'Expiring Soon').length;

  // Use individual stable loading states for each component
  const filtersStableLoading = useStableLoading(filtersLoading);
  const dataStableLoading = useStableLoading(dataLoading);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Site Management</h1>
            <p className="text-gray-500 mt-1">View and analyze site management data across all NADI sites</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="secondary" className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Excel
            </Button> */}
            <Button variant="secondary" className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters
          // Filter state
          duspFilter={duspFilter}
          setDuspFilter={setDuspFilter}
          phaseFilter={phaseFilter}
          setPhaseFilter={setPhaseFilter}
          nadiFilter={nadiFilter}
          setNadiFilter={setNadiFilter}
          monthFilter={monthFilter}
          setMonthFilter={setMonthFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}

          // Filter data
          dusps={dusps}
          phases={phases}
          nadiSites={nadiSites}
          monthOptions={monthOptions}
          yearOptions={yearOptions}

          // Loading state
          isLoading={filtersLoading}
        />

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* <SiteOverviewCard
            loading={filtersStableLoading || dataStableLoading}
            siteCount={sites.length}
            activeSiteCount={sites.filter(s => s.is_active).length}
            uniquePhaseCount={new Set(sites.map(s => s.phase_id)).size}
            uniqueDuspCount={new Set(sites
              .filter(s => s.dusp_id !== null && s.dusp_id !== undefined && s.dusp_id !== "")
              .map(s => s.dusp_id)).size}
            totalSiteCount={nadiSites?.length || 0}
          /> */}

          <LocalAuthorityCard
            loading={dataStableLoading}
            siteCount={sites.length}
            laRecordSiteCount={0} // No data available yet
            compliantCount={0}
            pendingCount={0}
            inProgressCount={0}
          />
          
          <InsuranceCard
            loading={dataStableLoading}
            siteCount={sites.length}
            insuredSiteCount={new Set(insurance.map(i => i.site_id)).size}
            activeCount={activeInsurance}
            expiringCount={expiringInsurance}
            expiredCount={expiredInsurance}
          />

          <AuditCard
            loading={dataStableLoading}
            siteCount={sites.length}
            auditedSiteCount={new Set(audits.map(a => a.site_id)).size}
            completedCount={completedAudits}
            inProgressCount={inProgressAudits}
            pendingCount={pendingAudits}
          />

          <AgreementCard
            loading={dataStableLoading}
            siteCount={sites.length}
            agreementSiteCount={new Set(agreements.map(a => a.site_id)).size}
            activeCount={activeAgreements}
            expiringCount={expiringAgreements}
          />

          <UtilitiesCard
            loading={dataStableLoading}
            siteCount={sites.length}
            utilitySiteCount={new Set(utilities.map(u => u.site_id)).size}
            totalBills={utilitiesSummary.totalCount}
            totalAmount={utilitiesSummary.totalAmount}
            utilityTypes={(utilitiesSummary.byType as any[]).map(t => t.type)}
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
    </DashboardLayout>
  );
};

export default ReportSiteManagement;