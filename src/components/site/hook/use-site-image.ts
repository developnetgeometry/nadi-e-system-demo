import { useState } from "react";
import { BUCKET_NAME_SITE_CLOSURE, supabase, SUPABASE_URL } from "@/integrations/supabase/client";

// Define the site image interface that matches the database schema
interface SiteImage {
  id?: number;
      site_profile_id: string | number; // Changed from site_id to site_profile_id
  file_path: string[]; // Changed to string array to match the database column type
}

export const useSiteImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing images for a site
  const fetchSiteImages = async (siteId: string | number) => {
    if (!siteId) return [];
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("nd_site_image")
        .select("*")
        .eq("site_profile_id", siteId); // Changed from site_id to site_profile_id

      if (error) throw error;
      
      // Transform data to match our expected format
      const transformedData = (data || []).map(item => {
        // Handle file_path as an array
        let fileUrls: string[] = [];
        if (Array.isArray(item.file_path)) {
          fileUrls = item.file_path;
        } else if (typeof item.file_path === 'string') {
          try {
            // If it's a JSON string, parse it
            const parsed = JSON.parse(item.file_path);
            fileUrls = Array.isArray(parsed) ? parsed : [item.file_path];
          } catch {
            // If parsing fails, use it as a single string
            fileUrls = [item.file_path];
          }
        }
        
        return {
          id: item.id,
          site_profile_id: item.site_profile_id,
          file_url: fileUrls[0] || '', // Use the first URL for backward compatibility
          file_urls: fileUrls // Store all URLs
        };
      });
      
      return transformedData;
    } catch (err) {
      console.error("Error fetching site images:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Upload site images
  const uploadSiteImages = async (siteId: string | number, files: File[], siteCode: string) => {
    if (!siteId || !files.length) return { success: false, error: "Missing site ID or files" };
    
    try {
      setLoading(true);
      const uploadedPaths: string[] = [];
      
      // First check if there are any existing images for this site to avoid duplicates
      const { data: existingImages, error: checkError } = await supabase
        .from("nd_site_image")
        .select("*")
        .eq("site_profile_id", siteId);

      if (checkError) throw checkError;
      
      // Extract existing file names to check for duplicates
      let existingFileNames: string[] = [];
      let existingPaths: string[] = [];
      
      if (existingImages && existingImages.length > 0) {
        // Handle existing file paths
        if (Array.isArray(existingImages[0].file_path)) {
          existingPaths = existingImages[0].file_path;
        } else if (typeof existingImages[0].file_path === 'string') {
          try {
            const parsed = JSON.parse(existingImages[0].file_path);
            existingPaths = Array.isArray(parsed) ? parsed : [existingImages[0].file_path];
          } catch {
            existingPaths = existingImages[0].file_path ? [existingImages[0].file_path] : [];
          }
        }
        
        // Extract just the file names for easier comparison
        existingFileNames = existingPaths.map(path => {
          const parts = path.split('/');
          return parts[parts.length - 1];
        });
      }
      
      console.log("Existing file names:", existingFileNames);

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        // Only allow image files
        if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
          throw new Error(`Invalid file type: ${fileExtension}. Only jpg, jpeg, png, gif, and webp are allowed.`);
        }

        // Create a unique filename that won't be duplicated
        const uniquePrefix = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        const fileName = `${siteCode}_${uniquePrefix}_${file.name}`;
        const filePath = `site-image/${siteCode}/${fileName}`;
        
        // Check if file with same name already exists - if so, skip it
        if (existingFileNames.some(name => name.toLowerCase().includes(file.name.toLowerCase()))) {
          console.log(`File with name ${file.name} already exists, skipping upload`);
          continue;
        }

        console.log(`Uploading new file: ${fileName}`);
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME_SITE_CLOSURE)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const storagePath = `/storage/v1/object/public/${BUCKET_NAME_SITE_CLOSURE}/${filePath}`;
        uploadedPaths.push(storagePath);
      }

      // If no new paths were uploaded (all were duplicates), just return success
      if (uploadedPaths.length === 0) {
        console.log("No new files to upload");
        return { success: true, paths: [] };
      }

      // Insert records into nd_site_image table with correct column name
      console.log("Uploading image paths:", uploadedPaths);
      
      if (existingImages && existingImages.length > 0) {
        // Update existing record with additional images
        const existingId = existingImages[0].id;
        
        console.log("Existing paths:", existingPaths);
        
        // Merge existing and new paths
        const allPaths = [...existingPaths, ...uploadedPaths];
        
        console.log("Updated paths array:", allPaths);
        
        // Update the record - ensure file_path is passed as a proper PostgreSQL array
        const { error: updateError } = await supabase
          .from("nd_site_image")
          .update({
            file_path: allPaths
          })
          .eq("id", existingId);

        if (updateError) {
          console.error("Error updating site image:", updateError);
          throw updateError;
        }
      } else {
        console.log("Creating new site image record with paths:", uploadedPaths);
        
        // Create a new record - ensure file_path is passed as a proper PostgreSQL array
        const { error: insertError } = await supabase
          .from("nd_site_image")
          .insert({
            site_profile_id: siteId,
            file_path: uploadedPaths
          });

        if (insertError) {
          console.error("Error inserting site image:", insertError);
          throw insertError;
        }
      }

      return { success: true, paths: uploadedPaths };
    } catch (err) {
      console.error("Error uploading site images:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a site image
  const deleteSiteImage = async (imageId: number, filePath: string) => {
    try {
      setLoading(true);
      console.log("Deleting image:", { imageId, filePath });
      
      // Find the record first
      const { data: imageRecord, error: fetchError } = await supabase
        .from("nd_site_image")
        .select("*")
        .eq("id", imageId);

      if (fetchError) throw fetchError;
      
      if (!imageRecord || imageRecord.length === 0) {
        throw new Error("Image record not found");
      }
      
      console.log("Found image record:", imageRecord[0]);
      
      // Handle file_path array
      let filePaths: string[] = [];
      if (Array.isArray(imageRecord[0].file_path)) {
        filePaths = imageRecord[0].file_path;
      } else if (typeof imageRecord[0].file_path === 'string') {
        try {
          const parsed = JSON.parse(imageRecord[0].file_path);
          filePaths = Array.isArray(parsed) ? parsed : [imageRecord[0].file_path];
        } catch {
          filePaths = imageRecord[0].file_path ? [imageRecord[0].file_path] : [];
        }
      }
      
      console.log("Current file paths:", filePaths);
      
      // Remove the specific path
      const updatedPaths = filePaths.filter(path => path !== filePath);
      console.log("Updated file paths after removal:", updatedPaths);
      
      // Delete the file from storage
      // Extract the storage path from the full URL
      const storagePath = filePath.split(`/storage/v1/object/public/${BUCKET_NAME_SITE_CLOSURE}/`)[1];
      
      if (storagePath) {
        try {
          console.log("Attempting to delete file from storage:", storagePath);
          const { error: deleteFileError } = await supabase.storage
            .from(BUCKET_NAME_SITE_CLOSURE)
            .remove([storagePath]);

          if (deleteFileError) {
            console.error("Error deleting file from storage:", deleteFileError);
          } else {
            console.log("Successfully deleted file from storage");
          }
        } catch (delErr) {
          console.error("Error deleting file:", delErr);
        }
      }

      if (updatedPaths.length > 0) {
        // Update the record with the remaining paths
        console.log("Updating record with remaining paths");
        const { error: updateError } = await supabase
          .from("nd_site_image")
          .update({
            file_path: updatedPaths  // Make sure this is passed as a proper array
          })
          .eq("id", imageId);

        if (updateError) {
          console.error("Error updating site image record:", updateError);
          throw updateError;
        }
      } else {
        // If no paths left, delete the entire record
        console.log("No paths left, deleting entire record");
        const { error: deleteRecordError } = await supabase
          .from("nd_site_image")
          .delete()
          .eq("id", imageId);

        if (deleteRecordError) {
          console.error("Error deleting site image record:", deleteRecordError);
          throw deleteRecordError;
        }
      }

      return { success: true };
    } catch (err) {
      console.error("Error deleting site image:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchSiteImages,
    uploadSiteImages,
    deleteSiteImage
  };
};