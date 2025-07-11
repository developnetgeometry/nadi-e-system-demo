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

export async function checkICExists(identity_no: string | null): Promise<boolean | null> {
  if (!identity_no) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("ic_number")
    .eq("ic_number", identity_no)
    .maybeSingle();

  if (error) {
    console.error("Error checking IC:", error);
    return null;
  }

  return !data; // true = unique (doesn't exist), false = already exists
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

export async function insertAndCleanupMember(data: MemberData): Promise<{ success: boolean; error: string | null }> {
  try {
    // Step 1: Insert the data and return the inserted ID
    const { data: inserted, error: insertError } = await supabase
      .from("nd_member_bulk")
      .insert(data)
      .select("id") // get the inserted row's id
      .single();

    if (insertError || !inserted) {
      console.error("Insert failed:", insertError);
      return {
        success: false,
        error: insertError?.message || "Failed to insert data"
      };
    }

    // Step 2: Delete the inserted row
    const { error: deleteError } = await supabase
      .from("nd_member_bulk")
      .delete()
      .eq("id", inserted.id);

    if (deleteError) {
      console.error("Delete failed:", deleteError);
      return {
        success: false,
        error: null
      };
    }

    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

