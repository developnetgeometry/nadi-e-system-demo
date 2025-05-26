import { useQuery } from "@tanstack/react-query";
import { BUCKET_NAME_SITE_CLAIM, supabase, SUPABASE_BUCKET_URL } from "@/integrations/supabase/client";

export const useFetchClaimById = (id: number) => {
  return useQuery({
    queryKey: ["fetchClaimById", id],
    queryFn: async () => {
      if (!id) return null;

      try {
        // Fetch data from nd_claim_application
        const { data: claimApplication, error: claimAppError } = await supabase
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
            tp_dusp_id (id, name, parent_id (id, name)),
            site_profile_ids,
            item_ids
          `)
          .eq("id", id)
          .single();

        if (claimAppError) {
          console.error("Error fetching nd_claim_application:", claimAppError);
          throw new Error("Failed to fetch claim application");
        }

        // Fetch data from nd_claim_request
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
          .eq("application_id", id);

        if (claimReqError) {
          console.error("Error fetching nd_claim_request:", claimReqError);
          throw new Error("Failed to fetch claim requests");
        }

        const requestIds = claimRequests.map((req) => req.id);

        // Fetch data from nd_claim_attachment
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

        // Fetch data from nd_claim_log
        const { data: claimLogs, error: claimLogError } = await supabase
          .from("nd_claim_log")
          .select(`
            id,
            status_id (id, name),
            remark,
            created_at,
            created_by (id, email, full_name),
            claim_id
          `)
          .eq("claim_id", id);

        if (claimLogError) {
          console.error("Error fetching nd_claim_log:", claimLogError);
          throw new Error("Failed to fetch claim logs");
        }

        // Combine data
        return {
          ...claimApplication,
          requests: claimRequests.map((req) => ({
            ...req,
            attachments: updatedClaimAttachments.filter((attach) => attach.request_id === req.id),
          })),
          logs: claimLogs,
        };
      } catch (error) {
        console.error("Error in useFetchClaimById function:", error);
        throw error;
      }
    },
    enabled: !!id,
  });
};