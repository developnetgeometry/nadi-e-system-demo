import { FileUpload } from "@/components/ui/file-upload";
import { SUPABASE_URL } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { Site } from "@/types/site";
import { UseFormReturn } from "react-hook-form";
import { SiteFormData } from "./schemas/schema";

interface SiteImage {
  id: number;
  site_profile_id: string | number;
  file_url: string;
  file_urls?: string[];
}

interface SiteImagesTabProps {
  form: UseFormReturn<SiteFormData>;
  site?: Site | null;
}

export const SiteImagesTab = ({ form, site }: SiteImagesTabProps) => {
  // Get current form values
  const selectedImageFiles = form.watch("selectedImageFiles") || [];
  const imagesToDelete = form.watch("imagesToDelete") || [];
  const siteImages = form.watch("siteImages") || [];

  // Note: Site images data loading is now handled in the main SiteForm component
  // when the form loads, so we don't need to load it here anymore.

  // Format existing images for FileUpload component
  const formattedExistingImages = useMemo(() => {
    if (!siteImages || siteImages.length === 0) {
      return null;
    }

    const allImages = siteImages.flatMap((image: SiteImage) => {
      const urls = image.file_urls || (image.file_url ? [image.file_url] : []);
      return urls
        .filter((url) => !imagesToDelete.includes(url)) // Filter out images marked for deletion
        .map((url, index) => {
          const fullUrl = url.startsWith("http") ? url : `${SUPABASE_URL}${url}`;
          
          // Extract the original filename from the path
          // Path format: /storage/v1/object/public/site-attachment/site-image/SITECODE_timestamp_originalfilename.ext
          const pathParts = url.split('/');
          const fileName = pathParts[pathParts.length - 1]; // Get the last part (filename)
          
          // Extract original filename by removing the site code and timestamp prefix
          // Format: SITECODE_timestamp_random_originalfilename.ext
          let displayName = fileName;
          const underscoreIndex = fileName.indexOf('_');
          if (underscoreIndex !== -1) {
            const secondUnderscoreIndex = fileName.indexOf('_', underscoreIndex + 1);
            if (secondUnderscoreIndex !== -1) {
              const thirdUnderscoreIndex = fileName.indexOf('_', secondUnderscoreIndex + 1);
              if (thirdUnderscoreIndex !== -1) {
                // Extract everything after the third underscore (original filename)
                displayName = fileName.substring(thirdUnderscoreIndex + 1);
              }
            }
          }
          
          return {
            url: fullUrl,
            name: displayName,
          };
        });
    });

    return allImages.length > 0 ? allImages : null;
  }, [siteImages, imagesToDelete]);

  // Handle new image selection
  const handleNewImagesSelected = (files: File[]) => {
    // Since the FileUpload component is now controlled, just set the files directly
    form.setValue("selectedImageFiles", files);
  };

  // Handle existing image removal
  const handleExistingImagesChange = (
    updatedImages: Array<{ url: string; name: string }>,
    supabaseUrl: string
  ) => {
    // Extract storage paths from the updated images
    const updatedPaths = updatedImages.map((img) => {
      if (img.url.startsWith(supabaseUrl)) {
        // Remove the supabase URL to get the storage path
        return img.url.substring(supabaseUrl.length);
      }
      return img.url;
    });

    // Get current existing image paths from siteImages
    // These are stored as paths like: /storage/v1/object/public/site-attachment/site-image/...
    const currentPaths = siteImages.flatMap((img: SiteImage) => {
      if (img.file_urls && Array.isArray(img.file_urls)) {
        return img.file_urls;
      } else if (img.file_url) {
        return [img.file_url];
      }
      return [];
    });

    // Find removed images by comparing the storage paths
    const removedPaths = currentPaths.filter(
      (currentPath) => !updatedPaths.includes(currentPath)
    );

    if (removedPaths.length > 0) {
      const newImagesToDelete = [...imagesToDelete, ...removedPaths];
      form.setValue("imagesToDelete", newImagesToDelete);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Site Images</h3>
      
      <div className="space-y-4">
        {imagesToDelete.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            <div className="flex items-center text-amber-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>
                {imagesToDelete.length} image
                {imagesToDelete.length > 1 ? "s" : ""} marked for
                deletion. Click "Update Site" to apply these changes.
              </span>
            </div>
          </div>
        )}
        
        <FileUpload
          maxFiles={5}
          acceptedFileTypes=".jpg,.jpeg,.png,.gif,.webp"
          maxSizeInMB={5}
          buttonText="Choose Images"
          onFilesSelected={handleNewImagesSelected}
          multiple={true}
          existingFiles={formattedExistingImages}
          onExistingFilesChange={(files) =>
            handleExistingImagesChange(files, SUPABASE_URL)
          }
          selectedFiles={selectedImageFiles}
        >
          Add Site Images
        </FileUpload>
        
        <p className="text-sm text-muted-foreground mt-2">
          Upload images of the site. Accepted formats: jpg, jpeg, png,
          gif, webp. Max 5 images, each up to 5MB.
        </p>
      </div>
    </div>
  );
};
