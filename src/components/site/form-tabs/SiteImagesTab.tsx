import { FileUpload } from "@/components/ui/file-upload";
import { SUPABASE_URL } from "@/integrations/supabase/client";
import { useRef, useEffect, useState, useMemo } from "react";
import { useSiteImage } from "../hook/use-site-image";
import { Site } from "@/types/site";

interface SiteImage {
  id: number;
  site_profile_id: string | number;
  file_url: string;
  file_urls?: string[];
}

interface SiteImagesTabProps {
  site?: Site | null;
  open: boolean;
  onImagesChange: (selectedFiles: File[], imagesToDelete: string[], siteImages: SiteImage[]) => void;
}

export const SiteImagesTab = ({
  site,
  open,
  onImagesChange
}: SiteImagesTabProps) => {
  const fileUploadRef = useRef<any>(null);
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [existingImagePaths, setExistingImagePaths] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [hasInitializedImages, setHasInitializedImages] = useState(false);

  const { fetchSiteImages, loading: imageLoading } = useSiteImage();

  // Fetch site images when editing a site
  useEffect(() => {
    if (site && open && !hasInitializedImages) {
      console.log("Fetching site images for site:", site.id);
      const loadImages = async () => {
        try {
          const images = await fetchSiteImages(site.id);
          console.log("Fetched site images:", images);
          setSiteImages(images);

          // Extract all image paths for tracking existing images
          const allPaths = images.flatMap((img) => {
            if (img.file_urls && Array.isArray(img.file_urls)) {
              return img.file_urls;
            } else if (img.file_url) {
              return [img.file_url];
            }
            return [];
          });

          setExistingImagePaths(allPaths);
          setHasInitializedImages(true);
        } catch (error) {
          console.error("Error fetching site images:", error);
        }
      };

      loadImages();
    }
  }, [site, open, fetchSiteImages, hasInitializedImages]);

  // Reset form and image states when dialog is closed
  useEffect(() => {
    if (!open) {
      // Reset all image-related states
      setSiteImages([]);
      setSelectedImageFiles([]);
      setExistingImagePaths([]);
      setImagesToDelete([]);
      setHasInitializedImages(false);
      if (fileUploadRef.current) {
        fileUploadRef.current.clearFiles();
      }
    }
  }, [open]);

  // Notify parent of changes
  useEffect(() => {
    onImagesChange(selectedImageFiles, imagesToDelete, siteImages);
  }, [selectedImageFiles, imagesToDelete, siteImages, onImagesChange]);

  // Format existing images for FileUpload component
  const formattedExistingImages = useMemo(() => {
    console.log("Formatting site images:", siteImages);

    if (!siteImages || siteImages.length === 0) {
      console.log("No site images to format");
      return null;
    }

    // Handle case where an image might have multiple URLs in file_urls array
    const allImages = siteImages.flatMap((image) => {
      const urls = image.file_urls || (image.file_url ? [image.file_url] : []);
      return urls.map((url, index) => ({
        url,
        name: `Site Image ${urls.length > 1 ? index + 1 : ""}`.trim(),
      }));
    });

    console.log("Formatted images:", allImages);
    return allImages.length > 0 ? allImages : null;
  }, [siteImages]);

  // Handle image selection
  const handleImagesChange = (files: File[]) => {
    setSelectedImageFiles(files);
  };

  // Handle existing images change (when user removes an image)
  const handleExistingImagesChange = (
    updatedImages: Array<{ url: string; name: string }>,
    supabaseUrl: string
  ) => {
    const updatedPaths = updatedImages.map((img) =>
      img.url.startsWith(supabaseUrl)
        ? img.url.substring(supabaseUrl.length)
        : img.url
    );

    // Find removed images
    const removedPaths = existingImagePaths.filter(
      (path) => !updatedPaths.includes(path)
    );

    // Instead of deleting immediately, mark them for deletion when form is submitted
    if (removedPaths.length > 0) {
      console.log("Images marked for deletion:", removedPaths);
      setImagesToDelete((prev) => [...prev, ...removedPaths]);
      // Update the visible image paths (but don't actually delete from database yet)
      setExistingImagePaths(updatedPaths);
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
          ref={fileUploadRef}
          maxFiles={3}
          acceptedFileTypes=".jpg,.jpeg,.png,.gif,.webp"
          maxSizeInMB={5}
          buttonText="Choose Images"
          onFilesSelected={handleImagesChange}
          multiple={true}
          existingFiles={formattedExistingImages}
          onExistingFilesChange={(files) =>
            handleExistingImagesChange(files, SUPABASE_URL)
          }
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
