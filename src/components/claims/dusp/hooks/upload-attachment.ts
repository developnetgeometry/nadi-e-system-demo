import { supabase, BUCKET_NAME_SITE_CLAIM } from "@/integrations/supabase/client";

export const uploadAttachment = async (
  files: File[],
  requestId: number,
  claimTypeId: number,
  tpName: string,
  duspName: string,
  year: number,
  quarter: number,
  month: number
) => {
  try {
    const uploadedFiles = [];

    for (const file of files) {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${duspName}/${tpName}/${year}/${quarter}/${month}/${fileName}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME_SITE_CLAIM)
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file to storage:", uploadError);
        throw new Error("Failed to upload file to storage");
      }

      // Insert file details into nd_claim_attachment
      const { error: attachmentError } = await supabase
        .from("nd_claim_attachment")
        .insert({
          request_id: requestId,
          claim_type_id: claimTypeId,
          file_path: filePath,
        });

      if (attachmentError) {
        console.error("Error inserting into nd_claim_attachment:", attachmentError);
        throw new Error("Failed to insert into nd_claim_attachment");
      }

      uploadedFiles.push(filePath);
    }

    return uploadedFiles;
  } catch (error) {
    console.error("Error in uploadAttachment function:", error);
    throw error;
  }
};