import { useQuery } from "@tanstack/react-query";
import { BUCKET_NAME_SITE_CLAIM, supabase, SUPABASE_BUCKET_URL } from "@/integrations/supabase/client";

export const useFetchClaimMCMC = () => {
  return useQuery({
    queryKey: ["fetchClaimMCMC"],
    queryFn: async () => {
      try {
        // Fetch data from nd_claim_application
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
            tp_dusp_id (id, name, parent_id (id, name)),
            site_profile_ids
          `)
          .in("claim_status", [3, 4]) // Filter by claim status
          .order("year", { ascending: false })
          .order("month", { ascending: false });

        if (claimAppError) {
          console.error("Error fetching nd_claim_application:", claimAppError);
          throw new Error("Failed to fetch claim applications");
        }

        const claimIds = claimApplications.map((app) => app.id);

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
          .in("application_id", claimIds);

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
            claim_id
          `)
          .in("claim_id", claimIds);

        if (claimLogError) {
          console.error("Error fetching nd_claim_log:", claimLogError);
          throw new Error("Failed to fetch claim logs");
        }

        // Combine data
        return claimApplications.map((app) => {
          const relatedRequests = claimRequests.filter((req) => req.application_id === app.id);
          const relatedLogs = claimLogs.filter((log) => log.claim_id === app.id);

          return {
            ...app,
            requests: relatedRequests.map((req) => ({
              ...req,
              attachments: updatedClaimAttachments.filter((attach) => attach.request_id === req.id),
            })),
            logs: relatedLogs,
          };
        });
      } catch (error) {
        console.error("Error in useFetchClaimMCMC function:", error);
        throw error;
      }
    },
  });
};