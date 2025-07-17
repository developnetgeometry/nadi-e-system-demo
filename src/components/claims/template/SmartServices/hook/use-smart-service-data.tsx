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
 * Data fetching function (non-hook) for SmartService data
 * This function is used internally to fetch data for a single site
 */
const fetchSmartServiceData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    siteId = null,
    tpFilter = null,
}) => {
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

    if (siteId) {
        // Filter for specific site
        query = query.eq('site_id.site_profile_id.id', siteId);
    }



    const { data: eventData, error } = await query;

    console.log("Even data fetched:", eventData);

    // Get the lookup structure as template (always fetch this)
    const subcategoryLookup = await fetchSubcategoryProgramLookup();

    if (error || !Array.isArray(eventData)) {
        console.error("Error fetching event data:", error);
        
        // Return lookup structure with null values instead of empty arrays
        const pillarData = subcategoryLookup.map(subcategory => ({
            pillar: subcategory.subcategory_name,
            programs: subcategory.programs.map(program => ({
                name: program.name,
                no_of_programme: null,
                no_of_participation: null
            }))
        }));
        
        return { 
            pillarData: pillarData as PillarData[], 
            programmeImplementedData: [], 
            programmeParticipationData: [] 
        };
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

    // Create pillar data using lookup structure and map actual event data
    const pillarData = subcategoryLookup.map(subcategory => {
        const pillar = {
            pillar: subcategory.subcategory_name,
            programs: subcategory.programs.map(program => {
                // Count actual events for this program
                const programEvents = eventData.filter(event => 
                    event.program_id?.name === program.name &&
                    event.program_id?.subcategory_id?.name === subcategory.subcategory_name
                );
                
                const no_of_programme = programEvents.length > 0 ? programEvents.length : null;
                const no_of_participation = programEvents.length > 0 ? 
                    programEvents.reduce((sum, event) => sum + (event.nd_event_participant?.length || 0), 0) : null;
                
                return {
                    name: program.name,
                    no_of_programme,
                    no_of_participation
                };
            })
        };
        return pillar;
    });

    return {
        pillarData: pillarData as PillarData[],
        programmeImplementedData: programmeImplementedData as programmeImplementedData[],
        programmeParticipationData: programmeParticipationData as programmeParticipationData[]
    };
}

/**
 * Fetch subcategory and program lookup data in a simplified format
 * Returns subcategories (a, b, c, d, e) with all their programs from both categories
 */
const fetchSubcategoryProgramLookup = async () => {
    try {
        const { data: subcategoryData, error } = await supabase
            .from("nd_event_subcategory")
            .select(`
                id,
                name,
                category_id,
                nd_event_program (
                    id,
                    name,
                    description
                )
            `)
            .in('category_id', [1, 2])
            .eq('is_active', true)
            .order('name');

        if (error) {
            console.error("Error fetching subcategory lookup data:", error);
            return [];
        }

        // Group by subcategory name and collect all programs
        const subcategoryMap = new Map();

        subcategoryData?.forEach(subcategory => {
            const subcategoryName = subcategory.name;
            
            if (!subcategoryMap.has(subcategoryName)) {
                subcategoryMap.set(subcategoryName, {
                    subcategory_ids: [subcategory.id],
                    subcategory_name: subcategoryName,
                    programs: []
                });
            } else {
                // Add subcategory ID if not already present
                const lookup = subcategoryMap.get(subcategoryName);
                if (!lookup.subcategory_ids.includes(subcategory.id)) {
                    lookup.subcategory_ids.push(subcategory.id);
                }
            }

            const lookup = subcategoryMap.get(subcategoryName);
            const programs = subcategory.nd_event_program || [];

            // Add programs with category info, but deduplicate by program name
            programs.forEach(program => {
                // Check if program with same name already exists
                const existingProgram = lookup.programs.find(p => p.name === program.name);
                
                if (!existingProgram) {
                    // Add new program with category IDs array and IDs array
                    lookup.programs.push({
                        ids: [program.id],
                        name: program.name,
                        category_ids: [subcategory.category_id]
                    });
                } else {
                    // Add category_id to existing program if not already present
                    if (!existingProgram.category_ids.includes(subcategory.category_id)) {
                        existingProgram.category_ids.push(subcategory.category_id);
                    }
                    
                    // Add program ID if not already present
                    if (!existingProgram.ids.includes(program.id)) {
                        existingProgram.ids.push(program.id);
                    }
                }
            });
        });

        return Array.from(subcategoryMap.values());

    } catch (error) {
        console.error("Error in fetchSubcategoryProgramLookup:", error);
        return [];
    }
};

/**
 * Fetch site information for filtered sites
 */
export const fetchSiteData = async (nadiFilter: (string | number)[]) => {
    try {
        let query = supabase
            .from("nd_site_profile")
            .select(`
                id,
                sitename,
                state_id:nd_state(name),
                nd_site(
                    id,
                    standard_code,
                    refid_mcmc
                )
            `);

        if (nadiFilter && nadiFilter.length > 0) {
            // Convert all values to numbers for consistent typing
            const numericIds = nadiFilter.map(id => Number(id)).filter(id => !isNaN(id));
            if (numericIds.length > 0) {
                query = query.in('id', numericIds);
            }
        }

        const { data: siteData, error } = await query;

        if (error) {
            console.error("Error fetching site data:", error);
            return [];
        }

        return siteData || [];
    } catch (error) {
        console.error("Error in fetchSiteData:", error);
        return [];
    }
};

/**
 * Group smart service data by site
 */
export const fetchSmartServiceDataBySite = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    try {
        // Get site information
        const sites = await fetchSiteData(nadiFilter);
        
        const siteDataPromises = sites.map(async (site) => {
            // Fetch data for each specific site
            const data = await fetchSmartServiceData({
                startDate,
                endDate,
                duspFilter,
                phaseFilter,
                siteId: site.id, // Pass single site ID
                tpFilter
            });

            return {
                siteInfo: {
                    id: site.id,
                    nadiName: site.sitename,
                    state: site.state_id?.name || 'Unknown State',
                    siteCode: site.nd_site?.[0]?.standard_code || 'Unknown Code',
                    refId: site.nd_site?.[0]?.refid_mcmc || 'Unknown RefID'
                },
                ...data
            };
        });

        return await Promise.all(siteDataPromises);
    } catch (error) {
        console.error("Error fetching smart service data by site:", error);
        return [];
    }
};

