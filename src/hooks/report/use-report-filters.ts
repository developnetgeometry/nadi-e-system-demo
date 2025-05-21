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

export const useReportFilters = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [dusps, setDusps] = useState<DUSP[]>([]);
  const [nadiSites, setNadiSites] = useState<NADISite[]>([]);
  const [tpProviders, setTpProviders] = useState<TPProvider[]>([]);
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

        if (phasesError) throw phasesError;// Fetch DUSP parent organizations for filtering
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
    loading,
    error
  };
};
