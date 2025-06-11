import { useUserMetadata } from '@/hooks/use-user-metadata';
import DataTable, { Column } from '@/components/ui/datatable';
import React from 'react'

const Phase = () => {
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const userGroup = parsedMetadata?.user_group;
    const userType = parsedMetadata?.user_type;
    const organizationId = parsedMetadata?.organization_id;
    const siteId = parsedMetadata?.group_profile?.site_profile_id;

    // Dummy data for the DataTable
    const data = [
        { id: 1, name: "Phase 1", status: "Completed", startDate: "2025-01-01", endDate: "2025-03-01" },
        { id: 2, name: "Phase 2", status: "In Progress", startDate: "2025-04-01", endDate: "2025-06-01" },
        { id: 3, name: "Phase 3", status: "Not Started", startDate: "2025-07-01", endDate: "2025-09-01" },
    ];

    const columns: Column[] = [
        { key: (_, i) => `${i + 1}.`, header: "No", width: "5%", visible: true },
        { key: "name", header: "Phase Name", filterable: true, visible: false, filterType: "string" },
        { key: "status", header: "Status", filterable: true, visible: true, filterType: "string" },
        { key: "startDate", header: "Start Date", filterable: true, visible: true, filterType: "date",width: "10%" },
        { key: "endDate", header: "End Date", filterable: true, visible: true, filterType: "date",width: "10%" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Phase Management</h1>
            <DataTable data={data} columns={columns} pageSize={2} isLoading={false} />
        </div>
    )
}

export default Phase;