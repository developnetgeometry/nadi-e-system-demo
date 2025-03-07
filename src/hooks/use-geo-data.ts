import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const useGeoData = () => {
  const [districts, setDistricts] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const { data, error } = await supabase.from("nd_district").select("id, state_id, code, name");
        if (error) throw error;
        setDistricts(data);
      } catch (error) {
        console.error("Error fetching districts:", error);
        setError(error.message);
      }
    };

    const fetchStates = async () => {
      try {
        const { data, error } = await supabase.from("nd_state").select("id, region_id, code, abbr, name");
        if (error) throw error;
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
        setError(error.message);
      }
    };

    fetchDistricts();
    fetchStates();
  }, []);

  return { districts, states, error };
};

export default useGeoData;