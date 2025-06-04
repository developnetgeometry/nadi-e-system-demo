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
                { name: "BUDI MADANI", no_of_programme: 13, no_of_participation: 13 },
            ]
        }
    ];
    const programmeImplementedData = [
        {
            id: "1",
            programme_name: "Manfaat MADANI",
            programme_method: "Physical",
            programme_date: "2023-10-01",
            programme_time: "10:00 AM-11:00 AM",
            programme_remarks: "Enhance community well-being through inclusive, sustainable, and people-centered development",
            programme_participation: 50,
            attachments_path: ["https://images.unsplash.com/photo-1486365227551-f3f90034a57c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyZHxlbnwwfHwwfHx8MA%3D%3D", "https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-agreement/119/site%20attachment.png"]
        },
        {
            id: "2",
            programme_name: "Cashless Society",
            programme_method: "Online",
            programme_date: "2023-10-02",
            programme_time: "11:00 AM-12:00 PM",
            programme_remarks: "Promotes the adoption of digital financial solutions",
            programme_participation: 30,
            // attachments_path: ["https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-agreement/119/site%20attachment.png"]
        }
    ];
    const programmeParticipationData = [
        {
            id: "1",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Ahmad Faiz",
            participant_ic: "720030042594",
            participant_membership: "Member",
            participant_phone: "0197225505",
            participant_age: "49",
            participant_gender: "M",
            participant_race: "Indian",
            participant_oku: "Yes"
        },
        {
            id: "2",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Hafiz Rahman",
            participant_ic: "118595073662",
            participant_membership: "Non-Member",
            participant_phone: "0130384708",
            participant_age: "38",
            participant_gender: "M",
            participant_race: "Others",
            participant_oku: "No"
        },
        {
            id: "3",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Raj Kumar",
            participant_ic: "581307622424",
            participant_membership: "Member",
            participant_phone: "0112836011",
            participant_age: "57",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "Yes"
        },
        {
            id: "4",
            programme_name: "Manfaat MADANI",
            programme_date: "2023-10-01",
            participant_name: "Nur Aisyah",
            participant_ic: "669333560601",
            participant_membership: "Member",
            participant_phone: "0120715561",
            participant_age: "50",
            participant_gender: "F",
            participant_race: "Chinese",
            participant_oku: "Yes"
        },
        {
            id: "5",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Amina Binti Yusuf",
            participant_ic: "889164287535",
            participant_membership: "Non-Member",
            participant_phone: "0182242087",
            participant_age: "19",
            participant_gender: "F",
            participant_race: "Indian",
            participant_oku: "No"
        },
        {
            id: "6",
            programme_name: "Manfaat MADANI",
            programme_date: "2023-10-01",
            participant_name: "Siti Zulaikha",
            participant_ic: "622492976135",
            participant_membership: "Non-Member",
            participant_phone: "0136265769",
            participant_age: "43",
            participant_gender: "F",
            participant_race: "Others",
            participant_oku: "Yes"
        },
        {
            id: "7",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Muhammad Iqbal",
            participant_ic: "557344198965",
            participant_membership: "Member",
            participant_phone: "0161836197",
            participant_age: "59",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "No"
        },
        {
            id: "8",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Chong Li Hua",
            participant_ic: "726521799030",
            participant_membership: "Non-Member",
            participant_phone: "0129024374",
            participant_age: "51",
            participant_gender: "F",
            participant_race: "Chinese",
            participant_oku: "Yes"
        },
        {
            id: "9",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Ahmad Faiz",
            participant_ic: "643301752899",
            participant_membership: "Member",
            participant_phone: "0175550896",
            participant_age: "60",
            participant_gender: "M",
            participant_race: "Chinese",
            participant_oku: "No"
        },
        {
            id: "10",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Ahmad Faiz",
            participant_ic: "293532895059",
            participant_membership: "Member",
            participant_phone: "0135818287",
            participant_age: "18",
            participant_gender: "M",
            participant_race: "Indian",
            participant_oku: "No"
        },
        {
            id: "11",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Siti Zulaikha",
            participant_ic: "326008249231",
            participant_membership: "Member",
            participant_phone: "0151504054",
            participant_age: "36",
            participant_gender: "F",
            participant_race: "Indian",
            participant_oku: "No"
        },
        {
            id: "12",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Muhammad Iqbal",
            participant_ic: "658943957895",
            participant_membership: "Member",
            participant_phone: "0176894302",
            participant_age: "33",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "No"
        },
        {
            id: "13",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Chong Li Hua",
            participant_ic: "647586726206",
            participant_membership: "Non-Member",
            participant_phone: "0151768142",
            participant_age: "42",
            participant_gender: "F",
            participant_race: "Malay",
            participant_oku: "Yes"
        },
        {
            id: "14",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Lim Wei Jie",
            participant_ic: "963422100194",
            participant_membership: "Non-Member",
            participant_phone: "0120401597",
            participant_age: "25",
            participant_gender: "M",
            participant_race: "Indian",
            participant_oku: "No"
        },
        {
            id: "15",
            programme_name: "Manfaat MADANI",
            programme_date: "2023-10-01",
            participant_name: "Siti Zulaikha",
            participant_ic: "906404711846",
            participant_membership: "Member",
            participant_phone: "0136522342",
            participant_age: "19",
            participant_gender: "F",
            participant_race: "Malay",
            participant_oku: "No"
        },
        {
            id: "16",
            programme_name: "Manfaat MADANI",
            programme_date: "2023-10-01",
            participant_name: "Lim Wei Jie",
            participant_ic: "660920147967",
            participant_membership: "Member",
            participant_phone: "0133473562",
            participant_age: "38",
            participant_gender: "M",
            participant_race: "Others",
            participant_oku: "No"
        },
        {
            id: "17",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Hafiz Rahman",
            participant_ic: "442139012381",
            participant_membership: "Member",
            participant_phone: "0184819800",
            participant_age: "23",
            participant_gender: "M",
            participant_race: "Chinese",
            participant_oku: "No"
        },
        {
            id: "18",
            programme_name: "Cashless Society",
            programme_date: "2023-10-01",
            participant_name: "Amina Binti Yusuf",
            participant_ic: "410638852647",
            participant_membership: "Member",
            participant_phone: "0113839894",
            participant_age: "48",
            participant_gender: "F",
            participant_race: "Chinese",
            participant_oku: "Yes"
        },
        {
            id: "19",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Siti Zulaikha",
            participant_ic: "929913810750",
            participant_membership: "Member",
            participant_phone: "0189972421",
            participant_age: "49",
            participant_gender: "F",
            participant_race: "Chinese",
            participant_oku: "No"
        },
        {
            id: "20",
            programme_name: "Manfaat MADANI",
            programme_date: "2023-10-02",
            participant_name: "Raj Kumar",
            participant_ic: "274829224341",
            participant_membership: "Member",
            participant_phone: "0148447181",
            participant_age: "36",
            participant_gender: "M",
            participant_race: "Chinese",
            participant_oku: "Yes"
        },
        {
            id: "21",
            programme_name: "Manfaat MADANI",
            programme_date: "2023-10-02",
            participant_name: "Lim Wei Jie",
            participant_ic: "630247024377",
            participant_membership: "Member",
            participant_phone: "0177774396",
            participant_age: "46",
            participant_gender: "M",
            participant_race: "Others",
            participant_oku: "No"
        },
        {
            id: "22",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Lim Wei Jie",
            participant_ic: "808636336786",
            participant_membership: "Member",
            participant_phone: "0131657478",
            participant_age: "38",
            participant_gender: "M",
            participant_race: "Others",
            participant_oku: "No"
        },
        {
            id: "23",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Nur Aisyah",
            participant_ic: "956838115031",
            participant_membership: "Member",
            participant_phone: "0171571029",
            participant_age: "32",
            participant_gender: "F",
            participant_race: "Indian",
            participant_oku: "Yes"
        },
        {
            id: "24",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Raj Kumar",
            participant_ic: "245590045430",
            participant_membership: "Member",
            participant_phone: "0119097033",
            participant_age: "49",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "No"
        },
        {
            id: "25",
            programme_name: "Manfaat MADANI",
            programme_date: "2023-10-02",
            participant_name: "Amina Binti Yusuf",
            participant_ic: "117251568377",
            participant_membership: "Member",
            participant_phone: "0132621562",
            participant_age: "21",
            participant_gender: "F",
            participant_race: "Indian",
            participant_oku: "Yes"
        },
        {
            id: "26",
            programme_name: "Manfaat MADANI",
            programme_date: "2023-10-02",
            participant_name: "Siti Zulaikha",
            participant_ic: "187661503672",
            participant_membership: "Member",
            participant_phone: "0162869403",
            participant_age: "59",
            participant_gender: "F",
            participant_race: "Others",
            participant_oku: "Yes"
        },
        {
            id: "27",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Muhammad Iqbal",
            participant_ic: "387600618929",
            participant_membership: "Member",
            participant_phone: "0194005310",
            participant_age: "53",
            participant_gender: "M",
            participant_race: "Chinese",
            participant_oku: "No"
        },
        {
            id: "28",
            programme_name: "Manfaat MADANI",
            programme_date: "2023-10-02",
            participant_name: "Nur Aisyah",
            participant_ic: "340425519336",
            participant_membership: "Member",
            participant_phone: "0125692630",
            participant_age: "53",
            participant_gender: "F",
            participant_race: "Indian",
            participant_oku: "Yes"
        },
        {
            id: "29",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Raj Kumar",
            participant_ic: "852181930651",
            participant_membership: "Member",
            participant_phone: "0187439470",
            participant_age: "43",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "Yes"
        },
        {
            id: "30",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Siti Zulaikha",
            participant_ic: "855181168660",
            participant_membership: "Non-Member",
            participant_phone: "0111567817",
            participant_age: "47",
            participant_gender: "F",
            participant_race: "Indian",
            participant_oku: "Yes"
        },
        {
            id: "31",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Chong Li Hua",
            participant_ic: "816848043151",
            participant_membership: "Non-Member",
            participant_phone: "0146703910",
            participant_age: "32",
            participant_gender: "F",
            participant_race: "Chinese",
            participant_oku: "Yes"
        },
        {
            id: "32",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Hafiz Rahman",
            participant_ic: "336681465881",
            participant_membership: "Member",
            participant_phone: "0185286640",
            participant_age: "49",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "No"
        },
        {
            id: "33",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Muhammad Iqbal",
            participant_ic: "599264874107",
            participant_membership: "Non-Member",
            participant_phone: "0141184186",
            participant_age: "21",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "No"
        },
        {
            id: "34",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Raj Kumar",
            participant_ic: "780024193727",
            participant_membership: "Non-Member",
            participant_phone: "0147787425",
            participant_age: "31",
            participant_gender: "M",
            participant_race: "Others",
            participant_oku: "No"
        },
        {
            id: "35",
            programme_name: "Cashless Society",
            programme_date: "2023-10-02",
            participant_name: "Lim Wei Jie",
            participant_ic: "677198830400",
            participant_membership: "Non-Member",
            participant_phone: "0139586463",
            participant_age: "26",
            participant_gender: "M",
            participant_race: "Malay",
            participant_oku: "Yes"
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

