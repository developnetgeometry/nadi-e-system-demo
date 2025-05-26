import { DashboardLayout } from "@/components/layout/DashboardLayout";
import NADIInfo from "@/components/hr/dashboard/NADIInfo";
import Membership from "@/components/hr/dashboard/Membership";
import Events from "@/components/hr/dashboard/Events";
import LocationMap from "@/components/hr/dashboard/LocationMap";
import OperationHours from "@/components/hr/dashboard/OperationHours";
import ServiceProvider from "@/components/hr/dashboard/ServiceProvider";
import ContactInfo from "@/components/hr/dashboard/ContactInfo";
import OtherDetails from "@/components/hr/dashboard/OtherDetails";
import DashboardStatistics from "@/components/hr/dashboard/DashboardStatistics";
import QuickActions from "@/components/hr/dashboard/QuickActions";
import RecentActivity from "@/components/hr/dashboard/RecentActivity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SiteManagementDashboard = () => {
  return (
    <div>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold mb-6">NADI Staff Dashboard</h1>

        <div className="space-y-1 mb-6">
          <DashboardStatistics />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="mb-6">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex mb-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-1">
            <NADIInfo />
            <LocationMap />
            <ServiceProvider />
            <ContactInfo />
            <OtherDetails />
          </TabsContent>

          <TabsContent value="operations" className="space-y-1">
            <OperationHours />
            <ServiceProvider />
            <OtherDetails />
          </TabsContent>

          <TabsContent value="community" className="space-y-1">
            <Membership />
            <Events />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SiteManagementDashboard;
