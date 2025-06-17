import {
  BookOpenText,
  SquareChartGantt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterFinance } from "./reusables/FilterFinance";
import { useEffect, useState } from "react";
import { PaginationTableServer } from "@/components/site/component/PaginationTableServer";
import { useFinanceQueries } from "@/hooks/finance/use-finance-queries";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useDebounce } from "@/hooks/use-debounce";

const FinanceDashboard = () => {
  const {
    useFinanceReportWithFilterAndPagination,
    useAllFinanceReports
  } = useFinanceQueries();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchDebounce = useDebounce(search, 300);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [bodyTableData, setBodyTableData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({
    status: "",
    month: "",
    year: "",
    phase: "",
    region: "",
  });
  const {
    data: allFinanceReports,
    isLoading: allFinanceReportsLoading
  } = useAllFinanceReports();
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
    10
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

  if (
    allFinanceReportsLoading
  ) {
    return <LoadingSpinner />
  }

  return (
    <section className="space-y-6">
      <HeaderDashBoard />
      <FilterFinance
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setSearch={setSearch}
      />
      <PaginationTableServer
        page={page}
        setPage={setPage}
        totalPages={allFinanceReports.length}
        contentResult={bodyTableData}
        handleSelectedSite={setSelectedSiteId}
        headTable={headTable}
        isLoading={financeReportWithFilterAndPaginationLoading}
      />
    </section>
  )
};

const HeaderDashBoard = () => {
  return (
    <section className="flex justify-between items-center">
      <div className="">
        <h1 className="text-4xl font-extrabold">Finance Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of financial reports and their current status.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button className="bg-white text-black border border-gray-200 hover:bg-gray-200">
          <SquareChartGantt />
          By Year Report
        </Button>
        <Button className="bg-white text-black border border-gray-200 hover:bg-gray-200">
          <BookOpenText />
          Montly Statements
        </Button>
      </div>
    </section>
  );
};

export default FinanceDashboard;
