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
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            docket_type: "Type A",
            docket_issue: "Issue A",
            docket_SLA: "minor",
            docket_duration: "1 hour",
            docket_open: "2023-10-01",
            docket_close: "2023-10-02",
            docket_status: "New"
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            docket_type: "Type B",
            docket_issue: "Issue B",
            docket_SLA: "major",
            docket_duration: "2 hours",
            docket_open: "2023-10-03",
            docket_close: "2023-10-04",
            docket_status: "Closed"
        },
        {
            site_id: "3",
            standard_code: "SC003",
            site_name: "Site C",
            refId: "REF003",
            state: "State C",
            docket_type: "Type C",
            docket_issue: "Issue C",
            docket_SLA: "major",
            docket_duration: "3 hours",
            docket_open: "2023-10-05",
            docket_close: "2023-10-06",
            docket_status: "Pending"
        },
        {
            site_id: "4",
            standard_code: "SC004",
            site_name: "Site D",
            refId: "REF004",
            state: "State D",
            docket_type: "Type D",
            docket_issue: "Issue D",
            docket_SLA: "minor",
            docket_duration: "30 minutes",
            docket_open: "2023-10-07",
            docket_close: "2023-10-08",
            docket_status: "Existing"
        },
        {
            site_id: "5",
            standard_code: "SC005",
            site_name: "Site E",
            refId: "REF005",
            state: "State E",
            docket_type: "Type E",
            docket_issue: "Issue E",
            docket_SLA: "major",
            docket_duration: "4 hours",
            docket_open: "2023-10-09",
            docket_close: "2023-10-10",
            docket_status: "New"
        },
        {
            site_id: "6",
            standard_code: "SC006",
            site_name: "Site F",
            refId: "REF006",
            state: "State F",
            docket_type: "Type F",
            docket_issue: "Issue F",
            docket_SLA: "minor",
            docket_duration: "2 hours",
            docket_open: "2023-10-11",
            docket_close: "2023-10-12",
            docket_status: "Closed"
        },
        {
            site_id: "7",
            standard_code: "SC007",
            site_name: "Site G",
            refId: "REF007",
            state: "State G",
            docket_type: "Type G",
            docket_issue: "Issue G",
            docket_SLA: "major",
            docket_duration: "5 hours",
            docket_open: "2023-10-13",
            docket_close: "2023-10-14",
            docket_status: "Pending"
        },
        {
            site_id: "8",
            standard_code: "SC008",
            site_name: "Site H",
            refId: "REF008",
            state: "State H",
            docket_type: "Type H",
            docket_issue: "Issue H",
            docket_SLA: "minor",
            docket_duration: "1 hour 30 minutes",
            docket_open: "2023-10-15",
            docket_close: "2023-10-16",
            docket_status: "Existing"
        },
        {
            site_id: "9",
            standard_code: "SC009",
            site_name: "Site I",
            refId: "REF009",
            state: "State I",
            docket_type: "Type I",
            docket_issue: "Issue I",
            docket_SLA: "major",
            docket_duration: "6 hours",
            docket_open: "2023-10-17",
            docket_close: "2023-10-18",
            docket_status: "New"
        },
        {
            site_id: "10",
            standard_code: "SC010",
            site_name: "Site J",
            refId: "REF010",
            state: "State J",
            docket_type: "Type J",
            docket_issue: "Issue J",
            docket_SLA: "minor",
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

