import { supabase, BUCKET_NAME_SITE_CLAIM } from "@/integrations/supabase/client";

export const deleteAttachment = async (attachment: { id: number; file_path: string }) => {
  try {
    const { id, file_path } = attachment;

    if (!file_path || !id) {
      throw new Error("Invalid attachment object. Both 'id' and 'file_path' are required.");
    }

    // Extract the file path relative to the bucket
    const relativeFilePath = file_path.split(`${BUCKET_NAME_SITE_CLAIM}/`)[1];

    if (!relativeFilePath) {
      throw new Error("Invalid file path format.");
    }

    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME_SITE_CLAIM)
      .remove([relativeFilePath]);

    if (storageError) {
      console.error(`Error deleting file ${relativeFilePath} from storage:`, storageError);
      throw new Error(`Failed to delete file ${relativeFilePath} from storage`);
    }

    // Delete the record from the nd_claim_attachment table
    const { error: dbError } = await supabase
      .from("nd_claim_attachment")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Error deleting from nd_claim_attachment:", dbError);
      throw new Error("Failed to delete attachment record from database");
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteAttachment function:", error);
    throw error;
  }
};