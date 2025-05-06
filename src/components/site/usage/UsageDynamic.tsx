
import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FilterBar from "../component/FilterBar";
import HeatMap from "@/components/charts/HeatMap";
import LineChart from "@/components/charts/LineChart";
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import { useUserMetadata } from '@/hooks/use-user-metadata';
import DataCard from '../component/DataCard';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

// Mock data
const usageData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    'Active Users': Math.floor(Math.random() * 500) + 200,
    'Sessions': Math.floor(Math.random() * 1000) + 500,
}));

const demographicData = [
    { name: 'Youth', value: 45 },
    { name: 'Adults', value: 30 },
    { name: 'Seniors', value: 15 },
    { name: 'Children', value: 10 },
];

const programData = [
    { name: 'Learning', value: 40 },
    { name: 'Entrepreneur', value: 25 },
    { name: 'Job Skills', value: 20 },
    { name: 'Digital Literacy', value: 15 },
];

const stateUsageData = [
    { name: 'Kuala Lumpur', value: 87 },
    { name: 'Selangor', value: 75 },
    { name: 'Johor', value: 62 },
    { name: 'Penang', value: 58 },
    { name: 'Sarawak', value: 45 },
    { name: 'Sabah', value: 42 },
    { name: 'Perak', value: 38 },
    { name: 'Kedah', value: 35 },
    { name: 'Kelantan', value: 32 },
    { name: 'Pahang', value: 30 },
    { name: 'Negeri Sembilan', value: 28 },
    { name: 'Terengganu', value: 25 },
    { name: 'Melaka', value: 22 },
    { name: 'Perlis', value: 18 },
];

const regionData = Array.from({ length: 5 }, (_, i) => ({
    region: ['North', 'South', 'East', 'West', 'Central'][i],
    'Usage': Math.floor(Math.random() * 500) + 200,
    'Compliance': Math.floor(Math.random() * 100),
}));

// Table data
const centersTableData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Center ${i + 1}`,
    location: ['Kuala Lumpur', 'Penang', 'Johor', 'Selangor', 'Malacca'][i % 5],
    usersToday: Math.floor(Math.random() * 200) + 50,
    weeklyAvg: Math.floor(Math.random() * 1000) + 300,
    lastDowntime: `${Math.floor(Math.random() * 24)}h ago`,
    status: Math.random() > 0.2 ? 'Active' : 'Maintenance',
}));

const columns = [
    {
        accessorKey: 'name',
        header: 'Center Name',
    },
    {
        accessorKey: 'location',
        header: 'Location',
    },
    {
        accessorKey: 'usersToday',
        header: 'Users Today',
    },
    {
        accessorKey: 'weeklyAvg',
        header: 'Avg Weekly Usage',
    },
    {
        accessorKey: 'lastDowntime',
        header: 'Last Downtime',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: any) => {
            const status = row.getValue('status');
            return (
                <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                    {status}
                </div>
            );
        },
    },
];

export const UsageDynamic = () => {
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const userGroup = parsedMetadata?.user_group;
    const userType = parsedMetadata?.user_type;
    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-6">
                <Button variant="outline" className="flex items-center gap-2">
                    <Download size={16} />
                    Download CSV
                </Button>
                <Button variant="outline" className="flex items-center gap-2 ml-2">
                    <FileText size={16} />
                    View Logs
                </Button>
            </div>

            <FilterBar />
            {(userGroup === 6 || userGroup === 7) && (<Button
                variant="link"
                size="sm"
                className="mt-2 text-primary hover:underline"
            >
                Edit profile image
            </Button>
            )}
            {/* Role-specific content */}
            {(userType === "super_admin") && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DataCard
                            title="Total Users"
                            value="3,456"
                            description="Across all centers"
                            trend={{ value: 12, label: "from last month", positive: true }} />
                        <DataCard
                            title="Peak Usage Time"
                            value="14:00 - 16:00"
                            description="Average across all centers" />
                        <DataCard
                            title="Active Centers"
                            value="42/45"
                            description="Centers currently online"
                            trend={{ value: 2, label: "from yesterday", positive: true }} />
                    </div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <HeatMap
                            title="Usage Intensity by State"
                            data={stateUsageData} />

                        <LineChart
                            title="Usage Trends"
                            data={usageData}
                            categories={['Active Users', 'Sessions']}
                            indexBy="day" />
                    </div></>
            )}

            {(userGroup === 2) && (<>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <LineChart
                            title="National Usage Trendline"
                            data={usageData}
                            categories={['Active Users']}
                            indexBy="day"
                        />
                    </div>
                    <PieChart
                        title="User Demographics"
                        data={demographicData}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card className="p-4">
                        <h3 className="font-medium mb-2">Highlighted Metrics</h3>
                        <div className="text-sm text-amber-600 mb-1">• 12 high-risk underserved areas identified</div>
                        <div className="text-sm text-amber-600 mb-1">• 3 regions below 50% utilization target</div>
                        <div className="text-sm text-amber-600">• 5 centers require immediate intervention</div>
                    </Card>

                    <BarChart
                        title="Region-wise Comparison"
                        data={regionData}
                        categories={['Usage', 'Compliance']}
                        indexBy="region"
                    />
                </div>
            </>)}

            {(userGroup === 1) && (<>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DataCard
                        title="Cost per User"
                        value="RM 4.32"
                        description="Monthly average"
                        trend={{ value: 8, label: "reduction from last quarter", positive: true }}
                    />
                    <DataCard
                        title="Device Uptime"
                        value="97.8%"
                        description="Monthly average"
                        trend={{ value: 1.2, label: "improvement from last month", positive: true }}
                    />
                    <DataCard
                        title="Infrastructure Utilization"
                        value="72%"
                        description="Average across regions"
                        trend={{ value: 4, label: "from last month", positive: true }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card className="p-4 h-[350px] flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            [Geo Map Visualization with Infrastructure Usage]
                        </div>
                    </Card>

                    <LineChart
                        title="Average Usage vs. Infrastructure Investment"
                        data={usageData.map(d => ({ ...d, 'Investment (RM)': d['Active Users'] * 2.5 }))}
                        categories={['Active Users', 'Investment (RM)']}
                        indexBy="day"
                    />
                </div>

                <Card className="p-4 mt-6">
                    <h3 className="font-medium mb-2">Financial Notes</h3>
                    <div className="text-sm text-amber-600">• 3 centers exceeding cost benchmark ({'>'}RM 6.00 per user)</div>
                    <div className="text-sm text-green-600">• Overall cost reduced by 8% from previous quarter</div>
                </Card>
            </>
            )}

            {(userGroup === 3) && (<>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LineChart
                        title="System Bandwidth Tracker"
                        data={usageData.map(d => ({ ...d, 'Bandwidth': d['Active Users'] * 0.5 }))}
                        categories={['Bandwidth']}
                        indexBy="day"
                    />

                    <PieChart
                        title="Client Version Distribution"
                        data={[
                            { name: 'v3.1', value: 45 },
                            { name: 'v3.0', value: 30 },
                            { name: 'v2.9', value: 15 },
                            { name: 'v2.8', value: 10 },
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <BarChart
                        title="Tickets Opened vs Resolved"
                        data={Array.from({ length: 5 }, (_, i) => ({
                            category: ['Network', 'Hardware', 'Software', 'User Access', 'Other'][i],
                            'Opened': Math.floor(Math.random() * 20) + 5,
                            'Resolved': Math.floor(Math.random() * 18) + 2,
                        }))}
                        categories={['Opened', 'Resolved']}
                        indexBy="category"
                    />

                    <Card className="p-4">
                        <h3 className="font-medium mb-2">System Logs</h3>
                        <div className="text-sm mb-1"><span className="font-medium">Uptime:</span> 99.2%</div>
                        <div className="text-sm mb-1"><span className="font-medium">Avg Response Time:</span> 132ms</div>
                        <div className="text-sm mb-1"><span className="font-medium">Error Rate:</span> 0.08%</div>
                        <h4 className="font-medium mt-3 mb-1 text-sm">Downtime Causes:</h4>
                        <div className="text-xs text-muted-foreground">• Scheduled Maintenance: 80%</div>
                        <div className="text-xs text-muted-foreground">• Network Issues: 15%</div>
                        <div className="text-xs text-muted-foreground">• Hardware Failure: 5%</div>
                    </Card>
                </div>
            </>
            )}
            {(userGroup === 6) && (<>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataCard
                        title="Daily User Count"
                        value="87"
                        description="For your center today"
                        trend={{ value: 12, label: "from yesterday", positive: true }}
                    />
                    <LineChart
                        title="Last 7 Days Usage"
                        data={usageData.slice(0, 7)}
                        categories={['Active Users']}
                        indexBy="day"
                        height={200}
                    />
                </div>

                <div className="mt-6">
                    <PieChart
                        title="Program Usage Distribution"
                        data={programData}
                    />
                </div>
            </>
            )}
            {userType === "super_admin" || (userGroup === 1 || userGroup === 2) && (<>
                <div className="mt-6">
                    <h3 className="font-medium mb-4">Centers Data</h3>
                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Center Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Users Today</TableHead>
                                    <TableHead>Avg Weekly Usage</TableHead>
                                    <TableHead>Last Downtime</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {centersTableData.map((center, index) => (
                                    <TableRow key={center.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{center.name}</TableCell>
                                        <TableCell>{center.location}</TableCell>
                                        <TableCell>{center.usersToday}</TableCell>
                                        <TableCell>{center.weeklyAvg}</TableCell>
                                        <TableCell>{center.lastDowntime}</TableCell>
                                        <TableCell>
                                            <div
                                                className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${center.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-amber-100 text-amber-800"
                                                    }`}
                                            >
                                                {center.status}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </>
            )}
        </div>
    );
};

export default UsageDynamic;
