import { supabase } from "@/integrations/supabase/client";


export const updateClaimApplication = async (id: number, phase_id: number) => {
    try {
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            console.error("Error fetching user:", userError);
            throw new Error("Failed to fetch user");
        }
        const userId = userData.user.id;

        // Perform update
        const { error: updateError } = await supabase
            .from("nd_claim_application")
            .update({
                updated_at: new Date().toISOString(),
                updated_by: userId,
                phase_id: phase_id,
            })
            .eq("id", id);

        if (updateError) {
            console.error("Error updating claim application:", updateError);
            throw new Error("Failed to update claim application");
        }

        return { success: true };
    } catch (error) {
        console.error("Error in updateClaimApplication function:", error);
        throw error;
    }
};

type UpsertClaimRequestData = {
    category_id?: number;
    remark?: string;
    application_id: number;
    item_id: number;
    site_ids?: number[];
};

export const upsertClaimRequest = async (data: UpsertClaimRequestData) => {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            console.error("Error fetching user:", userError);
            throw new Error("Failed to fetch user");
        }
        const userId = userData.user.id;

        // Upsert into nd_claim_request
        const { error: upsertError } = await supabase
            .from("nd_claim_request")
            .upsert({
                category_id: data.category_id,
                remark: data.remark,
                application_id: data.application_id,
                item_id: data.item_id,
                site_ids: data.site_ids,
                updated_at: new Date().toISOString(),
                updated_by: userId,
            }, {
                onConflict: "item_id,application_id"
            });

        if (upsertError) {
            console.error("Error upserting claim request:", upsertError);
            throw new Error("Failed to upsert claim request");
        }

        return { success: true };
    } catch (error) {
        console.error("Error in upsertClaimRequest function:", error);
        throw error;
    }
};

type DeleteClaimRequestData = {
    item_id: number;
    application_id: number;
};

export const deleteClaimRequest = async (data: DeleteClaimRequestData) => {
    try {
        const { error: deleteError } = await supabase
            .from("nd_claim_request")
            .delete()
            .match({
                item_id: data.item_id,
                application_id: data.application_id,
            });

        if (deleteError) {
            console.error("Error deleting claim request:", deleteError);
            throw new Error("Failed to delete claim request");
        }

        return { success: true };
    } catch (error) {
        console.error("Error in deleteClaimRequest function:", error);
        throw error;
    }
};
