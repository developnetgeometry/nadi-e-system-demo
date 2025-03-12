import { supabase } from "@/lib/supabase";

export interface Site {
    id: string;
    sitename: string;
    phase_id: string;
    region_id: string;
    active_status: number;
    nd_site_status: {
        eng: string;
    };
    nd_site: {
        standard_code: string;
    };
    nd_phases: {
        name: string;
    };
    nd_region: {
        eng: string;
    };
}

// interface SiteForm {
//     id: string;
//     sitename: string;
//     phase_id: string;
//     region_id: string;
//     active_status: number;
//     nd_phases: {
//         name: string;
//     };
//     nd_region: {
//         eng: string;
//     };
// }

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
    fullname: string;
}
interface Dun {
    id: string;
    full_name: string;
}

interface Mukim {
    id: string;
    name: string;
}
interface State {
    id: string;
    name: string;
}

interface Technology {
    id: string;
    name: string;
}
interface Bandwidth {
    id: string;
    name: string;
}
interface BuildingType {
    id: string;
    eng: string;
}
interface Zone {
    id: string;
    area: string;
    zone: string;
}
interface CategoryArea {
    id: string;
    name: string;
}
interface BuildingLevel {
    id: string;
    eng: string;
}


export const fetchSites = async (): Promise<Site[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_site_profile')
            .select(`
                *,
                nd_site_status:nd_site_status(eng),
                nd_site:nd_site(standard_code),
                nd_phases:nd_phases(name),
                nd_region:nd_region(eng),
                nd_site_address:nd_site_address(address1, address2, postcode, city,nd_district:nd_district(name))
            `)
            .order('created_at', { ascending: false });

        // console.log('site profile:', data[0].nd_phases.name);
        console.log('site profile:', data);
        if (error) throw error;
        return data as Site[];
    } catch (error) {
        console.error('Error fetching site profile:', error);
        throw error;
    }
};

// export const fetchSitesForm = async (): Promise<SiteForm[]> => {
//     try {
//         const { data, error } = await supabase
//             .from('nd_site_profile')
//             .select(`
//                 *,
//                 nd_site:nd_site(standard_code),
//                 nd_region:nd_region(eng),
//                 nd_phases:nd_phases(name),
//                 nd_parliaments:nd_parliaments(name),
//                 nd_duns:nd_duns(name),
//                 nd_mukims:nd_mukims(name),
//                 nd_state:nd_state(name),
//                 nd_site_address:nd_site_address(address1, address2, address3, postcode, city,
//                                                     nd_district:nd_district(name))
//             `)
//             .order('created_at', { ascending: false });

//         // console.log('site profile:', data[0].nd_phases.name);
//         // console.log('site profile:', data);
//         if (error) throw error;
//         return data as SiteForm[];
//     } catch (error) {
//         console.error('Error fetching site profile:', error);
//         throw error;
//     }
// };

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

export const fetchDistrict = async (stateId: string): Promise<District[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_district')
            .select('*')
            .eq('state_id', stateId);

        if (error) throw error;
        return data as District[];
    } catch (error) {
        console.error('Error fetching district:', error);
        throw error;
    }
};

export const fetchParliament = async (stateId: string): Promise<Parliament[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_parliaments')
            .select('*')
            .eq('state_id', stateId);

        if (error) throw error;
        return data as Parliament[];
    } catch (error) {
        console.error('Error fetching parliament:', error);
        throw error;
    }
};

export const fetchDun = async (parliamentid: string): Promise<Dun[]> => {
    let refid: string | null = null;
    try {
        const { data, error } = await supabase
            .from('nd_parliaments')
            .select('refid')
            .eq('id', parliamentid)
            .single();

        if (error) throw error;
        refid = data?.refid || null;
    } catch (error) {
        console.error('Error fetching refid from parliament:', error);
        throw error;
    }
    try {
        const { data, error } = await supabase
            .from('nd_duns')
            .select('*')
            .eq('rfid_parliament', refid);

        if (error) throw error;
        return data as Dun[];
    } catch (error) {
        console.error('Error fetching dun:', error);
        throw error;
    }
};

export const fetchMukim = async (districtId: string): Promise<Mukim[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_mukims')
            .select('*')
            .eq('district_id', districtId);
        if (error) throw error;
        return data as Mukim[];
    } catch (error) {
        console.error('Error fetching mukim:', error);
        throw error;
    }
};

export const fetchState = async (regionId: string): Promise<State[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_state')
            .select('*')
            .eq('region_id', regionId);

        if (error) throw error;
        return data as State[];
    } catch (error) {
        console.error('Error fetching state:', error);
        throw error;
    }
};

export const fetchTechnology = async (): Promise<Technology[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_technology')
            .select('id,name')

        if (error) throw error;
        return data as Technology[];
    } catch (error) {
        console.error('Error fetching technology:', error);
        throw error;
    }
};
export const fetchBandwidth = async (): Promise<Bandwidth[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_bandwidth')
            .select('id,name')

        if (error) throw error;
        return data as Bandwidth[];
    } catch (error) {
        console.error('Error fetching bandwidth:', error);
        throw error;
    }
};
export const fetchBuildingType = async (): Promise<BuildingType[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_building_type')
            .select('id,eng')

        if (error) throw error;
        return data as BuildingType[];
    } catch (error) {
        console.error('Error fetching building type:', error);
        throw error;
    }
};
export const fetchZone = async (): Promise<Zone[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_zone')
            .select('id,area,zone')

        if (error) throw error;
        return data as Zone[];
    } catch (error) {
        console.error('Error fetching zone:', error);
        throw error;
    }
};
export const fetchCategoryArea = async (): Promise<CategoryArea[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_category_area')
            .select('id,name')

        if (error) throw error;
        return data as CategoryArea[];
    } catch (error) {
        console.error('Error fetching category zone:', error);
        throw error;
    }
};
export const fetchBuildingLevel = async (): Promise<BuildingLevel[]> => {
    try {
        const { data, error } = await supabase
            .from('nd_building_level')
            .select('id,eng')

        if (error) throw error;
        return data as BuildingLevel[];
    } catch (error) {
        console.error('Error fetching building level:', error);
        throw error;
    }
};

export const deleteSite = async (siteId: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('nd_site_profile')
            .delete()
            .eq('id', siteId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting site:', error);
        throw error;
    }
};

