import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LookupAgeGroup } from "@/components/lookup/LookupAgeGroup";
import { LookupBandwidth } from "@/components/lookup/LookupBandwidth";
import { LookupBankList } from "@/components/lookup/LookupBankList";
import { LookupBuildingLevel } from "@/components/lookup/LookupBuildingLevel";
import { LookupBuildingType } from "@/components/lookup/LookupBuildingType";
import { LookupCategoryArea } from "@/components/lookup/LookupCategoryArea";
import { LookupCity } from "@/components/lookup/LookupCity";
import { LookupClosureAffectArea } from "@/components/lookup/LookupClosureAffectArea";
import { LookupClosureCategory } from "@/components/lookup/LookupClosureCategory";
import { LookupClosureStatus } from "@/components/lookup/LookupClosureStatus";
import { LookupClosureSubcategory } from "@/components/lookup/LookupClosureSubcategory";
import { LookupDistrict } from "@/components/lookup/LookupDistrict";
import { LookupDUN } from "@/components/lookup/LookupDUN";
import { LookupEducation } from "@/components/lookup/LookupEducation";
import { LookupEthnics } from "@/components/lookup/LookupEthnics";
import { LookupGenders } from "@/components/lookup/LookupGenders";
import { LookupICTKnowledge } from "@/components/lookup/LookupICTKnowledge";
import { LookupIncomeLevel } from "@/components/lookup/LookupIncomeLevel";
import { LookupLeaveOffType } from "@/components/lookup/LookupLeaveOffType";
import { LookupLeaveStatus } from "@/components/lookup/LookupLeaveStatus";
import { LookupLeaveType } from "@/components/lookup/LookupLeaveType";
import { LookupMaintenanceType } from "@/components/lookup/LookupMaintenanceType";
import { LookupMaritalStatus } from "@/components/lookup/LookupMaritalStatus";
import { LookupMukim } from "@/components/lookup/LookupMukim";
import { LookupNationality } from "@/components/lookup/LookupNationality";
import { LookupOccupation } from "@/components/lookup/LookupOccupation";
import { LookupParliament } from "@/components/lookup/LookupParliament";
import { LookupRace } from "@/components/lookup/LookupRace";
import { LookupRegion } from "@/components/lookup/LookupRegion";
import { LookupRelationship } from "@/components/lookup/LookupRelationship";
import { LookupReligion } from "@/components/lookup/LookupReligion";
import { LookupSectorType } from "@/components/lookup/LookupSectorType";
import { LookupState } from "@/components/lookup/LookupState";
import { LookupTechnology } from "@/components/lookup/LookupTechnology";

const LookupSettingsPage = () => {
  return (
    <div>
      <div className="space-y-1  ">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Lookup Data Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage lookup data used throughout the system
          </p>
        </div>

        <Tabs defaultValue="age-group" className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 mb-8 w-full h-full flex-wrap">
            <TabsTrigger value="age-group">Age Group</TabsTrigger>
            <TabsTrigger value="bandwidth">Bandwidth</TabsTrigger>
            <TabsTrigger value="bank-list">Bank List</TabsTrigger>
            <TabsTrigger value="building-level">Building Level</TabsTrigger>
            <TabsTrigger value="building-type">Building Type</TabsTrigger>
            <TabsTrigger value="category-area">Category Area</TabsTrigger>
            <TabsTrigger value="city">City</TabsTrigger>
            <TabsTrigger value="closure-affect-area">
              Closure Affect Area
            </TabsTrigger>
            <TabsTrigger value="closure-category">Closure Category</TabsTrigger>
            <TabsTrigger value="closure-status">Closure Status</TabsTrigger>
            <TabsTrigger value="closure-subcategory">
              Closure Subcategory
            </TabsTrigger>
            <TabsTrigger value="district">District</TabsTrigger>
            <TabsTrigger value="dun">DUN</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="ethnics">Ethnics</TabsTrigger>
            <TabsTrigger value="genders">Genders</TabsTrigger>
            <TabsTrigger value="ict-knowledge">ICT Knowledge</TabsTrigger>
            <TabsTrigger value="income-level">Income Level</TabsTrigger>
            <TabsTrigger value="leave-off-type">Leave Off Type</TabsTrigger>
            <TabsTrigger value="leave-status">Leave Status</TabsTrigger>
            <TabsTrigger value="leave-type">Leave Type</TabsTrigger>
            <TabsTrigger value="maintenance-type">Maintenance Type</TabsTrigger>
            <TabsTrigger value="marital-status">Marital Status</TabsTrigger>
            <TabsTrigger value="mukim">Mukim</TabsTrigger>
            <TabsTrigger value="nationality">Nationality</TabsTrigger>
            <TabsTrigger value="occupation">Occupation</TabsTrigger>
            <TabsTrigger value="parliament">Parliament</TabsTrigger>
            <TabsTrigger value="race">Race</TabsTrigger>
            <TabsTrigger value="region">Region</TabsTrigger>
            <TabsTrigger value="relationship">Relationship</TabsTrigger>
            <TabsTrigger value="religion">Religion</TabsTrigger>
            <TabsTrigger value="sector-type">Sector Type</TabsTrigger>
            <TabsTrigger value="state">State</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
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

          <TabsContent value="closure-affect-area">
            <LookupClosureAffectArea />
          </TabsContent>

          <TabsContent value="closure-category">
            <LookupClosureCategory />
          </TabsContent>

          <TabsContent value="closure-status">
            <LookupClosureStatus />
          </TabsContent>

          <TabsContent value="closure-subcategory">
            <LookupClosureSubcategory />
          </TabsContent>

          <TabsContent value="district">
            <LookupDistrict />
          </TabsContent>

          <TabsContent value="dun">
            <LookupDUN />
          </TabsContent>

          <TabsContent value="education">
            <LookupEducation />
          </TabsContent>

          <TabsContent value="ethnics">
            <LookupEthnics />
          </TabsContent>

          <TabsContent value="genders">
            <LookupGenders />
          </TabsContent>

          <TabsContent value="ict-knowledge">
            <LookupICTKnowledge />
          </TabsContent>

          <TabsContent value="income-level">
            <LookupIncomeLevel />
          </TabsContent>

          <TabsContent value="leave-off-type">
            <LookupLeaveOffType />
          </TabsContent>

          <TabsContent value="leave-status">
            <LookupLeaveStatus />
          </TabsContent>

          <TabsContent value="leave-type">
            <LookupLeaveType />
          </TabsContent>

          <TabsContent value="maintenance-type">
            <LookupMaintenanceType />
          </TabsContent>

          <TabsContent value="marital-status">
            <LookupMaritalStatus />
          </TabsContent>

          <TabsContent value="mukim">
            <LookupMukim />
          </TabsContent>

          <TabsContent value="nationality">
            <LookupNationality />
          </TabsContent>

          <TabsContent value="occupation">
            <LookupOccupation />
          </TabsContent>

          <TabsContent value="parliament">
            <LookupParliament />
          </TabsContent>

          <TabsContent value="race">
            <LookupRace />
          </TabsContent>

          <TabsContent value="region">
            <LookupRegion />
          </TabsContent>

          <TabsContent value="relationship">
            <LookupRelationship />
          </TabsContent>

          <TabsContent value="religion">
            <LookupReligion />
          </TabsContent>

          <TabsContent value="sector-type">
            <LookupSectorType />
          </TabsContent>

          <TabsContent value="state">
            <LookupState />
          </TabsContent>

          <TabsContent value="technology">
            <LookupTechnology />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LookupSettingsPage;
