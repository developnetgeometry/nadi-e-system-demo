import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileOverviewPage from "../profile/components/OverviewPage";
import ProfileAddressPage from "../profile/components/AddressPage";
import { useMemberAddress, useMemberProfileByUserId } from "../profile/hook/use-member-profile";


const MemberProfilePage = ({ userId }: { userId: string }) => {
  const { data: memberProfile, isLoading, isError, error, refetch } = useMemberProfileByUserId(userId);
  const memberId = memberProfile?.id; // Extract member_id from memberProfile
  const { data: memberAddress, isLoading: isAddressLoading, isError: isAddressError, error: addressError, refetch: refetchAddress } = useMemberAddress(memberId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ); // Show a loading state while fetching data
  }

  if (!memberProfile) {
    return <div>This member does not have a profile yet.</div>; // Show a message if the profile is null
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
            <ProfileOverviewPage profileData={memberProfile} refetch={refetch} userType={""} userGroup={7} />
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="address" className="h-full mt-0">
        <Card className="h-full">
          <div className="p-6 h-full">
            <ProfileAddressPage
              addressData={memberAddress}
              memberId={memberId}
              refetch={refetchAddress} // Pass refetch function
            />
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default MemberProfilePage;