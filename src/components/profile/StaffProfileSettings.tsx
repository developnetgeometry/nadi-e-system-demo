import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileOverviewPage from "./components/OverviewPage";
import ProfileAddressPage from "./components/AddressPage";
import ProfilePayInfoPage from "./components/PayInfoPage";
import { useStaffProfile } from "./hook/use-staff-profile";

const StaffProfileSettings = () => {
  const { data: staffProfile, isLoading, isError, error, refetch } = useStaffProfile();

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  if (isError) {
    return <div>Error: {error?.message}</div>; // Show an error message if fetching fails
  }

  return (
    <Tabs defaultValue="overview" className="mt-6">
      <TabsList className="border-b dark:border-gray-700 w-full justify-start bg-transparent p-0 h-auto overflow-x-auto mb-6">
        <TabsTrigger value="overview" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Overview</TabsTrigger>
        <TabsTrigger value="address" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Address</TabsTrigger>
        <TabsTrigger value="payinfo" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Pay Info</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="h-full mt-0">
        <Card className="h-full">
          <div className="p-6 h-full">
            {/* Pass the staff profile data to ProfileOverviewPage */}
            <ProfileOverviewPage profileData={staffProfile} refetch={refetch} userType={""} userGroup={6}/>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="address" className="h-full mt-0">
        <Card className="h-full">
          <div className="p-6 h-full">
            <ProfileAddressPage />
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="payinfo" className="h-full mt-0">
        <Card className="h-full">
          <div className="p-6 h-full">
            <ProfilePayInfoPage />
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StaffProfileSettings;