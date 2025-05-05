import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

interface StaffSite {
  id: string;
  sitename: string;
}

/**
 * Hook to get all sites that a staff user is assigned to
 * This is used to determine which site closures a staff user can see
 */
export const useStaffSites = () => {
  const [staffSites, setStaffSites] = useState<StaffSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStaffSites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // First check if the user has an associated staff profile
        const { data: staffProfile, error: staffProfileError } = await supabase
          .from("nd_staff_profile")
          .select("id")
          .eq("user_id", user.id)
          .single();
          
        if (staffProfileError) {
          if (staffProfileError.code === 'PGRST116') {
            // No staff profile found
            setStaffSites([]);
            return;
          }
          throw staffProfileError;
        }
        
        if (!staffProfile) {
          setStaffSites([]);
          return;
        }
        
        // Method 1: Check staff job assignments
        const { data: staffJobs, error: jobsError } = await supabase
          .from("nd_staff_job")
          .select(`
            site_id,
            nd_site_profile:site_id (
              id, 
              sitename
            )
          `)
          .eq("staff_id", staffProfile.id)
          .eq("is_active", true);
          
        if (jobsError) throw jobsError;
        
        // Method 2: Check staff contracts as backup
        const { data: staffContracts, error: contractsError } = await supabase
          .from("nd_staff_contract")
          .select(`
            site_profile_id,
            nd_site_profile:site_profile_id (
              id, 
              sitename
            )
          `)
          .eq("user_id", user.id)
          .eq("is_active", true);
          
        if (contractsError) throw contractsError;
        
        // Combine results from both queries
        const sitesFromJobs = staffJobs
          ? staffJobs
              .filter(job => job.nd_site_profile)
              .map(job => ({
                id: job.nd_site_profile.id,
                sitename: job.nd_site_profile.sitename
              }))
          : [];
          
        const sitesFromContracts = staffContracts
          ? staffContracts
              .filter(contract => contract.nd_site_profile)
              .map(contract => ({
                id: contract.nd_site_profile.id,
                sitename: contract.nd_site_profile.sitename
              }))
          : [];
          
        // Combine and remove duplicates based on site ID
        const combinedSites = [...sitesFromJobs, ...sitesFromContracts];
        const uniqueSites = Array.from(
          new Map(combinedSites.map(site => [site.id, site])).values()
        );
        
        setStaffSites(uniqueSites);
      } catch (err) {
        console.error("Error fetching staff sites:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffSites();
  }, [user]);

  return { staffSites, isLoading, error };
};