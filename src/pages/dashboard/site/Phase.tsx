import { useUserMetadata } from '@/hooks/use-user-metadata';
import DataTable, { Column } from '@/components/ui/datatable';
import React from 'react';
import { Hash, FileText, Activity, Calendar, Clock, DollarSign, Percent } from 'lucide-react';

const Phase = () => {
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const userGroup = parsedMetadata?.user_group;
    const userType = parsedMetadata?.user_type;
    const organizationId = parsedMetadata?.organization_id;
    const siteId = parsedMetadata?.group_profile?.site_profile_id;    // Dummy data for the DataTable
    const data = [
        { id: 1, name: "Phase 1", status: "Completed", startDate: "2025-01-01", endDate: "2025-03-01", budget: 150000, completion: 100 },
        { id: 2, name: "Phase 2", status: "In Progress", startDate: "2025-04-01", endDate: "2025-06-01", budget: 250000, completion: 45 },
        { id: 3, name: "Phase 3", status: "Not Started", startDate: "2025-07-01", endDate: "2025-09-01", budget: 180000, completion: 0 },
    ];    const columns: Column[] = [
        { 
            key: (_, i) => `${i + 1}.`, 
            header: "No",  // Simple text header
            width: "5%", 
            visible: true 
        },
        { 
            key: "name", 
            header: (
                <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>Phase Name</span>
                </div>
            ), 
            filterable: true, 
            visible: false, 
            filterType: "string" 
        },        { 
            key: "status", 
            header: "Status",  // Simple text header 
            filterable: true, 
            visible: true, 
            filterType: "string" 
        },
        { 
            key: "startDate", 
            header: (
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Start Date</span>
                </div>
            ), 
            filterable: true, 
            visible: true, 
            filterType: "date", 
            width: "10%" 
        },
        { 
            key: "endDate", 
            header: (
                <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>End Date</span>
                </div>
            ), 
            filterable: true, 
            visible: true, 
            filterType: "date", 
            width: "10%" 
        },        { 
            key: "budget", 
            header: (
                <div className="flex items-center gap-2 text-green-600">
                    <DollarSign size={16} />
                    <span>Budget (RM)</span>
                </div>
            ), 
            filterable: true, 
            visible: true, 
            filterType: "number", 
            width: "12%" 
        },
        { 
            key: "completion", 
            header: (
                <div className="flex items-center gap-2">
                    <Percent size={16} />
                    <span>Completion</span>
                </div>
            ), 
            filterable: true, 
            visible: true, 
            filterType: "number", 
            width: "10%" 
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Phase Management</h1>
            <DataTable data={data} columns={columns} pageSize={2} isLoading={false} />
        </div>
    )
}

export default Phase;