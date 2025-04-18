import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const useGeneralData = () => {
  const [genders, setGenders] = useState<any[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<any[]>([]);
  const [races, setRaces] = useState<any[]>([]);
  const [religions, setReligions] = useState<any[]>([]);
  const [nationalities, setNationalities] = useState<any[]>([]);
  const [occupations, setOccupations] = useState<any[]>([]);
  const [typeSectors, setTypeSectors] = useState<any[]>([]);
  const [socioeconomics, setSocioeconomics] = useState<any[]>([]);
  const [ictKnowledge, setIctKnowledge] = useState<any[]>([]);
  const [educationLevels, setEducationLevels] = useState<any[]>([]);
  const [incomeLevels, setIncomeLevels] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const { data, error } = await supabase.from("nd_genders").select("id, eng, bm");
        if (error) throw error;
        setGenders(data);
      } catch (error) {
        console.error("Error fetching genders:", error);
        setError(error.message);
      }
    };

    const fetchMaritalStatuses = async () => {
      try {
        const { data, error } = await supabase.from("nd_marital_status").select("id, eng, bm");
        if (error) throw error;
        setMaritalStatuses(data);
      } catch (error) {
        console.error("Error fetching marital statuses:", error);
        setError(error.message);
      }
    };

    const fetchRaces = async () => {
      try {
        const { data, error } = await supabase.from("nd_races").select("id, eng, bm");
        if (error) throw error;
        setRaces(data);
      } catch (error) {
        console.error("Error fetching races:", error);
        setError(error.message);
      }
    };

    const fetchReligions = async () => {
      try {
        const { data, error } = await supabase.from("nd_religion").select("id, eng, bm");
        if (error) throw error;
        setReligions(data);
      } catch (error) {
        console.error("Error fetching religions:", error);
        setError(error.message);
      }
    };

    const fetchNationalities = async () => {
      try {
        const { data, error } = await supabase.from("nd_nationalities").select("id, eng, bm");
        if (error) throw error;
        setNationalities(data);
      } catch (error) {
        console.error("Error fetching nationalities:", error);
        setError(error.message);
      }
    };

    const fetchOccupations = async () => {
      try {
        const { data, error } = await supabase.from("nd_occupation").select("id, eng, bm");
        if (error) throw error;
        setOccupations(data);
      } catch (error) {
        console.error("Error fetching occupations:", error);
        setError(error.message);
      }
    };

    const fetchTypeSectors = async () => {
      try {
        const { data, error } = await supabase.from("nd_type_sector").select("id, eng, bm");
        if (error) throw error;
        setTypeSectors(data);
      } catch (error) {
        console.error("Error fetching type sectors:", error);
        setError(error.message);
      }
    };

    const fetchSocioeconomics = async () => {
      try {
        const { data, error } = await supabase.from("nd_socioeconomics").select("id, sector_id, eng, bm");
        if (error) throw error;
        setSocioeconomics(data);
      } catch (error) {
        console.error("Error fetching socioeconomics:", error);
        setError(error.message);
      }
    };

    const fetchIctKnowledge = async () => {
      try {
        const { data, error } = await supabase.from("nd_ict_knowledge").select("id, eng, bm");
        if (error) throw error;
        setIctKnowledge(data);
      } catch (error) {
        console.error("Error fetching ICT knowledge:", error);
        setError(error.message);
      }
    };

    const fetchEducationLevels = async () => {
      try {
        const { data, error } = await supabase.from("nd_education").select("id, eng, bm");
        if (error) throw error;
        setEducationLevels(data);
      } catch (error) {
        console.error("Error fetching education levels:", error);
        setError(error.message);
      }
    };

    const fetchIncomeLevels = async () => {
      try {
        const { data, error } = await supabase.from("nd_income_levels").select("id, eng, bm");
        if (error) throw error;
        setIncomeLevels(data);
      } catch (error) {
        console.error("Error fetching income levels:", error);
        setError(error.message);
      }
    };

    const fetchPositions = async () => {
      try {
        const { data, error } = await supabase.from("nd_position").select("id, name");
        if (error) throw error;
        setPositions(data);
      } catch (error) {
        console.error("Error fetching positions:", error);
        setError(error.message);
      }
    };

    fetchGenders();
    fetchMaritalStatuses();
    fetchRaces();
    fetchReligions();
    fetchNationalities();
    fetchOccupations();
    fetchTypeSectors();
    fetchSocioeconomics();
    fetchIctKnowledge();
    fetchEducationLevels();
    fetchIncomeLevels();
    fetchPositions();
  }, []);

  return {
    genders,
    maritalStatuses,
    races,
    religions,
    nationalities,
    occupations,
    typeSectors,
    socioeconomics,
    ictKnowledge,
    educationLevels,
    incomeLevels,
    positions,
    error,
  };
};

export default useGeneralData;