
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { getStaffDetails, updateStaffMember } from "@/lib/staff";
import useGeneralData from "@/hooks/use-general-data";
import useGeoData from "@/hooks/use-geo-data";
import useBankData from "@/hooks/use-bank-data";
import { Skeleton } from "@/components/ui/skeleton";
import PersonalInformation from "@/components/profile/staff/components/PersonalInformation";
import AddressInformation from "@/components/profile/staff/components/AddressInformation";
import WorkInformation from "@/components/profile/staff/components/WorkInformation";
import StaffContactInformation from "@/components/profile/staff/components/StaffContactInformation";
import StaffContractInformation from "@/components/profile/staff/components/StaffContractInformation";
import StaffProfilePicture from "@/components/profile/staff/components/StaffProfilePicture";
import { supabase } from "@/lib/supabase";

const StaffDetails = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [staffData, setStaffData] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [contactData, setContactData] = useState<any>(null);
  const [contractData, setContractData] = useState<any>(null);
  const [payInfoData, setPayInfoData] = useState<any>(null);
  const [jobData, setJobData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [siteOptions, setSiteOptions] = useState<{id: string, sitename: string}[]>([]);
  const [contractTypes, setContractTypes] = useState<{id: string, name: string}[]>([]);
  
  const { genders, maritalStatuses, races, religions, nationalities } = useGeneralData();
  const { districts, states } = useGeoData();
  const { banks } = useBankData();
  
  // Fetch relationship types
  const [relationshipTypes, setRelationshipTypes] = useState<{id: string, eng: string}[]>([]);
  
  useEffect(() => {
    const fetchRelationshipTypes = async () => {
      const { data, error } = await supabase
        .from('nd_type_relationship')
        .select('id, eng');
      
      if (error) {
        console.error("Error fetching relationship types:", error);
        return;
      }
      
      setRelationshipTypes(data || []);
    };
    
    fetchRelationshipTypes();
  }, []);
  
  // Fetch sites
  useEffect(() => {
    const fetchSites = async () => {
      const { data, error } = await supabase
        .from('nd_site_profile')
        .select('id, sitename');
      
      if (error) {
        console.error("Error fetching sites:", error);
        return;
      }
      
      setSiteOptions(data || []);
    };
    
    fetchSites();
  }, []);
  
  // Fetch contract types
  useEffect(() => {
    const fetchContractTypes = async () => {
      const { data, error } = await supabase
        .from('nd_contract_type')
        .select('id, name');
      
      if (error) {
        console.error("Error fetching contract types:", error);
        return;
      }
      
      setContractTypes(data || []);
    };
    
    fetchContractTypes();
  }, []);

  // Fetch staff details
  useEffect(() => {
    if (!staffId) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const staffDetails = await getStaffDetails(staffId);
        
        setStaffData(staffDetails.profile);
        setAddressData(staffDetails.address || { staff_id: staffId });
        setContactData(staffDetails.contact || { staff_id: staffId });
        setContractData(staffDetails.contract || { staff_id: staffId });
        setPayInfoData(staffDetails.payInfo || { staff_id: staffId });
        setJobData(staffDetails.job);
        
        // Store original data for comparison when saving
        setOriginalData(staffDetails);
        
      } catch (error) {
        console.error("Error fetching staff details:", error);
        toast({
          title: "Error",
          description: "Failed to load staff details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [staffId, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, dataType: string) => {
    const { id, value } = e.target;
    
    switch (dataType) {
      case 'profile':
        setStaffData((prev: any) => ({ ...prev, [id]: value }));
        break;
      case 'address':
        setAddressData((prev: any) => ({ ...prev, [id]: value }));
        break;
      case 'contact':
        setContactData((prev: any) => ({ ...prev, [id]: value }));
        break;
      case 'contract':
        setContractData((prev: any) => ({ ...prev, [id]: value }));
        break;
      case 'payInfo':
        setPayInfoData((prev: any) => ({ ...prev, [id]: value }));
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    if (!staffId) return;
    
    try {
      setIsSaving(true);
      
      const updatedData = {
        profile: staffData,
        address: addressData,
        contact: contactData,
        contract: contractData,
        payInfo: payInfoData
      };
      
      const result = await updateStaffMember(staffId, updatedData);
      
      toast({
        title: "Success",
        description: "Staff details updated successfully",
      });
      
      // Refresh data
      const staffDetails = await getStaffDetails(staffId);
      setStaffData(staffDetails.profile);
      setAddressData(staffDetails.address || { staff_id: staffId });
      setContactData(staffDetails.contact || { staff_id: staffId });
      setContractData(staffDetails.contract || { staff_id: staffId });
      setPayInfoData(staffDetails.payInfo || { staff_id: staffId });
      setJobData(staffDetails.job);
      setOriginalData(staffDetails);
      
    } catch (error: any) {
      console.error("Error saving staff details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update staff details",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-6xl p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Staff Details</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? "Saving..." : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <StaffProfilePicture />
            
            <Tabs defaultValue="personal" className="mt-6">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="work">Work Info</TabsTrigger>
                <TabsTrigger value="contact">Emergency Contact</TabsTrigger>
                <TabsTrigger value="contract">Contract</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <PersonalInformation
                  staffData={staffData}
                  genders={genders}
                  maritalStatuses={maritalStatuses}
                  races={races}
                  religions={religions}
                  nationalities={nationalities}
                  handleChange={(e) => handleChange(e, 'profile')}
                />
              </TabsContent>
              
              <TabsContent value="address">
                <AddressInformation
                  addressData={addressData}
                  districts={districts}
                  states={states}
                  handleChange={(e) => handleChange(e, 'address')}
                />
              </TabsContent>
              
              <TabsContent value="work">
                <WorkInformation
                  payInfoData={payInfoData}
                  banks={banks}
                  handleChange={(e) => handleChange(e, 'payInfo')}
                />
              </TabsContent>
              
              <TabsContent value="contact">
                <StaffContactInformation
                  contactData={contactData}
                  relationshipTypes={relationshipTypes}
                  handleChange={(e) => handleChange(e, 'contact')}
                />
              </TabsContent>
              
              <TabsContent value="contract">
                <StaffContractInformation
                  contractData={contractData}
                  siteOptions={siteOptions}
                  contractTypes={contractTypes}
                  handleChange={(e) => handleChange(e, 'contract')}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffDetails;
