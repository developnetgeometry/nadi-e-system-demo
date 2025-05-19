import { BUCKET_NAME_SITE_CLAIM, supabase } from "@/integrations/supabase/client";

export const deleteClaimData = async (claimId: string) => {
  try {
    // Delete from nd_claim_log
    const { error: logError } = await supabase
      .from("nd_claim_log")
      .delete()
      .eq("claim_id", Number(claimId));

    if (logError) {
      console.error("Error deleting from nd_claim_log:", logError);
      throw new Error("Failed to delete from nd_claim_log");
    }

    // Fetch request IDs related to the claim
    const { data: claimRequests, error: fetchRequestError } = await supabase
      .from("nd_claim_request")
      .select("id")
      .eq("application_id", Number(claimId));

    if (fetchRequestError) {
      console.error("Error fetching claim requests:", fetchRequestError);
      throw new Error("Failed to fetch claim requests");
    }

    const requestIds = claimRequests.map((req) => req.id);

    // Delete files from storage
    for (const requestId of requestIds) {
      const { data: attachments, error: fetchAttachmentsError } = await supabase
        .from("nd_claim_attachment")
        .select("file_path")
        .eq("request_id", requestId);

      if (fetchAttachmentsError) {
        console.error("Error fetching attachments:", fetchAttachmentsError);
        throw new Error("Failed to fetch attachments");
      }

      for (const attachment of attachments) {
        const filePath = attachment.file_path; // Directly use file_path as it is already in the correct format

        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME_SITE_CLAIM) // Use the bucket name
          .remove([filePath]);

        if (storageError) {
          console.error(`Error deleting file ${filePath} from storage:`, storageError);
          throw new Error(`Failed to delete file ${filePath} from storage`);
        }
      }
    }

    // Delete from nd_claim_attachment
    const { error: attachmentError } = await supabase
      .from("nd_claim_attachment")
      .delete()
      .in("request_id", requestIds);

    if (attachmentError) {
      console.error("Error deleting from nd_claim_attachment:", attachmentError);
      throw new Error("Failed to delete from nd_claim_attachment");
    }

    // Delete from nd_claim_request
    const { error: requestError } = await supabase
      .from("nd_claim_request")
      .delete()
      .eq("application_id", Number(claimId));

    if (requestError) {
      console.error("Error deleting from nd_claim_request:", requestError);
      throw new Error("Failed to delete from nd_claim_request");
    }

    // Delete from nd_claim_application
    const { error: applicationError } = await supabase
      .from("nd_claim_application")
      .delete()
      .eq("id", Number(claimId));

    if (applicationError) {
      console.error("Error deleting from nd_claim_application:", applicationError);
      throw new Error("Failed to delete from nd_claim_application");
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteClaimData function:", error);
    throw error;
  }
};