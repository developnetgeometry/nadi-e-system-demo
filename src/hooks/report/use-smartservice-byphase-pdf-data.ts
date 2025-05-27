import { useEffect, useState } from "react";

// Types for the PDF data
export interface Program {
    name: string;
    no_of_programme: number | null;
    no_of_participation: number | null;
}
export interface PillarData {
    pillar: string;
    programs: Program[];
}

export interface programmeImplementedData {
    id: string;
    site_id?: string;
    sitename?: string;
    state?: string;
    programme_name?: string;
    programme_method?: string;
    programme_date?: string;
    programme_participation?: number;
}

export  interface programmeParticipationData{
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

// This hook fetches Smart Service by Phase data for PDF generation
export function useSmartServiceByPhasePdfData(
    duspFilter: (string | number)[] | null,
    phaseFilter: string | number | null,
    monthFilter: string | number | null,
    yearFilter: string | number | null,
    tpFilter?: (string | number)[] | null,
) {
    const [data, setData] = useState<{
        pillarData: PillarData[]
        programmeImplementedData?: programmeImplementedData[]
        programmeParticipationData?: programmeParticipationData[]
    }>({
        pillarData: [],
        programmeImplementedData: [],
        programmeParticipationData: []
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setData({
            pillarData: [
                {
                    pillar: "ENTREPRENEUR",
                    programs: [
                        { name: "ENTREPRENEUR", no_of_programme: 13, no_of_participation: 13 },
                        { name: "EMPOWERHER", no_of_programme: 13, no_of_participation: 13 },
                        { name: "*KIDVENTURE", no_of_programme: null, no_of_participation: null },
                    ],
                },
                {
                    pillar: "LIFELONG LEARNING",
                    programs: [
                        { name: "TINY TECHIES", no_of_programme: 13, no_of_participation: 13 },
                        { name: "NURTURE (DILEA & CYBERSECURITY)", no_of_programme: 13, no_of_participation: 13 },
                        { name: "NURTURE (EKELAS & EKELAS USAHAWAN)", no_of_programme: 12, no_of_participation: 10 },
                        { name: "SKILL FORGE (ESPORT)", no_of_programme: 13, no_of_participation: 13 },
                        { name: "SKILL FORGE (MAHIR)", no_of_programme: 120, no_of_participation: 110 },
                    ],
                },
                {
                    pillar: "WELLBEING",
                    programs: [
                        { name: "FLOURISHER", no_of_programme: 13, no_of_participation: 13 },
                        { name: "MENWELL", no_of_programme: 13, no_of_participation: 13 },
                        { name: "CARE", no_of_programme: 0, no_of_participation: 0 },
                    ],
                },
                {
                    pillar: "AWARENESS",
                    programs: [
                        { name: "SAFE", no_of_programme: 13, no_of_participation: 13 },
                        { name: "SHEILD", no_of_programme: 13, no_of_participation: 13 },
                    ],
                },
                {
                    pillar: "GOVERNMENT INITIATIVES",
                    programs: [
                        { name: "GOVERNMENT INITIATIVES", no_of_programme: 13, no_of_participation: 13 },
                    ],
                },
            ],
            programmeImplementedData: [
                {
                    id: "1",
                    site_id: "101",
                    sitename: "Site Alpha",
                    state: "Selangor",
                    programme_name: "ENTREPRENEUR",
                    programme_method: "Online",
                    programme_date: "2023-01-15",
                    programme_participation: 50,
                },
                {
                    id: "2",
                    site_id: "102",
                    sitename: "Site Beta",
                    state: "Kuala Lumpur",
                    programme_name: "EMPOWERHER",
                    programme_method: "Offline",
                    programme_date: "2023-02-20",
                    programme_participation: 30,
                },
            ],

            programmeParticipationData: [
                {
                    id: "1",
                    programme_name: "ENTREPRENEUR",
                    programme_date: "2023-01-15",
                    participant_name: "Alice",
                    participant_ic: "123456789012",
                    participant_phone: "0123456789",
                    participant_age: "30",
                    participant_gender: "F",
                    participant_race: "MALAY",
                    participant_oku: "NO",
                    participant_membership: "ACTIVE"
                },
                {
                    id: "2",
                    programme_name: "EMPOWERHER",
                    programme_date: "2023-02-20",
                    participant_name: "Bob",
                    participant_ic: "987654321098",
                    participant_phone: "0987654321",
                    participant_age: "28",
                    participant_gender: "M",
                    participant_race: "MALAY",
                    participant_oku: "NO",
                    participant_membership: "ACTIVE"
                }
            ]
            
        });
        setLoading(false);
        setError(null);
    }, []); // Only run once on mount

    return { ...data, loading, error };
}
