import { useFileUpload } from "@/hooks/use-file-upload";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export function useAttachment() {
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState<string>("");
  const { isUploading, uploadFile } = useFileUpload();
  const handleAttachmentChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      // Verify we have an image file with proper MIME type
      if (!file.type.startsWith("image/")) {
        console.warn(`File does not have an image MIME type: ${file.type}`);
        return; // Don't allow non-image files
      }

      console.log(
        `Selected logo file: ${file.name}, type: ${file.type}, size: ${file.size}`
      );
      setAttachmentFile(file);

      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setAttachmentPreviewUrl(objectUrl);
    }
  };

  const uploadAttachment = async () => {
    if (!attachmentFile) return attachmentPreviewUrl || null;

    try {
      console.log(
        `Uploading logo file: ${attachmentFile.name}, type: ${attachmentFile.type}`
      );

      // Verify one more time that it's an image type
      if (!attachmentFile.type.startsWith("image/")) {
        console.error(`Cannot upload non-image file: ${attachmentFile.type}`);
        return null;
      }

      const userData = await supabase.auth.getUser();
      const userId = userData.data.user?.id;
      const folder = userId || "anonymous";

      // Pass the file directly to the uploadFile function
      //   const url = await uploadFile(
      //     attachmentFile,
      //     "maintenance-attachment",
      //     folder
      //   );

      //   async function testDirectUpload(fileInput: HTMLInputElement) {
      // const file = fileInput.files?.[0];
      const file = attachmentFile;
      if (!file) return;

      console.log("Testing file:", file);
      console.log("Type:", file.type);

      const { data, error } = await supabase.storage
        .from("maintenance-attachment")
        .upload(`test/${file.name}`, file, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error("Upload error:", error);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("maintenance-attachment")
        .getPublicUrl(data.path);

      console.log("✅ Public URL:", publicUrlData.publicUrl);
      //   }

      //   console.log(`Logo uploaded, URL: ${url}`);
      //   return url;
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading logo:", error);
      return null;
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentFile(null);
    setAttachmentPreviewUrl("");
  };

  return {
    attachmentFile,
    attachmentPreviewUrl,
    isUploading,
    handleAttachmentChange,
    handleRemoveAttachment,
    uploadAttachment,
  };
}
