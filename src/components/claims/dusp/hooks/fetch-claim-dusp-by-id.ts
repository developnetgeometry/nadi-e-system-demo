import { useQuery } from "@tanstack/react-query";
import { supabase, SUPABASE_BUCKET_URL, BUCKET_NAME_SITE_CLAIM } from "@/integrations/supabase/client";

export const useFetchClaimDUSPById = (claimId: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["fetchClaimDUSPById", claimId],
    queryFn: async () => {
      if (!claimId) throw new Error("Claim ID is required");

      try {
        // Fetch claim application by ID
        const { data: claimApplications, error: claimAppError } = await supabase
          .from("nd_claim_application")
          .select(`
            id,
            phase_id (id, name),
            claim_status (id, name),
            year,
            quarter,
            month,
            ref_no,
            date_paid,
            payment_status,
            tp_dusp_id (id, name, parent_id (id, name))
          `)
          .eq("id", claimId)
          .single();

        if (claimAppError) {
          console.error("Error fetching nd_claim_application:", claimAppError);
          throw new Error("Failed to fetch claim application");
        }

        // Fetch related claim requests
        const { data: claimRequests, error: claimReqError } = await supabase
          .from("nd_claim_request")
          .select(`
            id,
            category_id (id, name),
            item_ids,
            status_item,
            remark,
            application_id
          `)
          .eq("application_id", claimId);

        if (claimReqError) {
          console.error("Error fetching nd_claim_request:", claimReqError);
          throw new Error("Failed to fetch claim requests");
        }

        const requestIds = claimRequests.map((req) => req.id);

        // Fetch related claim attachments
        const { data: claimAttachments, error: claimAttachError } = await supabase
          .from("nd_claim_attachment")
          .select(`
            id,
            claim_type_id (id, name),
            file_path,
            request_id
          `)
          .in("request_id", requestIds);

        if (claimAttachError) {
          console.error("Error fetching nd_claim_attachment:", claimAttachError);
          throw new Error("Failed to fetch claim attachments");
        }

        // Add prefix to file_path
        const updatedClaimAttachments = claimAttachments.map((attachment) => ({
          ...attachment,
          file_path: `${SUPABASE_BUCKET_URL}/${BUCKET_NAME_SITE_CLAIM}/${attachment.file_path}`,
        }));

        // Fetch related claim logs
        const { data: claimLogs, error: claimLogError } = await supabase
          .from("nd_claim_log")
          .select(`
            id,
            status_id (id, name),
            remark,
            created_at,
            claim_id
          `)
          .eq("claim_id", claimId);

        if (claimLogError) {
          console.error("Error fetching nd_claim_log:", claimLogError);
          throw new Error("Failed to fetch claim logs");
        }

        // Combine data
        return {
          ...claimApplications,
          requests: claimRequests.map((req) => ({
            ...req,
            attachments: updatedClaimAttachments.filter((attach) => attach.request_id === req.id),
          })),
          logs: claimLogs,
        };
      } catch (error) {
        console.error("Error in useFetchClaimDUSPById function:", error);
        throw error;
      }
    },
    enabled, // Control fetching based on the `enabled` parameter
  });
};