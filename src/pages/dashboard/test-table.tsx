import { useUserMetadata } from '@/hooks/use-user-metadata';
import DataTable, { Column } from '@/components/ui/datatable';
import React from 'react';
import { Hash, FileText, Activity, Calendar, Clock, DollarSign, Percent, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

const TestTable = () => {
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const userGroup = parsedMetadata?.user_group;
    const userType = parsedMetadata?.user_type;
    const organizationId = parsedMetadata?.organization_id;
    const siteId = parsedMetadata?.group_profile?.site_profile_id;

    const { toast } = useToast();


    // Handle view phase details
    const handleViewPhase = (phaseId: number) => {
        toast({
            title: `Viewing Phase ${phaseId} details`,
            // variant: "destructive",
        });
        // Add your logic here, like navigation to phase details page
        // e.g., router.push(`/dashboard/site/phase/${phaseId}`);
    };

    // Handle delete phase
    const handleDeletePhase = (phaseId: number) => {
        toast({
            title: `Deleted Phase ${phaseId} `,
            variant: "destructive",
        });
    };

    // Dummy data for the DataTable
    const data = [
        { id: 1, name: "Phase 1", status: "Completed", startDate: "2025-01-01", endDate: "2025-03-01", budget: 150000, completion: 100, lastUpdate: "2025-03-01T14:30:00" },
        { id: 2, name: "Phase 2", status: "In Progress", startDate: "2025-04-01", endDate: "2025-06-01", budget: 250000, completion: 45, lastUpdate: "2025-02-20T11:15:00" },
        { id: 3, name: "Phase 3", status: "Not Started", startDate: "2025-07-01", endDate: "2025-09-01", budget: 180000, completion: 0, lastUpdate: "2025-02-20T11:15:00" },
    ];

    // Define columns for the DataTable 
    const columns: Column[] = [{
        key: (_, i) => `${i + 1}.`,
        header: "No",  // Simple text header
        width: "5%",
        visible: true,
        align: "center"
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
    }, {
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
        width: "10%",
        align: "center"
    }, {
        key: "budget",
        header: (
            <div className="flex items-center gap-2 text-green-600">
                <DollarSign size={16} />
                <span>Budget (RM)</span>
            </div>
        ),
        render: (value) => `RM ${value.toLocaleString()}`,
        align: "right",
        filterable: true,
        visible: true,
        filterType: "number",
        width: "12%"
    }, {
        key: "completion",
        header: (
            <div className="flex items-center gap-2">
                <Percent size={16} />
                <span>Completion</span>
            </div>
        ),
        // filterable: false, 
        visible: true,
        // filterType: "number", 
        width: "10%",
        align: "center"
    },
    {
        key: "lastUpdate",
        header: (
            <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Last Update</span>
            </div>
        ),
        render: (value) => {
            const date = new Date(value);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        },
        visible: true,
        width: "15%",
        align: "center"
    },
    {
        key: (row) => (
            <div className="flex items-center space-x-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    onClick={() => handleViewPhase(row.id)}
                >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                    onClick={() => handleDeletePhase(row.id)}
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </div>
        ),
        header: "Actions",
        align: "center",
        width: "10%",
        visible: true,
    },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">DataTable Component Showcase</h1>
                <p className="text-gray-500 mb-6">A reusable table component with sorting, filtering, and pagination capabilities</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-lg font-medium mb-4">Basic Implementation</h2>
                <DataTable
                    data={data}
                    columns={columns}
                    pageSize={2}
                    isLoading={false}
                />

                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-sm font-medium mb-2 text-gray-700">Usage Example:</h3>
                    <code className="text-sm bg-gray-100 p-2 rounded block overflow-x-auto">
                        {
                            `<DataTable
                                data={yourDataArray}
                                columns={columnsConfig}
                                pageSize={10}
                                isLoading={loadingState}
                            />`
                        }
                    </code>
                </div>
            </div>
        </div>
    )
}

export default TestTable;