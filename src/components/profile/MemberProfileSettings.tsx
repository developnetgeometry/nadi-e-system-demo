import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemberProfile } from "./hook/use-member-profile";
import { useMemberAddress } from "./hook/use-member-profile";
import ProfileOverviewPage from "./components/OverviewPage";
import ProfileAddressPage from "./components/AddressPage";

const MemberProfileSettings = () => {
  const { data: memberProfile, isLoading: isProfileLoading, isError: isProfileError, error: profileError, refetch: refetchProfile } = useMemberProfile();
  const memberId = memberProfile?.id; // Extract member_id from memberProfile
  const { data: memberAddress, isLoading: isAddressLoading, isError: isAddressError, error: addressError, refetch: refetchAddress } = useMemberAddress(memberId);

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ); // Show a loading state while fetching data
  }

  if (!memberProfile) {
    return <div className="text-center">This user does not have a profile yet.</div>;
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
            <ProfileOverviewPage profileData={memberProfile} refetch={refetchProfile} userType={""} userGroup={7} />
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="address" className="h-full mt-0">
        <Card className="h-full">
          <div className="p-6 h-full">
            {/* Pass the member address data to ProfileAddressPage */}
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

export default MemberProfileSettings;