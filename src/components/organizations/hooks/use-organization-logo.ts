
import { useState, useEffect } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { supabase } from "@/lib/supabase";

export function useOrganizationLogo(initialLogoUrl: string = "") {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialLogoUrl || "");
  const { isUploading, uploadFile } = useFileUpload();

  // Handle logo file selection
  const handleLogoChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setLogoFile(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Return cleanup function
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Remove the selected logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl("");
  };

  // Upload logo and get URL
  const uploadLogo = async () => {
    if (!logoFile) return null;

    try {
      const userData = await supabase.auth.getUser();
      const userId = userData.data.user?.id;
      const folder = userId || "anonymous";
      
      return await uploadFile(logoFile, "organization_logos", folder);
    } catch (error) {
      console.error("Error uploading logo:", error);
      return null;
    }
  };

  return {
    logoFile,
    previewUrl,
    isUploading,
    handleLogoChange,
    handleRemoveLogo,
    uploadLogo
  };
}
