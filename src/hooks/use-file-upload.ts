
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = folder 
        ? `${folder}/${fileName}` 
        : fileName;
      
      // Upload the file to Supabase storage
      const { error, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Upload Error",
          description: error.message || "Failed to upload file",
          variant: "destructive",
        });
        return null;
      }

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Unexpected error during upload:', error);
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
        console.error('Error deleting file:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error during file deletion:', error);
      return false;
    }
  };

  return {
    isUploading,
    uploadFile,
    deleteFile
  };
}
