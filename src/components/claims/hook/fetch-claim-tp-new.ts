import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserMetadata } from "@/hooks/use-user-metadata";

export const useFetchClaimTPNew = () => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const organizationId = parsedMetadata?.organization_id;

  return useQuery({
    queryKey: ["fetchClaimTPNew", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      // Fetch data from nd_claim_application
      const { data: claimApplications, error: claimAppError } = await supabase
        .from("nd_claim_application")
        .select(`
          id,
          phase_id (id, name),
          refid_mcmc,
          claim_status (id, name),
          year,
          quarter,
          month,
          ref_no,
          date_paid,
          payment_status,
          tp_dusp_id (id, name, parent_id (id, name))
        `)
        .eq("tp_dusp_id", organizationId)
        .order("year", { ascending: false }) // Order by year in descending order
        .order("month", { ascending: false })
        .limit(1); // Then order by month in descending order

      if (claimAppError) throw claimAppError;

      return claimApplications;
    },
    enabled: !!organizationId,
  });
};