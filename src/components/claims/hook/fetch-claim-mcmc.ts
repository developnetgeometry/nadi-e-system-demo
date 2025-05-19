import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserMetadata } from "@/hooks/use-user-metadata";

export const useFetchClaimMCMC = () => {

  return useQuery({
    queryKey: ["fetchClaimTP"],
    queryFn: async () => {

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
          tp_dusp_id (id, name)
        `)
        .in("claim_status", [3, 4]) // Filter by claim status
        .order("year", { ascending: false }) // Order by year in descending order
        .order("month", { ascending: false }); // Then order by month in descending order

      if (claimAppError) throw claimAppError;

      const claimIds = claimApplications.map((app) => app.id);
      const tpDuspIds = claimApplications.map((app) => app.tp_dusp_id.id);

      // Fetch data from nd_claim_request
      const { data: claimRequests, error: claimReqError } = await supabase
        .from("nd_claim_request")
        .select(`
          id,
          category_id (id, name),
          item_id (id, name),
          status_item,
          remark,
          application_id
        `)
        .in("application_id", claimIds);

      if (claimReqError) throw claimReqError;

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

      if (claimAttachError) throw claimAttachError;

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

      if (claimLogError) throw claimLogError;

      // Fetch data from organizations based on tp_dusp_id
      const { data: organizations, error: orgError } = await supabase
        .from("organizations")
        .select(`
          id,
          parent_id (id, name)
        `)
        .in("id", tpDuspIds);

      if (orgError) throw orgError;

      // Combine data
      return claimApplications.map((app) => {
        const relatedRequests = claimRequests.filter((req) => req.application_id === app.id);
        const relatedLogs = claimLogs.filter((log) => log.claim_id === app.id);
        const relatedOrganization = organizations.find((org) => org.id === app.tp_dusp_id.id);

        return {
          ...app,
          tp_dusp_organization: relatedOrganization?.parent_id || null,
          requests: relatedRequests.map((req) => ({
            ...req,
            attachments: claimAttachments.filter((attach) => attach.request_id === req.id),
          })),
          logs: relatedLogs,
        };
      });
    },
  });
};