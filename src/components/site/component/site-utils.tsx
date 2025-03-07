import { supabase } from "@/lib/supabase";

export interface Site {
    id: string;
    sitename: string;
    phase_id: string;
    region_id: string;
    active_status: number;
    nd_phases: {
        name: string;
    };
    nd_region: {
        eng: string;
    };
}

interface SiteStatus {
    id: string;
    eng: string;
}

interface Phase {
    id: string;
    name: string;
}

interface Region {
    id: string;
    eng: string;
}

interface District {
    id: string;
    name: string;
}
interface Parliament {
    id: string;
    name: string;
}
interface Dun {
    id: string;
    name: string;
}

interface Mukim {
    id: string;
    name: string;
}
interface State {
    id: string;
    name: string;
}

export const fetchSites = async (): Promise<Site[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_site_profile')
            .select(`
                *,
                nd_site:nd_site(standard_code),
                nd_phases:nd_phases(name),
                nd_region:nd_region(eng)
            `)
        .order('created_at', { ascending: false });

        // console.log('site profile:', data[0].nd_phases.name);
        // console.log('site profile:', data);
        if (error) throw error;
        return data as Site[];
    } catch (error) {
        console.error('Error fetching site profile:', error);
        throw error;
    }
};

export const fetchSiteStatus = async (): Promise<SiteStatus[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_site_status')
            .select('*');

        if (error) throw error;
        return data as SiteStatus[];
    } catch (error) {
        console.error('Error fetching status:', error);
        throw error;
    }
};

export const fetchPhase = async (): Promise<Phase[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_phases')
            .select('*');

        if (error) throw error;
        return data as Phase[];
    } catch (error) {
        console.error('Error fetching phase:', error);
        throw error;
    }
};

export const fetchRegion = async (): Promise<Region[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_region')
            .select('*');

        if (error) throw error;
        return data as Region[];
    } catch (error) {
        console.error('Error fetching region:', error);
        throw error;
    }
};

export const fetchDistrict = async (): Promise<District[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_district')
            .select('*');

        if (error) throw error;
        return data as District[];
    } catch (error) {
        console.error('Error fetching district:', error);
        throw error;
    }
};

export const fetchParliament = async (): Promise<Parliament[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_parliaments')
            .select('*');

        if (error) throw error;
        return data as Parliament[];
    } catch (error) {
        console.error('Error fetching parliament:', error);
        throw error;
    }
};
export const fetchDun = async (): Promise<Dun[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_duns')
            .select('*');

        if (error) throw error;
        return data as Dun[];
    } catch (error) {
        console.error('Error fetching dun:', error);
        throw error;
    }
};

export const fetchMukim = async (): Promise<Mukim[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_mukims')
            .select('*');

        if (error) throw error;
        return data as Mukim[];
    } catch (error) {
        console.error('Error fetching site:', error);
        throw error;
    }
};

export const fetchState = async (): Promise<State[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_state')
            .select('*');

        if (error) throw error;
        return data as State[];
    } catch (error) {
        console.error('Error fetching site:', error);
        throw error;
    }
};