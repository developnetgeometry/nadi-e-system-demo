import { supabase } from "@/integrations/supabase/client";

type UpdateClaimData = {
  claim_id: number;
  claim_status: number;
  request_remark: string;
};

export const updateClaim = async (data: UpdateClaimData) => {
  try {
    // // Update the claim status
    const { error: updateError } = await supabase
      .from("nd_claim_application")
      .update({ claim_status: data.claim_status })
      .eq("id", data.claim_id);

    if (updateError) {
      console.error("Error updating claim status:", updateError);
      throw new Error("Failed to update claim status");
    }

    // Insert into nd_claim_log
    const { error: logError } = await supabase
      .from("nd_claim_log")
      .insert({
        claim_id: data.claim_id,
        status_id: data.claim_status,
        remark: data.request_remark,
      });

    if (logError) {
      console.error("Error inserting into nd_claim_log:", logError);
      throw new Error("Failed to insert into nd_claim_log");
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateClaim function:", error);
    throw error;
  }
};