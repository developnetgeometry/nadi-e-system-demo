import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


export function cleanIdentityNumber(identityNumber: string, identityType: number): string {
  if (identityType === 1) {
    // Remove all dashes
    return identityNumber.replace(/-/g, '');
  }

  // Return as is for other identity types
  return identityNumber;
}

export function useCheckICExists(identity_no: string | null) {
  const [isUnique, setIsUnique] = useState<boolean | null>(null);

  useEffect(() => {
    if (!identity_no) return;

    const checkIC = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("ic_number")
        .eq("ic_number", identity_no)
        .maybeSingle();

      if (error) {
        console.error("Error checking IC:", error);
        setIsUnique(null);
        return;
      }

      setIsUnique(!data); // if data exists, it's NOT unique
    };

    checkIC();
  }, [identity_no]);

  return isUnique;
}


interface MemberData {
  fullname?: string;
  identity_no?: string;
  identity_no_type?: number;
  gender?: number;
  race_id?: number;
  pdpa_declare?: boolean;
  agree_declare?: boolean;
  nationality_id?: number;
  community_status?: boolean;
  status_entrepreneur?: boolean;
  supervision?: string;
  address1?: string;
  address2?: string;
  ref_id?: number;
  district_id?: number;
  state_id?: number;
  postcode?: string;
  city?: string;
}

interface MemberData {
  fullname?: string;
  identity_no?: string;
  identity_no_type?: number;
  gender?: number;
  race_id?: number;
  pdpa_declare?: boolean;
  agree_declare?: boolean;
  nationality_id?: number;
  community_status?: boolean;
  status_entrepreneur?: boolean;
  supervision?: string;
  address1?: string;
  address2?: string;
  ref_id?: number;
  district_id?: number;
  state_id?: number;
  postcode?: string;
  city?: string;
}

export async function insertAndCleanupMember(data: MemberData): Promise<boolean> {
  // Step 1: Insert the data and return the inserted ID
  const { data: inserted, error: insertError } = await supabase
    .from("nd_member_bulk")
    .insert(data)
    .select("id") // get the inserted row's id
    .single();

  if (insertError || !inserted) {
    console.error("Insert failed:", insertError);
    return false;
  }

  // Step 2: Delete the inserted row
  const { error: deleteError } = await supabase
    .from("nd_member_bulk")
    .delete()
    .eq("id", inserted.id);

  if (deleteError) {
    console.error("Delete failed:", deleteError);
    return true;
  }

  return true;
}

