import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportList } from "@/components/reports/ReportList";

const ComplianceReports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">Compliance Reports</h1>
          <p className="text-muted-foreground mt-2">
            View and manage compliance-related reports
          </p>
        </div>
        <ReportList />
      </div>
    </DashboardLayout>
  );
};

export default ComplianceReports;