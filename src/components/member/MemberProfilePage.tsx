import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileOverviewPage from "../profile/components/OverviewPage";
import ProfileAddressPage from "../profile/components/AddressPage";
import { useMemberProfileByUserId } from "../profile/hook/use-member-profile";


const MemberProfilePage = ({ userId }: { userId: string }) => {
    const { data: memberProfile, isLoading, isError, error, refetch } = useMemberProfileByUserId(userId);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  if (!memberProfile) {
    return <div>This member does not have a profile yet.</div>; // Show a message if the profile is null
  }

  if (isError) {
    return <div>Error: {error?.message}</div>; // Show an error message if fetching fails
  }

  return (
    <Tabs defaultValue="overview" className="mt-6">
      <TabsList className="border-b dark:border-gray-700 w-full justify-start bg-transparent p-0 h-auto overflow-x-auto mb-6">
        <TabsTrigger value="overview" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Overview</TabsTrigger>
        <TabsTrigger value="address" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Address</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="h-full mt-0">
        <Card className="h-full">
          <div className="p-6 h-full">
            {/* Pass the member profile data to ProfileOverviewPage */}
            <ProfileOverviewPage profileData={memberProfile} refetch={refetch} userType={""} userGroup={7}/>
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
    </Tabs>
  );
};

export default MemberProfilePage;