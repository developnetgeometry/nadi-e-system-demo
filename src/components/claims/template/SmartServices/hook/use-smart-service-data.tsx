import { supabase } from "@/integrations/supabase/client";

export interface PillarData {
    pillar: string;
    programs: {
        name: string;
        no_of_programme: number | null;
        no_of_participation: number | null;
    }[];

}
export interface programmeImplementedData {
    id: string;
    programme_name: string;
    programme_method?: string;
    programme_date?: string;
    programme_time?: string;
    programme_participation?: number;
    programme_remarks?: string;
    attachments_path?: string[];
}
export interface programmeParticipationData {
    id: string;
    programme_name: string;
    programme_date: string;
    participant_name: string;
    participant_ic: string;
    participant_membership: string;
    participant_phone: string;
    participant_age: string;
    participant_gender: string;
    participant_race: string;
    participant_oku: string;
}

/**
 * Data fetching function (non-hook) for  SmartService data
 * This function is used by SmartService.tsx to fetch SmartService data directly without React hooks
 */
export const fetchSmartServiceData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {

    // console.log("Fetching  SmartService data with filters:", {
    //     startDate,
    //     endDate,
    //     duspFilter,
    //     phaseFilter,
    //     nadiFilter,
    //     tpFilter
    // });

   

    let queryLookup = supabase
        .from("nd_event_category")
        .select(`
            id,
            name,
            nd_event_subcategory:nd_event_subcategory(
                id,
                name,
                category_id:nd_event_category(
                    id,
                    name
                )
            )
        `).in('id', [1, 2]);

    const { data: categoryData, error: categoryError } = await queryLookup; 

    if (categoryError) {
        console.error("Error fetching category data:", categoryError);
    }else{
        console.log("Category data fetched:", categoryData);
    }

    let query = supabase
        .from("nd_event")
        .select(`
            id,
            category_id,
            subcategory_id,
            program_id:nd_event_program(
                id,
                name,
                subcategory_id:nd_event_subcategory(
                    id,
                    name,
                    category_id:nd_event_category(
                        id,
                        name
                    )
                )
            ),
            module_id,
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
            program_method:nd_program_method(name),
            program_name,
            start_datetime,
            end_datetime,
            description,
            nd_event_participant:nd_event_participant(
                id,
                member_id:nd_member_profile(
                    id,
                    fullname,
                    identity_no,
                    status_membership:nd_status_membership(name),
                    mobile_no,
                    age,
                    gender:nd_genders(bm),
                    participant_race:nd_races(bm),
                    oku_status
                )
            )
        `)
        .in('category_id', [1, 2]);

    // Apply filters if provided
    if (startDate && endDate) {
        query = query.gte('start_datetime', startDate).lte('end_datetime', endDate);
    }

    if (nadiFilter && nadiFilter.length > 0) {
        // Use the raw column name for filtering, not the joined object
        query = query.in('site_id.site_profile_id.id', nadiFilter);
    }



    const { data: eventData, error } = await query;

    console.log("Even data fetched:", eventData);

    if (error || !Array.isArray(eventData)) {
        console.error("Error fetching even data data:", error);
        return { pillarData: [], programmeImplementedData: [], programmeParticipationData: [] };
    }

    const programmeImplementedData = eventData.map(event => ({
        id: event.id || '',
        programme_name: event.program_name || '',
        programme_method: event.program_method?.name || '',
        programme_date: event.start_datetime ? new Date(event.start_datetime).toISOString().split('T')[0] : '',
        programme_time: event.start_datetime && event.end_datetime ? `${new Date(event.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}-${new Date(event.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}` : '',
        programme_participation: event.nd_event_participant?.length || 0,
        programme_remarks: event.description || '',
    }));

    const programmeParticipationData = eventData.flatMap(event => event.nd_event_participant.map(participant => ({
        id: participant.id || '',
        programme_name: event.program_name || '',
        programme_date: event.start_datetime ? new Date(event.start_datetime).toISOString().split('T')[0] : '',
        participant_name: participant.member_id?.fullname || '',
        participant_ic: participant.member_id?.identity_no || '',
        participant_membership: participant.member_id?.status_membership?.name || '',
        participant_phone: participant.member_id?.mobile_no || '',
        participant_age: participant.member_id?.age?.toString() || '',
        participant_gender: participant.member_id?.gender?.bm || '',
        participant_race: participant.member_id?.participant_race?.bm || '',
        participant_oku: participant.member_id?.oku_status || ''
    })));


    const pillarData = eventData.reduce((pillars, event) => {
        const subcategoryName = event.program_id?.subcategory_id?.name || "Unknown Subcategory";
        const programName = event.program_id?.name || "Unknown Program";

        // Find or create the pillar (subcategory)
        let pillar = pillars.find(p => p.pillar === subcategoryName);
        if (!pillar) {
            pillar = { pillar: subcategoryName, programs: [] };
            pillars.push(pillar);
        }

        // Find or create the program within the pillar
        let program = pillar.programs.find(p => p.name === programName);
        if (!program) {
            program = { name: programName, no_of_programme: 0, no_of_participation: 0 };
            pillar.programs.push(program);
        }

        // Update program counts
        program.no_of_programme += 1;
        program.no_of_participation += event.nd_event_participant?.length || 0;

        return pillars;
        
    }, []);

    return {
        pillarData: pillarData as PillarData[],
        programmeImplementedData: programmeImplementedData as programmeImplementedData[],
        programmeParticipationData: programmeParticipationData as programmeParticipationData[]

    };
}

// For backward compatibility
export default fetchSmartServiceData;

