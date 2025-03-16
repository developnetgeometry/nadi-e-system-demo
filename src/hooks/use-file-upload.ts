import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  /**
   * Upload a file to Supabase storage
   */
  const uploadFile = async (
    file: File,
    bucket: string,
    folder?: string
  ): Promise<string | null> => {
    if (!file) return null;

    try {
      setIsUploading(true);

      // Create a unique file name to prevent conflicts
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Log the MIME type for debugging
      console.log(`Uploading file: ${file.name} with MIME type: ${file.type}`);

      // Ensure content type is explicitly set from the file's MIME type
      const options = {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type, // Use the file's MIME type
      };

      console.log("Upload options:", options);

      const blob = new Blob([file], { type: file.type });
      console.log("Blob:", blob);
      // Upload the file to Supabase storage with correct content type
      const { error, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, blob, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || "application/octet-stream",
        });

      if (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Upload Error",
          description: error.message || "Failed to upload file",
          variant: "destructive",
        });
        return null;
      }

      console.log("Upload successful, getting public URL");

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log("Public URL:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Unexpected error during upload:", error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Delete a file from Supabase storage
   */
  const deleteFile = async (
    bucket: string,
    filePath: string
  ): Promise<boolean> => {
    try {
      // Extract the file path from the URL
      const filePathInBucket = filePath.split(`${bucket}/`)[1];
      if (!filePathInBucket) return false;

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePathInBucket]);

      if (error) {
        console.error("Error deleting file:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Unexpected error during file deletion:", error);
      return false;
    }
  };

  return {
    isUploading,
    uploadFile,
    deleteFile,
  };
}
