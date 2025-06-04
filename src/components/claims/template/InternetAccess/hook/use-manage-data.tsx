export interface ManageInternetServiceData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    technology: string; // e.g., "Fiber", "DSL", etc.
    bandwidth: string; // e.g., "100 Mbps", "1 Gbps", etc.
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for ManageInternetService data
 * This function is used by ManageInternetService.tsx to fetch ManageInternetService data directly without React hooks
 */
export const fetchManageInternetServiceData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching ManageInternetService data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const manage = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            technology: "Fiber",
            bandwidth: "100 Mbps"
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            technology: "DSL",
            bandwidth: "50 Mbps"
        }       ,
        {
            site_id: "3",
            standard_code: "SC003",
            site_name: "Site C",
            refId: "REF003",
            state: "State C",
            technology: "Satellite",
            bandwidth: "25 Mbps"
        },
        {
            site_id: "4",
            standard_code: "SC004",
            site_name: "Site D",
            refId: "REF004",
            state: "State D",
            technology: "Cable",
            bandwidth: "200 Mbps"
        },
        {
            site_id: "5",
            standard_code: "SC005",
            site_name: "Site E",
            refId: "REF005",
            state: "State E",
            technology: "Fiber",
            bandwidth: "1 Gbps"
        },
        {
            site_id: "6",
            standard_code: "SC006",
            site_name: "Site F",
            refId: "REF006",
            state: "State F",
            technology: "DSL",
            bandwidth: "10 Mbps"
        },
        {
            site_id: "7",
            standard_code: "SC007",
            site_name: "Site G",
            refId: "REF007",
            state: "State G",
            technology: "Fiber",
            bandwidth: "500 Mbps"
        },
        {
            site_id: "8",
            standard_code: "SC008",
            site_name: "Site H",
            refId: "REF008",
            state: "State H",
            technology: "Satellite",
            bandwidth: "15 Mbps"
        },
        {
            site_id: "9",
            standard_code: "SC009",
            site_name: "Site I",
            refId: "REF009",
            state: "State I",
            technology: "Cable",
            bandwidth: "300 Mbps"
        },
        {
            site_id: "10",
            standard_code: "SC010",
            site_name: "Site J",
            refId: "REF010",
            state: "State J",
            technology: "Fiber",
            bandwidth: "200 Mbps"
        },
        {
            site_id: "11",
            standard_code: "SC011",
            site_name: "Site K",
            refId: "REF011",
            state: "State K",
            technology: "DSL",
            bandwidth: "20 Mbps"
        },
        {
            site_id: "12",
            standard_code: "SC012",
            site_name: "Site L",
            refId: "REF012",
            state: "State L",
            technology: "Satellite",
            bandwidth: "30 Mbps"
        },
        {
            site_id: "13",
            standard_code: "SC013",
            site_name: "Site M",
            refId: "REF013",
            state: "State M",
            technology: "Cable",
            bandwidth: "150 Mbps"
        },
        {
            site_id: "14",
            standard_code: "SC014",
            site_name: "Site N",
            refId: "REF014",
            state: "State N",
            technology: "Fiber",
            bandwidth: "1 Gbps"
        },
        {
            site_id: "15",
            standard_code: "SC015",
            site_name: "Site O",
            refId: "REF015",
            state: "State O",
            technology: "DSL",
            bandwidth: "100 Mbps"
        },
        {
            site_id: "16",
            standard_code: "SC016",
            site_name: "Site P",
            refId: "REF016",
            state: "State P",
            technology: "Satellite",
            bandwidth: "50 Mbps"
        },
        {
            site_id: "17",
            standard_code: "SC017",
            site_name: "Site Q",
            refId: "REF017",
            state: "State Q",
            technology: "Cable",
            bandwidth: "75 Mbps"
        },
        {
            site_id: "18",
            standard_code: "SC018",
            site_name: "Site R",
            refId: "REF018",
            state: "State R",
            technology: "Fiber",
            bandwidth: "500 Mbps"
        },
        {
            site_id: "19",
            standard_code: "SC019",
            site_name: "Site S",
            refId: "REF019",
            state: "State S",
            technology: "DSL",
            bandwidth: "200 Mbps"
        },
        {
            site_id: "20",
            standard_code: "SC020",
            site_name: "Site T",
            refId: "REF020",
            state: "State T",
            technology: "Satellite",
            bandwidth: "100 Mbps"
        },
        {
            site_id: "21",
            standard_code: "SC021",
            site_name: "Site U",
            refId: "REF021",
            state: "State U",
            technology: "Cable",
            bandwidth: "250 Mbps"
        },
        {
            site_id: "22",
            standard_code: "SC022",
            site_name: "Site V",
            refId: "REF022",
            state: "State V",
            technology: "Fiber",
            bandwidth: "1 Gbps"
        },
        {
            site_id: "23",
            standard_code: "SC023",
            site_name: "Site W",
            refId: "REF023",
            state: "State W",
            technology: "DSL",
            bandwidth: "150 Mbps"
        },
        {
            site_id: "24",
            standard_code: "SC024",
            site_name: "Site X",
            refId: "REF024",
            state: "State X",
            technology: "Satellite",
            bandwidth: "200 Mbps"
        },
        {
            site_id: "25",
            standard_code: "SC025",
            site_name: "Site Y",
            refId: "REF025",
            state: "State Y",
            technology: "Cable",
            bandwidth: "300 Mbps"
        }
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        manage: manage as ManageInternetServiceData[]
    };
}

// For backward compatibility
export default fetchManageInternetServiceData;

