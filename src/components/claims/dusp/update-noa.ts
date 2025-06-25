import { supabase } from "@/integrations/supabase/client";

type UpdateNoaData = {
  claim_id: number;
  noa: string;
};

export const updateNoa = async (data: UpdateNoaData) => {
  try {
    // Fetch the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Error fetching user:", userError);
      throw new Error("Failed to fetch user");
    }
    const updatedBy = userData.user.id;

    // Update the noa column in nd_claim_application
    const { error: updateError } = await supabase
      .from("nd_claim_application")
      .update({ noa: data.noa, updated_by: updatedBy })
      .eq("id", data.claim_id);

    if (updateError) {
      console.error("Error updating noa:", updateError);
      throw new Error("Failed to update noa");
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateNoa function:", error);
    throw error;
  }
};