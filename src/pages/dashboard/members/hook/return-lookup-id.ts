import { supabase } from "@/integrations/supabase/client";

export async function getNationalityId(nationality: string): Promise<number | null> {
  const keyword = nationality.toLowerCase();

  const { data, error } = await supabase
    .from("nd_nationalities")
    .select("id")
    .or(`bm.ilike.${keyword},eng.ilike.${keyword}`)
    .single();

  if (error) {
    console.error("Failed to fetch nationality ID:", error.message);
    return null;
  }

  return data?.id ?? null;
}

export async function getStateId(state: string): Promise<number | null> {
  const keyword = state.toLowerCase();

  const { data, error } = await supabase
    .from("nd_state")
    .select("id")
    .or(`name.ilike.${keyword}`)
    .single();

  if (error) {
    console.error("Failed to fetch state ID:", error.message);
    return null;
  }

  return data?.id ?? null;
}

export async function getDistrictId(district: string, stateId: number): Promise<number | null> {
  const keyword = district.toLowerCase();

  const { data, error } = await supabase
    .from("nd_district")
    .select("id")
    .eq("state_id", stateId)
    .or(`name.ilike.${keyword}`)
    .single();

  if (error) {
    console.error("Failed to fetch district ID:", error.message);
    return null;
  }

  return data?.id ?? null;
}

export async function getRaceId(race: string): Promise<number | null> {
  const keyword = race.toLowerCase();

  const { data, error } = await supabase
    .from("nd_races")
    .select("id")
    .or(`bm.ilike.${keyword},eng.ilike.${keyword}`)
    .single();

  if (error) {
    console.error("Failed to fetch race ID:", error.message);
    return null;
  }

  return data?.id ?? null;
}

export async function getGenderId(gender: string): Promise<number | null> {
  const keyword = gender.toLowerCase();

  const { data, error } = await supabase
    .from("nd_genders")
    .select("id")
    .filter("eng", "ilike", keyword)
    .single();

  if (error) {
    console.error("Failed to fetch gender ID:", error.message);
    return null;
  }

  return data?.id ?? null;
}