import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportList } from "@/components/reports/ReportList";

const Reports = () => {
  return (
    <div>
      <div className="space-y-1">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">
            View and manage system reports
          </p>
        </div>
        <ReportList />
      </div>
    </div>
  );
};

export default Reports;
