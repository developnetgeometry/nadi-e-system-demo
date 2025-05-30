import { supabase } from "@/integrations/supabase/client";

export interface Phase {
  id: number;
  name: string;
  contract_start: string | null;
  contract_end: string | null;
  is_active: boolean | null;
  remark: string | null;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
}

/**
 * Non-hook data fetching function for use in async contexts
 * This function is used by Audit.tsx to fetch phase data directly without React hooks
 */
export async function fetchPhaseData(phaseId: string | number | null) {
  if (!phaseId) {
    return { phase: null };
  }

  try {
    const { data, error } = await supabase
      .from("nd_phases")
      .select("*")
      .eq("id", Number(phaseId))
      .single();
    
    if (error) {
      console.error("Error fetching phase:", error);
      throw error;
    }
    
    return { phase: data as Phase };
  } catch (err) {
    console.error("Error in fetchPhaseData:", err);
    return { phase: null };
  }
}

// For backward compatibility
export default fetchPhaseData;
