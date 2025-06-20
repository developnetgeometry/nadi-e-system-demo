import {
  BookOpenText,
  CircleDot,
  SquareChartGantt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterFinance } from "./reusables/FilterFinance";
import { useEffect, useState } from "react";
import { PaginationTableServer } from "@/components/site/component/PaginationTableServer";
import { useFinanceQueries } from "@/hooks/finance/use-finance-queries";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useDebounce } from "@/hooks/use-debounce";
import { FinaceStats } from "./reusables/FinanceStats";
import { Link } from "react-router-dom";
import { useUserOrgId } from "./utils/useUserOrgId";
import { useTpManagerSiteId } from "@/hooks/use-site-id";
import { useBookingQueries } from "@/hooks/booking/use-booking-queries";
import { getMonthNameByNumber } from "./utils/getMonthNameByNumber";

interface FinanceDashboardProps {
  isDashBoardPage?: boolean
}
const FinanceDashboard = ({
  isDashBoardPage = true
}: FinanceDashboardProps) => {
  const {
    tpFinanceOrganizationId,
    tpAdminOrganizationId,
    tpOperationsOrganizationId,
    tpSiteOrganizationId,
    isSuperAdmin,
    isMember,
    isTpSite,
    isTpAdmin,
    isTpOperations,
    isTpFinance
  } = useUserOrgId();
  // Tp manager site
  const { siteId: tpManagerSiteId, isLoading: tpManagerSiteIdLoading } = useTpManagerSiteId(isTpSite, tpSiteOrganizationId);
  // Tp admin sites
  const selectedTpOrgId = isTpAdmin
    ? tpAdminOrganizationId
    : isTpOperations
      ? tpOperationsOrganizationId
      : isTpFinance
        ? tpFinanceOrganizationId
        : null;

  const { useTpsSites } = useBookingQueries();
  const { data: tpsSites, isLoading: isTpsSitesLoading } = useTpsSites(selectedTpOrgId);
  const tpSiteIds = tpsSites?.map(tp => tp.id) ?? [];

  console.log("tpSiteIds", tpSiteIds);
  console.log("tp manager site id", tpManagerSiteId);
  const {
    useFinanceReportWithFilterAndPagination,
    useAllFinanceReports
  } = useFinanceQueries();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchDebounce = useDebounce(search, 300);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [bodyTableData, setBodyTableData] = useState([]);
  const getCurrentYear = new Date().getFullYear();
  const getCurrentMonth = new Date().getMonth() + 1;
  const [selectedFilter, setSelectedFilter] = useState({
    status: "",
    month: getMonthNameByNumber(getCurrentMonth),
    year: String(getCurrentYear),
    phase: "",
    region: "",
  });
  const maxItemPerPage = 10;
  const {
    data: allFinanceReports,
    isLoading: allFinanceReportsLoading
  } = useAllFinanceReports(tpSiteIds, Number(tpManagerSiteId));
  const {
    data: financeReportWithFilterAndPagination,
    isLoading: financeReportWithFilterAndPaginationLoading
  } = useFinanceReportWithFilterAndPagination(
    selectedFilter.year,
    selectedFilter.month,
    searchDebounce,
    selectedFilter.status,
    selectedFilter.phase,
    selectedFilter.region,
    page,
    maxItemPerPage,
    tpSiteIds,
    Number(tpManagerSiteId)
  );

  useEffect(() => {
    const formattedToTableBodyData = financeReportWithFilterAndPagination?.map((report: any, i) => {
      return {
        no: i + 1,
        siteName: report.nd_site_profile.sitename,
        month: report.month,
        year: report.year,
        phase: report.nd_site_profile.nd_phases.name,
        region: report.nd_site_profile.nd_region.eng,
        status: report.nd_finance_report_status.status,
        income: report.income,
        expense: report.expense,
        action: `reports/${report.id}`,
      };
    });
    setBodyTableData(formattedToTableBodyData || []);
  }, [financeReportWithFilterAndPagination]);

  const headTable = [
    { key: "no", label: "No" },
    { key: "siteName", label: "Site Name" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
    { key: "phase", label: "Phase" },
    { key: "region", label: "Region" },
    { key: "status", label: "Status" },
    { key: "income", label: "Income" },
    { key: "expense", label: "Expense" },
    { key: "action", label: "Action" }
  ];

  const financeReportStatus = {
    editing: allFinanceReports?.filter((report: any) => report.nd_finance_report_status.status === "editing").length,
    submitted: allFinanceReports?.filter((report: any) => report.nd_finance_report_status.status === "submitted").length,
    verified: allFinanceReports?.filter((report: any) => report.nd_finance_report_status.status === "verified").length,
    closed: allFinanceReports?.filter((report: any) => report.nd_finance_report_status.status === "closed").length,
  }

  const statsData = [
    {
      title: "Editing",
      value: String(financeReportStatus.editing),
      icon: CircleDot,
      description: "",
      iconBgColor: "bg-blue-200",
      iconTextColor: "text-blue-500",
    },
    {
      title: "Submitted",
      value: String(financeReportStatus.submitted),
      icon: CircleDot,
      description: "",
      iconBgColor: "bg-yellow-100",
      iconTextColor: "text-yellow-500",
    },
    {
      title: "Verified",
      value: String(financeReportStatus.verified),
      icon: CircleDot,
      description: "",
      iconBgColor: "bg-green-100",
      iconTextColor: "text-green-500",
    },
    {
      title: "Closed",
      value: String(financeReportStatus.closed),
      icon: CircleDot,
      description: "",
      iconBgColor: "bg-gray-100",
      iconTextColor: "text-gray-500",
    },
  ]

  if (
    allFinanceReportsLoading ||
    tpManagerSiteIdLoading ||
    isTpsSitesLoading
  ) {
    return <LoadingSpinner />
  }

  return (
    <section className="space-y-6">
      {isDashBoardPage ?
        <HeaderDashBoard
          title="Finance Dashboard"
          description="Overview of financial reports and their current status."
        /> :
        <HeaderDashBoard
        isDashBoardPage={false}
          title="Finance Report Site List"
          description="View and manage all site reports."
        />
      }
      <FilterFinance
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setSearch={setSearch}
      />
      <FinaceStats
        statsData={statsData}
      />
      <PaginationTableServer
        page={page}
        setPage={setPage}
        totalPages={Math.ceil(allFinanceReports.length / maxItemPerPage)}
        contentResult={bodyTableData}
        handleSelectedSite={setSelectedSiteId}
        headTable={headTable}
        isLoading={financeReportWithFilterAndPaginationLoading}
      />
    </section>
  )
};

const HeaderDashBoard = ({
  isDashBoardPage = true,
  title,
  description
}) => {
  return (
    <section className="flex justify-between items-center">
      <div className="">
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      {isDashBoardPage && (
        <div className="flex items-center gap-2">
          <Link to="/finance/by-year-reports">
            <Button className="bg-white text-black border border-gray-200 hover:bg-gray-200">
              <SquareChartGantt />
              By Year Report
            </Button>
          </Link>
          <Link to="/finance/monthly-statements">
            <Button className="bg-white text-black border border-gray-200 hover:bg-gray-200">
              <BookOpenText />
              Montly Statements
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default FinanceDashboard;
