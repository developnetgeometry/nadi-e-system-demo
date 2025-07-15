import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { Site } from "@/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSiteFormSubmission } from "@/components/site/hook/use-site-form-submission";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { 
  BasicInfoTab,
  LocationTab,
  BuildingTab,
  ConnectivityTab,
  FacilitiesTab,
  OperationalStatusTab,
  SiteImagesTab,
  createSiteFormSchema, 
  type SiteFormData,
  hasTabErrors,
  getFirstTabWithError
} from "@/components/site/form-tabs";
import { SiteOperationHours } from "@/components/site/form-tabs/SiteOperationHours";
import { fetchSiteBySiteId } from "@/components/site/hook/site-utils";

interface OperationTime {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  id?: number;
}

interface SiteImage {
  id: number;
  site_profile_id: string | number;
  file_url: string;
  file_urls?: string[];
}

const SiteFormPage = () => {
  const navigate = useNavigate();
  const { siteId } = useParams<{ siteId?: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Retrieve user metadata
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    parsedMetadata?.user_group_name === "TP" &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;

  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isEditing = Boolean(siteId);

  // State management
  const [operationTimes, setOperationTimes] = useState<OperationTime[]>([]);
  const [activeTab, setActiveTab] = useState("basic-info");
  const [savedOperationTimes, setSavedOperationTimes] = useState<OperationTime[]>([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);

  // Fetch site data if editing
  const { data: site, isLoading } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => fetchSiteBySiteId(siteId!),
    enabled: isEditing,
  });

  // Form setup
  const form = useForm<SiteFormData>({
    resolver: zodResolver(createSiteFormSchema(isSuperAdmin)),
    defaultValues: {
      code: "",
      name: "",
      phase: "",
      region: "",
      parliament: "",
      dun: "",
      mukim: "",
      email: "",
      website: "",
      website_last_updated: "",
      is_mini: false,
      longitude: "",
      latitude: "",
      status: "",
      address: "",
      address2: "",
      district: "",
      city: "",
      postCode: "",
      state: "",
      technology: "",
      bandwidth: "",
      building_type: "",
      building_area: "",
      building_rental: false,
      zone: "",
      category_area: "",
      building_level: "",
      oku: false,
      coordinates: "",
      operate_date: "",
      socio_economic: [],
      space: [],
      dusp_tp_id: "",
    },
  });

  // Use the form submission hook
  const { submitForm, isSubmitting } = useSiteFormSubmission({
    site,
    organizationId,
    operationTimes,
    selectedImageFiles,
    imagesToDelete,
    siteImages,
    onSuccess: () => {
      toast({
        title: "Success",
        description: isEditing ? "Site updated successfully" : "Site created successfully",
      });
      navigate("/site-management");
    },
  });

  // Handlers
  const handleImagesChange = (selectedFiles: File[], imagesToDelete: string[], siteImages: SiteImage[]) => {
    setSelectedImageFiles(selectedFiles);
    setImagesToDelete(imagesToDelete);
    setSiteImages(siteImages);
  };

  const handleOperationTimesChange = (times: OperationTime[]) => {
    setOperationTimes(times);
    setSavedOperationTimes(times);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "operation") {
      setOperationTimes(savedOperationTimes);
    } else if (activeTab === "operation") {
      setSavedOperationTimes(operationTimes);
    }
  };

  const handleSubmit = async (data: SiteFormData) => {
    try {
      await submitForm(data);
    } catch (error: any) {
      if (error.message === "Site code already exists") {
        form.setError("code", {
          type: "manual",
          message: "Site code already exists"
        });
        setActiveTab("basic-info");
      } else if (error.message.includes("Invalid coordinate format")) {
        form.setError("coordinates", {
          type: "manual",
          message: error.message
        });
        setActiveTab("location");
      }
    }
  };

  const handleCancel = () => {
    navigate("/site-management");
  };

  // Effects
  useEffect(() => {
    if (site) {
      const siteData: SiteFormData = {
        code: site.nd_site[0]?.standard_code || "",
        name: site.sitename || "",
        phase: site.phase_id ? String(site.phase_id) : "",
        region: site.region_id ? String(site.region_id) : "",
        parliament: site.nd_parliament?.id ? String(site.nd_parliament.id) : "",
        dun: site.nd_dun?.id ? String(site.nd_dun.id) : "",
        mukim: site.nd_mukim?.id ? String(site.nd_mukim.id) : "",
        email: site.email || "",
        website: site.website || "",
        website_last_updated: site.website_last_updated ? site.website_last_updated.split("T")[0] : "",
        is_mini: site.is_mini ?? false,
        longitude: site.longtitude || "",
        latitude: site.latitude || "",
        status: site.active_status ? String(site.active_status) : "",
        address: site.nd_site_address[0]?.address1 || "",
        address2: site.nd_site_address[0]?.address2 || "",
        city: site.nd_site_address[0]?.city || "",
        postCode: site.nd_site_address[0]?.postcode || "",
        district: site.nd_site_address[0]?.district_id ? String(site.nd_site_address[0].district_id) : "",
        state: site.nd_site_address[0]?.state_id ? String(site.nd_site_address[0]?.state_id) : "",
        technology: site.technology ? String(site.technology) : "",
        bandwidth: site.bandwidth ? String(site.bandwidth) : "",
        building_type: site.building_type_id ? String(site.building_type_id) : "",
        building_area: site.building_area_id ? String(site.building_area_id) : "",
        building_rental: site.building_rental_id ?? false,
        zone: site.zone_id ? String(site.zone_id) : "",
        category_area: site.area_id ? String(site.area_id) : "",
        building_level: site.level_id ? String(site.level_id) : "",
        oku: site.oku_friendly ?? false,
        coordinates: site.longtitude && site.latitude ? `${site.longtitude},${site.latitude}` : "",
        operate_date: site.operate_date ? site.operate_date.split("T")[0] : "",
        socio_economic: site.nd_site_socioeconomic?.map((s: any) => String(s.nd_socioeconomics.id)) || [],
        space: site.nd_site_space?.map((s: any) => String(s.nd_space.id)) || [],
        dusp_tp_id: site.dusp_tp_id ? String(site.dusp_tp_id) : "",
      };
      form.reset(siteData);
    }
  }, [site, form]);

  // Auto-jump to first tab with validation errors
  useEffect(() => {
    const errors = form.formState.errors;
    const hasErrors = Object.keys(errors).length > 0;
    
    if (hasErrors && form.formState.isSubmitted) {
      const firstErrorTab = getFirstTabWithError(errors);
      setActiveTab(firstErrorTab);
    }
  }, [form.formState.errors, form.formState.isSubmitted]);

  // Access control
  if (parsedMetadata?.user_type !== "super_admin" && !organizationId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You do not have access to create or edit sites.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {/* <span>Back to Sites</span> */}
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Site" : "Create New Site"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update site information and settings" : "Add a new site to the system"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setActiveTab("basic-info");
                setOperationTimes([]);
                setSavedOperationTimes([]);
                setSelectedImageFiles([]);
                setImagesToDelete([]);
                setSiteImages([]);
              }}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          )}
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? "Saving..." : isEditing ? "Update Site" : "Create Site"}</span>
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger
                    value="basic-info"
                    className={cn(
                      "text-xs",
                      hasTabErrors("basic-info", form.formState.errors) ? "text-red-500 font-medium" : ""
                    )}
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="location"
                    className={cn(
                      "text-xs",
                      hasTabErrors("location", form.formState.errors) ? "text-red-500 font-medium" : ""
                    )}
                  >
                    Location
                  </TabsTrigger>
                  <TabsTrigger
                    value="building"
                    className={cn(
                      "text-xs",
                      hasTabErrors("building", form.formState.errors) ? "text-red-500 font-medium" : ""
                    )}
                  >
                    Building
                  </TabsTrigger>
                  <TabsTrigger
                    value="connectivity"
                    className={cn(
                      "text-xs",
                      hasTabErrors("connectivity", form.formState.errors) ? "text-red-500 font-medium" : ""
                    )}
                  >
                    Connectivity
                  </TabsTrigger>
                  <TabsTrigger 
                    value="facilities"
                    className={cn(
                      "text-xs",
                      hasTabErrors("facilities", form.formState.errors) ? "text-red-500 font-medium" : ""
                    )}
                  >
                    Facilities
                  </TabsTrigger>
                  <TabsTrigger value="images" className="text-xs">
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="operation" className="text-xs">
                    Operation Hours
                  </TabsTrigger>
                  <TabsTrigger
                    value="operational-status"
                    className={cn(
                      "text-xs",
                      hasTabErrors("operational-status", form.formState.errors) ? "text-red-500 font-medium" : ""
                    )}
                  >
                    Site Status
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="basic-info" className="space-y-4">
                    <BasicInfoTab form={form} isSuperAdmin={isSuperAdmin} />
                  </TabsContent>

                  <TabsContent value="location" className="space-y-4">
                    <LocationTab form={form} />
                  </TabsContent>

                  <TabsContent value="building" className="space-y-4">
                    <BuildingTab form={form} />
                  </TabsContent>

                  <TabsContent value="connectivity" className="space-y-4">
                    <ConnectivityTab form={form} />
                  </TabsContent>

                  <TabsContent value="facilities" className="space-y-4">
                    <FacilitiesTab form={form} />
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4">
                    <SiteImagesTab
                      site={site}
                      open={true}
                      onImagesChange={handleImagesChange}
                    />
                  </TabsContent>

                  <TabsContent value="operation">
                    <SiteOperationHours
                      siteId={siteId}
                      onOperationTimesChange={handleOperationTimesChange}
                      initialTimes={savedOperationTimes}
                    />
                  </TabsContent>

                  <TabsContent value="operational-status" className="space-y-4">
                    <OperationalStatusTab form={form} />
                  </TabsContent>
                </div>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteFormPage;
