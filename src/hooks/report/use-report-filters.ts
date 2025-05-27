import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Phase {
  id: string;
  name: string;
}

export interface DUSP {
  id: string;
  name: string;
}

export interface NADISite {
  id: string;
  sitename: string;
  standard_code?: string;
}

export interface TPProvider {
  id: string;
  name: string;
}

export interface EventCategoryOption {
  id: string | number;
  name: string;
}
export interface PillarOption {
  id: string | number;
  name: string;
  category_id?: string | number;
}
export interface ProgramOption {
  id: string | number;
  name: string;
  subcategory_id?: string | number;
}

export const useReportFilters = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [dusps, setDusps] = useState<DUSP[]>([]);
  const [nadiSites, setNadiSites] = useState<NADISite[]>([]);
  const [tpProviders, setTpProviders] = useState<TPProvider[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<EventCategoryOption[]>([]);
  const [pillarOptions, setPillarOptions] = useState<PillarOption[]>([]);
  const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);

        // Fetch phases
        const { data: phasesData, error: phasesError } = await supabase
          .from("nd_phases")
          .select("id, name")
          .order("name");

        if (phasesError) throw phasesError;

        // Fetch DUSP parent organizations for filtering
        const { data: orgsData, error: orgsError } = await supabase
          .from("organizations")
          .select("id, name, type")
          .eq("type", "dusp") // Get only DUSP type organizations (parent orgs)
          .order("name");

        if (orgsError) throw orgsError;

        console.log('Available DUSP organizations:', orgsData.map(org => ({
          id: org.id,
          name: org.name,
          type: org.type
        })));        // Fetch NADI sites
        const { data: sitesData, error: sitesError } = await supabase
          .from("nd_site_profile_name")
          .select("id, sitename, standard_code")
          .order("sitename");
          
        if (sitesError) throw sitesError;
          
        // Fetch TP (telecommunications provider) organizations
        const { data: tpData, error: tpError } = await supabase
          .from("organizations")
          .select("id, name")
          .eq("type", "tp") // Get only TP type organizations
          .order("name");
        
        if (tpError) throw tpError;

        // Fetch event categories (nd_event_category)
        const { data: categoryData, error: categoryError } = await supabase
          .from("nd_event_category")
          .select("id, name")
          .order("name");
        if (categoryError) throw categoryError;
        setCategoryOptions((categoryData || []).map((item: any) => ({ id: item.id, name: item.name })));

        // Fetch pillars (nd_event_subcategory) with category_id 1 or 2
        const { data: pillarData, error: pillarError } = await supabase
          .from("nd_event_subcategory")
          .select("id, name, category_id")
          .in("category_id", [1, 2])
          .order("name");
        if (pillarError) throw pillarError;
        // Deduplicate by name (case-insensitive)
        const uniquePillars = (pillarData || []).filter((item: any, idx: number, arr: any[]) =>
          arr.findIndex((p: any) => p.name.trim().toLowerCase() === item.name.trim().toLowerCase()) === idx
        );
        setPillarOptions(uniquePillars.map((item: any) => ({ id: item.id, name: item.name, category_id: item.category_id })));

        // Fetch programs (nd_event_program) with subcategory_id that belongs to pillars with category_id 1 or 2
        const pillarIds = uniquePillars.map((item: any) => item.id);
        const { data: programData, error: programError } = await supabase
          .from("nd_event_program")
          .select("id, name, subcategory_id")
          .in("subcategory_id", pillarIds)
          .order("name");
        if (programError) throw programError;
        // Deduplicate by name (case-insensitive)
        const uniquePrograms = (programData || []).filter((item: any, idx: number, arr: any[]) =>
          arr.findIndex((p: any) => p.name.trim().toLowerCase() === item.name.trim().toLowerCase()) === idx
        );
        setProgramOptions(uniquePrograms.map((item: any) => ({ id: item.id, name: item.name, subcategory_id: item.subcategory_id })));

        // Set the filter data - convert numeric IDs to strings to match interface definitions
        setPhases(phasesData.map(phase => ({
          id: String(phase.id),
          name: phase.name
        })));

        setDusps(orgsData.map(org => ({
          id: String(org.id),
          name: org.name
        })));

        setNadiSites(sitesData.map(site => ({
          id: String(site.id),
          sitename: site.sitename,
          standard_code: site.standard_code
        })));        setTpProviders(tpData.map(provider => ({
          id: String(provider.id),
          name: provider.name
        })));
      } catch (error: any) {
        console.error("Error fetching filter data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);
  return {
    phases,
    dusps,
    nadiSites,
    tpProviders,
    categoryOptions,
    pillarOptions,
    programOptions,
    loading,
    error
  };
};
