import { supabase } from "@/integrations/supabase/client";

export interface AwarenessPromotionData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    programme_name: string;
    programme_date: string;
    attachments_path?: string[]; // Optional, if there are attachments
}


/**
 * Data fetching function (non-hook) for Awareness Promotion data
 * This function is used by AwarenessPromotion.tsx to fetch Awareness Promotion data directly without React hooks
 */


export const fetchAwarenessPromotionData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching Awareness Promotion data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    let query = supabase
        .from("nd_event")
        .select(`
            id,
            category_id,
            subcategory_id,
            program_id,
            status_id,
            site_id:nd_site(
                id,
                standard_code,
                refid_mcmc,
                site_profile_id:nd_site_profile(
                    id,
                    sitename,
                    state_id:nd_state(name)
                )
            ),
            program_name,
            start_datetime,
            end_datetime
        `)
        .eq('category_id', 3)
        .eq('subcategory_id', 11)
        .eq('program_id', 43);

    // Apply date filters if provided
    if (startDate && endDate) {
        query = query.gte('start_datetime', startDate).lte('end_datetime', endDate);
    }



    // Apply nadi filter if provided and not empty
    if (nadiFilter && nadiFilter.length > 0) {
        // Use the raw column name for filtering, not the joined object
        query = query.in('site_id.site_profile_id.id', nadiFilter);
    }


    const { data: eventData, error } = await query;

    // console.log("Awareness Promotion data fetched:", eventData);

    if (error || !Array.isArray(eventData)) {
        console.error("Error fetching Awareness Promotion data:", error);
        return { anp: [] };
    }

    // Simple mapping with optional chaining for safety
    const anp = eventData.map(event => ({
        site_id: event.site_id?.site_profile_id?.id || '',
        standard_code: event.site_id?.standard_code || '',
        site_name: event.site_id?.site_profile_id?.sitename || '',
        refId: event.site_id?.refid_mcmc || '',
        state: event.site_id?.site_profile_id?.state_id?.name || '',
        programme_name: event.program_name || '',
        programme_date: event.start_datetime ? new Date(event.start_datetime).toISOString().split('T')[0] : '',
    }));

    return { anp:anp as AwarenessPromotionData[] };
}

// For backward compatibility
export default fetchAwarenessPromotionData;