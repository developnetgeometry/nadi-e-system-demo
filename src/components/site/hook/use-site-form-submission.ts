import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/types/site";
import { SiteFormData } from "../form-tabs/schemas/schema.ts";
import { useSiteImage } from "./use-site-image";

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

interface UseSiteFormSubmissionProps {
  site?: Site | null;
  organizationId?: string | null;
  operationTimes: OperationTime[];
  selectedImageFiles: File[];
  imagesToDelete: string[];
  siteImages: SiteImage[];
  onSuccess: () => void;
}

export const useSiteFormSubmission = ({
  site,
  organizationId,
  operationTimes,
  selectedImageFiles,
  imagesToDelete,
  siteImages,
  onSuccess,
}: UseSiteFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [constraintWarnings, setConstraintWarnings] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { uploadSiteImages, deleteSiteImage } = useSiteImage();

  const validateSiteCode = async (code: string, currentSite?: Site | null) => {
    const { data: existingSite, error: codeCheckError } = await supabase
      .from("nd_site")
      .select("id, site_profile_id")
      .ilike("standard_code", code);

    if (codeCheckError) throw codeCheckError;

    if (
      existingSite &&
      existingSite.length > 0 &&
      (!currentSite || existingSite[0].site_profile_id !== currentSite.id)
    ) {
      throw new Error("Site code already exists");
    }
  };

  const validateCoordinates = (coordinates: string) => {
    if (coordinates) {
      const coords = coordinates.split(",").map((coord) => coord.trim());
      if (
        coords.length !== 2 ||
        !coords[0] ||
        !coords[1] ||
        isNaN(Number(coords[0])) ||
        isNaN(Number(coords[1]))
      ) {
        throw new Error('Invalid coordinate format. Please use "longitude, latitude" with valid numbers.');
      }
    }
  };

  const prepareSiteProfileData = (data: SiteFormData) => ({
    sitename: data.name || "",
    fullname: "NADI" + (data.name || ""),
    phase_id: data.phase === "" ? null : Number(data.phase),
    region_id: data.region === "" ? null : Number(data.region),
    parliament_rfid: data.parliament === "" ? null : Number(data.parliament),
    dun_rfid: data.dun === "" ? null : Number(data.dun),
    mukim_id: data.mukim === "" ? null : Number(data.mukim),
    email: data.email || "",
    website: data.website || "",
    website_last_updated: data.website_last_updated || null,
    longtitude: data.longitude || null,
    latitude: data.latitude || null,
    state_id: data.state === "" ? null : Number(data.state),
    active_status: data.status === "" ? null : Number(data.status),
    technology: data.technology === "" ? null : Number(data.technology),
    building_area_id: data.building_area ? parseFloat(data.building_area) : null,
    bandwidth: data.bandwidth === "" ? null : Number(data.bandwidth),
    building_type_id: data.building_type === "" ? null : Number(data.building_type),
    building_rental_id: data.building_rental === undefined ? null : data.building_rental,
    zone_id: data.zone === "" ? null : Number(data.zone),
    area_id: data.category_area === "" ? null : Number(data.category_area),
    level_id: data.building_level === "" ? null : Number(data.building_level),
    oku_friendly: data.oku ?? null,
    operate_date: data.operate_date || null,
    dusp_tp_id: data.dusp_tp_id === "" ? null : String(data.dusp_tp_id),
    ...(site ? {} : organizationId ? { dusp_tp_id: String(organizationId) } : {}),
  });

  const prepareSiteAddressData = (data: SiteFormData) => ({
    address1: data.address || "",
    address2: data.address2 || "",
    city: data.city || "",
    postcode: data.postCode || "",
    district_id: data.district === "" ? null : Number(data.district),
    state_id: data.state === "" ? null : Number(data.state),
    active_status: data.status === "" ? null : Number(data.status),
  });

  const upsertSocioEconomicData = async (siteId: number, socioEconomicIds: string[]) => {
    // Get current socio-economic data
    const { data: currentSocioEconomics, error: fetchError } = await supabase
      .from("nd_site_socioeconomic")
      .select("socioeconomic_id")
      .eq("site_id", siteId);

    if (fetchError) throw fetchError;

    const currentSocioIds = currentSocioEconomics?.map(socio => String(socio.socioeconomic_id)) || [];
    const newSocioIds = socioEconomicIds;

    // Find socio-economics to add (in new but not in current)
    const sociosToAdd = newSocioIds.filter(id => !currentSocioIds.includes(id));
    
    // Find socio-economics to remove (in current but not in new)
    const sociosToRemove = currentSocioIds.filter(id => !newSocioIds.includes(id));

    // Add new socio-economics
    if (sociosToAdd.length > 0) {
      const socioEconomicData = sociosToAdd.map((id) => ({
        site_id: siteId,
        socioeconomic_id: Number(id),
      }));

      const { error: insertSocioError } = await supabase
        .from("nd_site_socioeconomic")
        .insert(socioEconomicData);

      if (insertSocioError) throw insertSocioError;
    }

    // Remove socio-economics that are no longer selected
    if (sociosToRemove.length > 0) {
      for (const socioId of sociosToRemove) {
        try {
          const { error: deleteSocioError } = await supabase
            .from("nd_site_socioeconomic")
            .delete()
            .eq("site_id", siteId)
            .eq("socioeconomic_id", Number(socioId));

          if (deleteSocioError) {
            // If it's a foreign key constraint error, log it but don't fail the entire operation
            if (deleteSocioError.code === '23503') {
              console.warn(`Cannot remove socio-economic ${socioId} due to existing references in other tables. Keeping the socio-economic.`);
            } else {
              throw deleteSocioError;
            }
          }
        } catch (error) {
          console.error(`Error removing socio-economic ${socioId}:`, error);
          // Continue with other removals rather than failing the entire operation
        }
      }
    }
  };

  const upsertSpaceData = async (siteId: number, spaceIds: string[]) => {
    // Get current space data
    const { data: currentSpaces, error: fetchError } = await supabase
      .from("nd_site_space")
      .select("space_id")
      .eq("site_id", siteId);

    if (fetchError) throw fetchError;

    const currentSpaceIds = currentSpaces?.map(space => String(space.space_id)) || [];
    const newSpaceIds = spaceIds;

    // Find spaces to add (in new but not in current)
    const spacesToAdd = newSpaceIds.filter(id => !currentSpaceIds.includes(id));
    
    // Find spaces to remove (in current but not in new)
    const spacesToRemove = currentSpaceIds.filter(id => !newSpaceIds.includes(id));

    // Add new spaces
    if (spacesToAdd.length > 0) {
      const spaceData = spacesToAdd.map((id) => ({
        site_id: siteId,
        space_id: Number(id),
      }));

      const { error: insertSpaceError } = await supabase
        .from("nd_site_space")
        .insert(spaceData);

      if (insertSpaceError) throw insertSpaceError;
    }

    // Remove spaces that are no longer selected
    // Only try to remove if there are no foreign key dependencies
    if (spacesToRemove.length > 0) {
      for (const spaceId of spacesToRemove) {
        try {
          const { error: deleteSpaceError } = await supabase
            .from("nd_site_space")
            .delete()
            .eq("site_id", siteId)
            .eq("space_id", Number(spaceId));

          if (deleteSpaceError) {
            // If it's a foreign key constraint error, log it but don't fail the entire operation
            if (deleteSpaceError.code === '23503') {
              console.warn(`Cannot remove space ${spaceId} due to existing references in other tables. Keeping the space.`);
              // You might want to show a warning to the user here
            } else {
              throw deleteSpaceError;
            }
          }
        } catch (error) {
          console.error(`Error removing space ${spaceId}:`, error);
          // Continue with other removals rather than failing the entire operation
        }
      }
    }
  };

  const upsertOperationTimes = async (siteId: number, operations: OperationTime[]) => {
    // Delete existing operation times
    const { error: deleteOpError } = await supabase
      .from("nd_site_operation")
      .delete()
      .eq("site_id", siteId);

    if (deleteOpError) throw deleteOpError;

    // Insert new operation times if any
    if (operations.length > 0) {
      const operationRecords = operations.map((op) => ({
        days_of_week: op.day,
        open_time: op.isClosed ? null : op.openTime,
        close_time: op.isClosed ? null : op.closeTime,
        is_closed: op.isClosed,
        site_id: siteId,
      }));

      const { error: operationError } = await supabase
        .from("nd_site_operation")
        .insert(operationRecords);

      if (operationError) throw operationError;
    }
  };

  const handleImageDeletion = async () => {
    if (imagesToDelete.length > 0) {
      console.log("Processing images marked for deletion:", imagesToDelete);

      for (const path of imagesToDelete) {
        try {
          const imageRecord = siteImages.find(
            (img) =>
              img.file_url === path ||
              (img.file_urls && img.file_urls.includes(path))
          );

          if (imageRecord) {
            console.log("Deleting image:", path);
            await deleteSiteImage(imageRecord.id, path);
          }
        } catch (error) {
          console.error("Error deleting image:", error);
          // Don't throw error here, continue with the rest of the submission
        }
      }
    }
  };

  const handleImageUpload = async (siteId: number, standardCode: string) => {
    if (selectedImageFiles.length > 0) {
      const result = await uploadSiteImages(siteId, selectedImageFiles, standardCode);
      if (!result.success) {
        console.error("Error uploading site images:", result.error);
        // Don't throw error here, continue with the rest of the submission
      }
    }
  };

  const updateExistingSite = async (data: SiteFormData) => {
    if (!site) throw new Error("Site not provided for update");

    const siteProfile = prepareSiteProfileData(data);
    const siteAddress = prepareSiteAddressData(data);
    const standardCode = data.code;

    // Update site profile
    const { error: profError } = await supabase
      .from("nd_site_profile")
      .update(siteProfile)
      .eq("id", site.id);

    if (profError) throw profError;

    // Update site address
    const { error: addressError } = await supabase
      .from("nd_site_address")
      .update(siteAddress)
      .eq("site_id", site.id);

    if (addressError) throw addressError;

    // Update site code
    const { error: codeError } = await supabase
      .from("nd_site")
      .update({ standard_code: standardCode })
      .eq("site_profile_id", site.id);

    if (codeError) throw codeError;

    // Update related data
    await upsertSocioEconomicData(site.id, data.socio_economic);
    await upsertSpaceData(site.id, data.space);
    await upsertOperationTimes(site.id, operationTimes);

    // Handle images
    await handleImageDeletion();
    await handleImageUpload(site.id, standardCode);

    return site.id;
  };

  const createNewSite = async (data: SiteFormData) => {
    const siteProfile = prepareSiteProfileData(data);
    const siteAddress = prepareSiteAddressData(data);
    const standardCode = data.code;

    // Create site profile
    const { data: profData, error: profError } = await supabase
      .from("nd_site_profile")
      .insert([siteProfile])
      .select("id");

    if (profError) throw profError;
    if (!profData) throw new Error("Profile data is null");

    const siteId = profData[0].id;

    // Create site address
    const { error: addressError } = await supabase
      .from("nd_site_address")
      .insert([{ ...siteAddress, site_id: siteId }]);

    if (addressError) throw addressError;

    // Create site code record
    const { error: codeError } = await supabase
      .from("nd_site")
      .insert([{ standard_code: standardCode, site_profile_id: siteId }])
      .select("id");

    if (codeError) throw codeError;

    // Create related data
    await upsertSocioEconomicData(siteId, data.socio_economic);
    await upsertSpaceData(siteId, data.space);
    await upsertOperationTimes(siteId, operationTimes);

    // Handle image uploads
    await handleImageUpload(siteId, standardCode);

    return siteId;
  };

  const submitForm = async (data: SiteFormData) => {
    setIsSubmitting(true);

    try {
      // Validate site code
      await validateSiteCode(data.code, site);

      // Validate coordinates
      validateCoordinates(data.coordinates);

      let siteId: number;
      let siteName: string;

      if (site) {
        // Update existing site
        siteId = await updateExistingSite(data);
        siteName = site.sitename;

        toast({
          title: "Site updated successfully",
          description: `The ${siteName} site has been updated in the system.`,
        });
      } else {
        // Create new site
        siteId = await createNewSite(data);
        siteName = data.name;

        toast({
          title: "Site added successfully",
          description: `The ${siteName} site has been added to the system.`,
        });
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["site-stats"] });
      queryClient.invalidateQueries({ queryKey: ["sites"] });

      onSuccess();
    } catch (error) {
      console.error("Error adding/updating site:", error);
      
      // Handle specific error types
      if (error.message === "Site code already exists") {
        throw new Error("Site code already exists");
      } else if (error.message.includes("Invalid coordinate format")) {
        throw new Error(error.message);
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        toast({
          title: "Warning",
          description: "Site updated successfully, but some selections could not be removed due to existing dependencies (e.g., maintenance requests). Please contact support if needed.",
          variant: "default",
        });
        onSuccess(); // Still consider it a success since the main data was updated
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to add/update the site. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
  };
};
