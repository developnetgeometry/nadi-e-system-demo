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
    programme_name?: string;
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

    console.log("Fetching  SmartService data with filters:", {
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });

    // Mock data (replace with actual API call in production)
    const pillarData = [
        {
            pillar: "ENTREPRENEUR",
            programs: [
                { name: "ENTREPRENEUR", no_of_programme: 13, no_of_participation: 13 },
                { name: "EMPOWERHER", no_of_programme: 13, no_of_participation: 13 },
                { name: "*KIDVENTURE", no_of_programme: null, no_of_participation: null },
            ]
        },
        {
            pillar: "LIFELONG LEARNING",
            programs: [
                { name: "TINY TECHIES", no_of_programme: 13, no_of_participation: 13 },
                { name: "NURTURE (DILEA & CYBERSECURITY)", no_of_programme: 13, no_of_participation: 13 },
                { name: "NURTURE (EKELAS & EKELAS USAHAWAN)", no_of_programme: 12, no_of_participation: 10 },
                { name: "SKILL FORGE (ESPORT)", no_of_programme: 13, no_of_participation: 13 },
                { name: "SKILL FORGE (MAHIR)", no_of_programme: 120, no_of_participation: 110 },
            ]
        },
        {
            pillar: "WELLBEING",
            programs: [
                { name: "FLOURISHER", no_of_programme: 13, no_of_participation: 13 },
                { name: "MENWELL", no_of_programme: 13, no_of_participation: 13 },
                { name: "CARE", no_of_programme: 0, no_of_participation: 0 },
            ]
        },
        {
            pillar: "AWARENESS",
            programs: [
                { name: "SAFE", no_of_programme: 13, no_of_participation: 13 },
                { name: "SHEILD", no_of_programme: 13, no_of_participation: 13 },
            ]
        },
        {
            pillar: "GOVERNMENT INITIATIVES",
            programs: [
                { name: "GOVERNMENT INITIATIVES", no_of_programme: 13, no_of_participation: 13 },
            ]
        }
    ];
    const programmeImplementedData = [
        {
            id: "1",
            programme_name: "Programme A",
            programme_method: "Physical",
            programme_date: "2023-10-01",
            programme_time: "10:00 AM-11:00 AM",
            programme_remarks: "Remarks for Programme A",
            programme_participation: 50,
            attachments_path: ["https://images.unsplash.com/photo-1486365227551-f3f90034a57c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyZHxlbnwwfHwwfHx8MA%3D%3D", "https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-agreement/119/site%20attachment.png"]
        },
        {
            id: "2",
            programme_name: "Programme B",
            programme_method: "Online",
            programme_date: "2023-10-02",
            programme_time: "11:00 AM-12:00 PM",
            programme_remarks: "Remarks for Programme B",
            programme_participation: 30,
            // attachments_path: ["https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-agreement/119/site%20attachment.png"]
        }
    ];
    const programmeParticipationData = [
        {
            id: "1",
            programme_name: "Programme A",
            programme_date: "2023-10-01",
            participant_name: "John Doe",
            participant_ic: "1234567890",
            participant_membership: "Member A",
            participant_phone: "0123456789",
            participant_age: "30",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "No"
        },
        {
            id: "2",
            programme_name: "Programme B",
            programme_date: "2023-10-02",
            participant_name: "Jane Smith",
            participant_ic: "0987654321",
            participant_membership: "Member B",
            participant_phone: "0987654321",
            participant_age: "28",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "No"
        }
    ];

    // Return the data in the same format as the hook
    return {
        pillarData: pillarData as PillarData[],
        programmeImplementedData: programmeImplementedData as programmeImplementedData[],
        programmeParticipationData: programmeParticipationData as programmeParticipationData[]

    };
}

// For backward compatibility
export default fetchSmartServiceData;

