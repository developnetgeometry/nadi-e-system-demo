import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgrammeList } from "@/components/programmes/ProgrammeList";

const ProgrammesDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Programmes Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage organization programmes
          </p>
        </div>
        <ProgrammeList />
      </div>
    </DashboardLayout>
  );
};

export default ProgrammesDashboard;