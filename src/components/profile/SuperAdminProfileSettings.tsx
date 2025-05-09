import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileOverviewPage from "./components/OverviewPage";
import { useSuperAdminProfile } from "./hook/use-superadmin-profile";

const SuperAdminProfileSettings = () => {
  const { data: superadminProfile, isLoading, isError, error, refetch} = useSuperAdminProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ); // Show a loading state while fetching data
  }

  if (!superadminProfile) {
    return <div className="text-center">This user does not have a profile yet.</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>; // Show an error message if fetching fails
  }

  return (
    <Tabs defaultValue="overview" className="mt-6">
      <TabsList className="border-b dark:border-gray-700 w-full justify-start bg-transparent p-0 h-auto overflow-x-auto mb-6">
        <TabsTrigger value="overview" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Overview</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="h-full mt-0">
        <Card className="h-full">
          <div className="p-6 h-full">
            <ProfileOverviewPage profileData={superadminProfile} refetch={refetch} userType={"super_admin"} userGroup={999}/>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SuperAdminProfileSettings;