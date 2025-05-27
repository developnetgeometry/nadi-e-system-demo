import { useState, useEffect } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { supabase } from "@/integrations/supabase/client";

export function useInventoryImage(initialImageUrl: string = "") {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl || "");
  const { isUploading, uploadFile } = useFileUpload();

  // Update previewUrl when initialImageUrl changes (when editing an inventory)
  useEffect(() => {
    if (initialImageUrl && initialImageUrl !== previewUrl) {
      setPreviewUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  // Handle inventory image file selection
  const handleImageChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      // Verify we have an image file with proper MIME type
      if (!file.type.startsWith("image/")) {
        console.warn(`File does not have an image MIME type: ${file.type}`);
        return; // Don't allow non-image files
      }

      console.log(
        `Selected image file: ${file.name}, type: ${file.type}, size: ${file.size}`
      );
      setImageFile(file);

      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Remove the selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");
  };

  // Upload image and get URL
  const uploadImage = async () => {
    if (!imageFile) return previewUrl || null;

    try {
      console.log(
        `Uploading image file: ${imageFile.name}, type: ${imageFile.type}`
      );

      // Verify one more time that it's an image type
      if (!imageFile.type.startsWith("image/")) {
        console.error(`Cannot upload non-image file: ${imageFile.type}`);
        return null;
      }

      const userData = await supabase.auth.getUser();
      const userId = userData.data.user?.id;
      const folder = userId || "anonymous";

      // Pass the file directly to the uploadFile function
      const url = await uploadFile(imageFile, "inventory-images", folder);
      console.log(`Image uploaded, URL: ${url}`);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  return {
    imageFile,
    previewUrl,
    isUploading,
    handleImageChange,
    handleRemoveImage,
    uploadImage,
  };
}
