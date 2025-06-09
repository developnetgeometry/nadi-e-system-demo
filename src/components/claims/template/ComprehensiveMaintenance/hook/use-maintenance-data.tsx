export interface MaintenanceData {
    status: string;
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    docket_type: string;
    docket_issue: string;
    docket_SLA: string;
    docket_duration: string;
    docket_open: string;
    docket_close: string;
    docket_status?: string;
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for Maintenance data
 * This function is used by Maintenance.tsx to fetch Maintenance data directly without React hooks
 */
export const fetchMaintenanceData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    
    console.log("Fetching  Maintenance data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const  maintenance = [
        {
            site_id: "1",
            standard_code: "D09N009",
            site_name: "NADI Kg Gong Kulim",
            refId: "PI1M33Q",
            state: "Kelantan",
            docket_type: "Type A",
            docket_issue: "Issue A",
            docket_SLA: "Low",
            docket_duration: "1 hour",
            docket_open: "2023-10-01",
            docket_close: "2023-10-02",
            docket_status: "New"
        },
        {
            site_id: "2",
            standard_code: "D09N010",
            site_name: "NADI Kg Cengal",
            refId: "PI1M05D",
            state: "Kelantan",
            docket_type: "Type B",
            docket_issue: "Issue B",
            docket_SLA: "Critical",
            docket_duration: "2 hours",
            docket_open: "2023-10-03",
            docket_close: "2023-10-04",
            docket_status: "Closed"
        },
        {
            site_id: "3",
            standard_code: "D09N011",
            site_name: "NADI Kg Selising",
            refId: "PI1M11D",
            state: "Kelantan",
            docket_type: "Type C",
            docket_issue: "Issue C",
            docket_SLA: "High",
            docket_duration: "3 hours",
            docket_open: "2023-10-05",
            docket_close: "2023-10-06",
            docket_status: "Pending"
        },
        {
            site_id: "4",
            standard_code: "D09N012",
            site_name: "NADI Kg Repek",
            refId: "PI1M09D",
            state: "Kelantan",
            docket_type: "Type D",
            docket_issue: "Issue D",
            docket_SLA: "Low",
            docket_duration: "30 minutes",
            docket_open: "2023-10-07",
            docket_close: "2023-10-08",
            docket_status: "Existing"
        },
        {
            site_id: "5",
            standard_code: "K09N008",
            site_name: "NADI Napoh",
            refId: "PI1M10K",
            state: "Kedah",
            docket_type: "Type E",
            docket_issue: "Issue E",
            docket_SLA: "High",
            docket_duration: "4 hours",
            docket_open: "2023-10-09",
            docket_close: "2023-10-10",
            docket_status: "New"
        },
        {
            site_id: "6",
            standard_code: "A09N002",
            site_name: "NADI Kampung Baru Kuala Bikam",
            refId: "A07C011",
            state: "Perak",
            docket_type: "Type F",
            docket_issue: "Issue F",
            docket_SLA: "Moderate",
            docket_duration: "2 hours",
            docket_open: "2023-10-11",
            docket_close: "2023-10-12",
            docket_status: "Closed"
        },
        {
            site_id: "7",
            standard_code: "Q05N013",
            site_name: "NADI Kampung Seberang",
            refId: "Q05C014",
            state: "Sarawak",
            docket_type: "Type G",
            docket_issue: "Issue G",
            docket_SLA: "High",
            docket_duration: "5 hours",
            docket_open: "2023-10-13",
            docket_close: "2023-10-14",
            docket_status: "Pending"
        },
        {
            site_id: "8",
            standard_code: "S12N001",
            site_name: "NADI Kampung Sentosa Jaya",
            refId: "S10C001",
            state: "Sabah",
            docket_type: "Type H",
            docket_issue: "Issue H",
            docket_SLA: "Low",
            docket_duration: "1 hour 30 minutes",
            docket_open: "2023-10-15",
            docket_close: "2023-10-16",
            docket_status: "Existing"
        },
        {
            site_id: "9",
            standard_code: "D02N012",
            site_name: "NADI Mengkebang",
            refId: "D03C012",
            state: "Kelantan",
            docket_type: "Type I",
            docket_issue: "Issue I",
            docket_SLA: "Critical",
            docket_duration: "6 hours",
            docket_open: "2023-10-17",
            docket_close: "2023-10-18",
            docket_status: "New"
        },
        {
            site_id: "10",
            standard_code: "S11N011",
            site_name: "NADI Kg Ambong",
            refId: "CELCOM-147",
            state: "Sabah",
            docket_type: "Type J",
            docket_issue: "Issue J",
            docket_SLA: "Moderate",
            docket_duration: "45 minutes",
            docket_open: "2023-10-19",
            docket_close: "2023-10-20",
            docket_status: "Closed"
        }
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        maintenance:  maintenance as  MaintenanceData[]
    };
}

// For backward compatibility
export default fetchMaintenanceData;

