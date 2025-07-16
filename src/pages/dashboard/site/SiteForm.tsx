import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { 
  fetchSiteBySiteId, 
  fetchSiteOperationHours, 
  fetchSiteImages,
  type OperationTime,
  type SiteImage
} from "@/components/site/hook/site-utils";
import { ConfirmationDialog } from "@/components/site/form-tabs/components/ConfirmationDialog";

const SiteFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [activeTab, setActiveTab] = useState("basic-info");
  const [originalSiteData, setOriginalSiteData] = useState<SiteFormData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    type: 'create' | 'update' | 'reset' | 'resetChanges' | 'navigate';
    data?: SiteFormData;
    navigationCallback?: () => void;
  }>({
    open: false,
    type: 'create'
  });

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
      status: "2", // Default to "In Progress" status (ID: 2)
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
      selectedImageFiles: [],
      imagesToDelete: [],
      siteImages: [],
      hasLoadedOperationData: false,
    },
  });

  // Use the form submission hook
  const { submitForm, isSubmitting } = useSiteFormSubmission({
    site,
    organizationId,
    operationTimes: (form.watch("operationTimes") || []) as OperationTime[],
    selectedImageFiles: form.watch("selectedImageFiles") || [],
    imagesToDelete: form.watch("imagesToDelete") || [],
    siteImages: form.watch("siteImages") || [],
    onSuccess: () => {
      toast({
        title: "Success",
        description: isEditing ? "Site updated successfully" : "Site created successfully",
      });
      navigate("/site-management");
    },
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmit = async (data: SiteFormData) => {
    // Show confirmation dialog before submitting
    setConfirmationDialog({
      open: true,
      type: isEditing ? 'update' : 'create',
      data
    });
  };

  const handleConfirmSubmit = async () => {
    const data = confirmationDialog.data;
    if (!data) return;

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
    if (hasChanges) {
      // Show confirmation dialog before navigating away
      setConfirmationDialog({
        open: true,
        type: 'navigate',
        navigationCallback: () => navigate("/site-management")
      });
    } else {
      navigate("/site-management");
    }
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (hasChanges) {
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.href);
        
        setConfirmationDialog({
          open: true,
          type: 'navigate',
          navigationCallback: () => {
            // Temporarily disable the changes check and navigate
            setHasChanges(false);
            setTimeout(() => {
              window.history.back();
            }, 100);
          }
        });
      }
    };

    // Add initial history entry to enable back button interception
    window.history.pushState(null, '', window.location.href);
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasChanges]);

  // Handle browser beforeunload (refresh, close tab, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Function to check if form has changes
  const checkForChanges = () => {
    const currentValues = form.getValues();
    
    if (isEditing) {
      // For editing: compare with original data
      if (!originalSiteData) {
        setHasChanges(false);
        return;
      }

      // Compare each field
      const fieldsChanged = Object.keys(originalSiteData).some((key) => {
        const originalValue = originalSiteData[key as keyof SiteFormData];
        const currentValue = currentValues[key as keyof SiteFormData];
        
        // Handle arrays (socio_economic, space, operationTimes)
        if (Array.isArray(originalValue) && Array.isArray(currentValue)) {
          return JSON.stringify(originalValue.sort()) !== JSON.stringify(currentValue.sort());
        }
        
        // Handle regular values
        return originalValue !== currentValue;
      });

      // Also check for changes in operation times, images, etc.
      const hasOperationChanges = (form.watch("operationTimes") || []).length !== (originalSiteData.operationTimes || []).length;
      const hasImageChanges = (form.watch("selectedImageFiles") || []).length > 0 || 
                             (form.watch("imagesToDelete") || []).length > 0;
      
      setHasChanges(fieldsChanged || hasOperationChanges || hasImageChanges);
    } else {
      // For creation: check if any fields have been filled with meaningful data
      const hasFormData = Object.keys(currentValues).some((key) => {
        const currentValue = currentValues[key as keyof SiteFormData];
        
        // Skip these fields as they don't indicate user input
        if (key === 'hasLoadedOperationData' || key === 'selectedImageFiles' || 
            key === 'imagesToDelete' || key === 'siteImages' || key === 'status') {
          return false;
        }
        
        // Handle arrays (socio_economic, space, operationTimes)
        if (Array.isArray(currentValue)) {
          return currentValue.length > 0;
        }
        
        // Handle strings - check if not empty
        if (typeof currentValue === 'string') {
          return currentValue.trim() !== '';
        }
        
        // Handle booleans - for these specific fields, any true value indicates user input
        if (typeof currentValue === 'boolean') {
          if (key === 'is_mini' || key === 'building_rental' || key === 'oku') {
            return currentValue === true;
          }
        }
        
        return false;
      });

      // Also check for operation times and images
      const hasOperationData = (form.watch("operationTimes") || []).length > 0;
      const hasImageData = (form.watch("selectedImageFiles") || []).length > 0;
      
      const hasAnyChanges = hasFormData || hasOperationData || hasImageData;
      setHasChanges(hasAnyChanges);
    }
  };

  const handleResetChanges = () => {
    // Show confirmation dialog before resetting changes
    setConfirmationDialog({
      open: true,
      type: 'resetChanges'
    });
  };

  const handleConfirmResetChanges = () => {
    if (site) {
      // Reset form to original site data
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
        status: site.active_status ? String(site.active_status) : "2", // Reset to original or default
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
        selectedImageFiles: [],
        imagesToDelete: [],
        siteImages: originalSiteData?.siteImages || [], // Reset to original loaded images
        operationTimes: originalSiteData?.operationTimes || [], // Reset to original operation times
        hasLoadedOperationData: false,
      };
      
      form.reset(siteData);
      
      // Reset form state for operation times and images to original data
      form.setValue("operationTimes", originalSiteData?.operationTimes || []);
      form.setValue("selectedImageFiles", []);
      form.setValue("imagesToDelete", []);
      form.setValue("siteImages", originalSiteData?.siteImages || []);
      form.setValue("hasLoadedOperationData", false);
      setHasChanges(false);
      
      toast({
        title: "Changes Reset",
        description: "All changes have been reverted to the original values.",
      });
    }
  };

  const handleReset = () => {
    // Show confirmation dialog before resetting form
    setConfirmationDialog({
      open: true,
      type: 'reset'
    });
  };

  const handleConfirmReset = () => {
    // Reset to default values defined in form initialization
    form.reset();
    // Reset form state for operation times and images
    form.setValue("operationTimes", []);
    form.setValue("selectedImageFiles", []);
    form.setValue("imagesToDelete", []);
    form.setValue("siteImages", []);
    form.setValue("hasLoadedOperationData", false);
    
    toast({
      title: "Form Reset",
      description: "All form fields have been reset to default values.",
    });
  };

  // Effects
  useEffect(() => {
    if (site) {
      const loadSiteData = async () => {
        // Load basic site data
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
          status: site.active_status ? String(site.active_status) : "2", // Default to "In Progress" if no status
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
          selectedImageFiles: [],
          imagesToDelete: [],
          siteImages: [],
          hasLoadedOperationData: true, // Mark as loaded since we're loading it here
        };

        // Load operation hours data
        const operationTimes = await fetchSiteOperationHours(siteId);
        siteData.operationTimes = operationTimes;

        // Load site images data
        const siteImages = await fetchSiteImages(site.id);
        siteData.siteImages = siteImages;

        form.reset(siteData);
        setOriginalSiteData(siteData);
        setHasChanges(false);
      };

      loadSiteData();
    }
  }, [site, form, siteId]);

  // Monitor form changes for both creation and editing
  useEffect(() => {
    const subscription = form.watch(() => {
      checkForChanges();
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Initial check for changes
  useEffect(() => {
    checkForChanges();
  }, [isEditing, originalSiteData]);

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
          {isEditing && hasChanges && (
            <Button
              type="button"
              variant="outline"
              onClick={handleResetChanges}
              disabled={isSubmitting}
            >
              Reset Changes
            </Button>
          )}
          {!isEditing && hasChanges && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
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
                  <TabsTrigger 
                    value="operation" 
                    className={cn(
                      "text-xs",
                      hasTabErrors("operation", form.formState.errors) ? "text-red-500 font-medium" : ""
                    )}
                  >
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
                      form={form}
                      site={site}
                    />
                  </TabsContent>

                  <TabsContent value="operation">
                    <SiteOperationHours
                      form={form}
                      siteId={siteId}
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onOpenChange={(open) => setConfirmationDialog(prev => ({ ...prev, open }))}
        title={getConfirmationTitle()}
        description={getConfirmationDescription()}
        confirmText={getConfirmationText()}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmationDialog(prev => ({ ...prev, open: false }))}
        isDestructive={confirmationDialog.type === 'reset' || confirmationDialog.type === 'resetChanges' || confirmationDialog.type === 'navigate'}
        isLoading={isSubmitting}
        icon={getConfirmationIcon()}
      />
    </div>
  );

  function getConfirmationTitle() {
    switch (confirmationDialog.type) {
      case 'create':
        return 'Create New Site';
      case 'update':
        return 'Update Site';
      case 'reset':
        return 'Reset Form';
      case 'resetChanges':
        return 'Reset Changes';
      case 'navigate':
        return 'Unsaved Changes';
      default:
        return 'Confirm Action';
    }
  }

  function getConfirmationDescription() {
    switch (confirmationDialog.type) {
      case 'create':
        return 'Are you sure you want to create this new site? This will add the site to the system.';
      case 'update':
        return 'Are you sure you want to update this site? This will save all your changes.';
      case 'reset':
        return 'Are you sure you want to reset the form? All entered data will be lost and cannot be recovered.';
      case 'resetChanges':
        return 'Are you sure you want to reset all changes? This will revert all fields back to their original values.';
      case 'navigate':
        return 'You have unsaved changes that will be lost if you leave this page. Are you sure you want to continue?';
      default:
        return 'Are you sure you want to proceed?';
    }
  }

  function getConfirmationText() {
    switch (confirmationDialog.type) {
      case 'create':
        return 'Create Site';
      case 'update':
        return 'Update Site';
      case 'reset':
        return 'Reset Form';
      case 'resetChanges':
        return 'Reset Changes';
      case 'navigate':
        return 'Leave Page';
      default:
        return 'Confirm';
    }
  }

  function getConfirmationIcon() {
    switch (confirmationDialog.type) {
      case 'create':
        return 'create';
      case 'update':
        return 'save';
      case 'reset':
      case 'resetChanges':
        return 'reset';
      case 'navigate':
        return 'warning';
      default:
        return 'warning';
    }
  }

  function handleConfirmAction() {
    switch (confirmationDialog.type) {
      case 'create':
      case 'update':
        handleConfirmSubmit();
        break;
      case 'reset':
        handleConfirmReset();
        break;
      case 'resetChanges':
        handleConfirmResetChanges();
        break;
      case 'navigate':
        handleConfirmNavigation();
        break;
    }
  }

  function handleConfirmNavigation() {
    if (confirmationDialog.navigationCallback) {
      confirmationDialog.navigationCallback();
    }
  }
};

export default SiteFormPage;
