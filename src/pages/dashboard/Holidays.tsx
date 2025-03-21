
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Helmet } from "react-helmet";
import HolidayManagement from "@/components/calendar-management/HolidayManagement";

const Holidays = () => {
  return (
    <SidebarProvider>
      <Helmet>
        <title>Holidays | Dashboard</title>
      </Helmet>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Holiday Management</h1>
            <HolidayManagement />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Holidays;
