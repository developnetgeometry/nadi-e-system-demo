
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LookupAgeGroup } from "@/components/lookup/LookupAgeGroup";
import { LookupBandwidth } from "@/components/lookup/LookupBandwidth";
import { LookupBankList } from "@/components/lookup/LookupBankList";
import { LookupBuildingLevel } from "@/components/lookup/LookupBuildingLevel";
import { LookupBuildingType } from "@/components/lookup/LookupBuildingType";
import { LookupCategoryArea } from "@/components/lookup/LookupCategoryArea";
import { LookupCity } from "@/components/lookup/LookupCity";

const LookupSettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Lookup Data Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage lookup data used throughout the system
          </p>
        </div>

        <Tabs defaultValue="age-group" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 w-full">
            <TabsTrigger value="age-group">Age Group</TabsTrigger>
            <TabsTrigger value="bandwidth">Bandwidth</TabsTrigger>
            <TabsTrigger value="bank-list">Bank List</TabsTrigger>
            <TabsTrigger value="building-level">Building Level</TabsTrigger>
            <TabsTrigger value="building-type">Building Type</TabsTrigger>
            <TabsTrigger value="category-area">Category Area</TabsTrigger>
            <TabsTrigger value="city">City</TabsTrigger>
          </TabsList>
          
          <TabsContent value="age-group">
            <LookupAgeGroup />
          </TabsContent>
          
          <TabsContent value="bandwidth">
            <LookupBandwidth />
          </TabsContent>
          
          <TabsContent value="bank-list">
            <LookupBankList />
          </TabsContent>
          
          <TabsContent value="building-level">
            <LookupBuildingLevel />
          </TabsContent>
          
          <TabsContent value="building-type">
            <LookupBuildingType />
          </TabsContent>
          
          <TabsContent value="category-area">
            <LookupCategoryArea />
          </TabsContent>
          
          <TabsContent value="city">
            <LookupCity />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LookupSettingsPage;
