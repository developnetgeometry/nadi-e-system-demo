import { Eye, EyeOff, Users, UserCheck, UserCog, DollarSign, Printer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteProfile, useSiteStats } from "./hook/use-site-profile";
import { useSiteCode } from "./hook/use-site-code";
import useSiteGeneralData from "@/hooks/use-site-general-data";
import { StatsCard } from "./component/StatsCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverviewPage from "./component/OverviewPage";
import StaffPage from "./component/StaffPage";
import BillingPage from "./component/BillingPage";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import InsurancePage from "./component/InsurancePage.tsx";
import React from "react";


interface SiteDetailProps {
  siteId: string;
}

const SiteDetail: React.FC<SiteDetailProps> = ({ siteId }) => {
  const { data, socioeconomics, space, address, loading, error } = useSiteProfile(siteId); // Pass address
  const { siteCode, loading: codeLoading, error: codeError } = useSiteCode(siteId);
  const { totalMembers, activeMembers, staffMembers, totalRevenue, loading: statsLoading, error: statsError } = useSiteStats(siteId);
  const { siteStatus } = useSiteGeneralData();

  const stats = [
    {
      title: "Total Members",
      value: totalMembers,
      icon: Users,
      iconBgColor: "bg-blue-100",
      iconTextColor: "text-blue-600",
    },
    {
      title: "Active Members",
      value: activeMembers,
      icon: UserCheck,
      iconBgColor: "bg-green-100",
      iconTextColor: "text-green-600",
    },
    {
      title: "Staff Members",
      value: staffMembers,
      icon: UserCog,
      iconBgColor: "bg-purple-100",
      iconTextColor: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconBgColor: "bg-yellow-100",
      iconTextColor: "text-yellow-600",
    },
  ];

  const handlePrint = () => {
    const printContent = document.getElementById("printable-content");
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore the original content
    }
  };

  if (loading || codeLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>);
  }

  return (
    <div className="space-y-6" id="printable-content">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{data?.fullname ?? "Site Name"}</h1>
          <h3 className="text-muted-foreground">
            Site Code: <span className="font-bold">{siteCode ?? "N/A"}</span>
          </h3>
          <div className="font-medium flex items-center gap-2">
            <span className="text-muted-foreground">Status: </span>
            <span className="font-medium flex items-center gap-2">
              {data?.active_status?.eng ?? "N/A"}
              {data?.is_active ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </span>
          </div>
        </div>
        <Button
          onClick={handlePrint}
          className="bg-primary text-white p-4 rounded-md hover:bg-primary-dark print:hidden" // Add print:hidden to exclude from print
        >
          <Printer className="h-5 w-5" /> {/* Replace text with Printer icon */}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconTextColor={stat.iconTextColor}
          />
        ))}
      </div>

      <Tabs defaultValue="overview" className="mt-6 tabs-print">
        <TabsList className="border-b dark:border-gray-700 w-full justify-start bg-transparent p-0 h-auto overflow-x-auto mb-6 print:hidden">
          <TabsTrigger value="overview" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Overview</TabsTrigger>
          <TabsTrigger value="billing" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Billing</TabsTrigger>
          <TabsTrigger value="insurance" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Insurance</TabsTrigger>
          <TabsTrigger value="staff" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
              <OverviewPage site={data} socioeconomics={socioeconomics} space={space} address={address} /> {/* Pass address */}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
              <BillingPage siteId={siteId} />
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="insurance" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
              <InsurancePage siteId={siteId} />
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="staff" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
              <StaffPage siteId={siteId} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetail;