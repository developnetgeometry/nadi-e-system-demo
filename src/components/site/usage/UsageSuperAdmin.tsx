import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/site/component/StatsCard"; // Use StatsCard instead of Card
import { Download, FileText, Users, Clock, Activity } from "lucide-react";
import FilterBar from "../component/FilterBar";
import HeatMap from "@/components/charts/HeatMap";
import LineChart from "@/components/charts/LineChart";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

const usageData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    'Active Users': Math.floor(Math.random() * 500) + 200,
    'Sessions': Math.floor(Math.random() * 1000) + 500,
}));
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

const UsageSuperAdmin = () => {
    return (
        <div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <StatsCard
                    title="Total Users"
                    value="3,456"
                    subtitle="Across all centers +12% from last month"
                    icon={Users}
                    iconBgColor="bg-blue-100"
                    iconTextColor="text-blue-600"
                />
                <StatsCard
                    title="Peak Usage Time"
                    value="14:00 - 16:00"
                    subtitle="Average across all centers"
                    icon={Clock}
                    iconBgColor="bg-green-100"
                    iconTextColor="text-green-600"
                />
                <StatsCard
                    title="Active Centers"
                    value="42/45"
                    subtitle="Centers currently online +2% from yesterday"
                    icon={Activity}
                    iconBgColor="bg-yellow-100"
                    iconTextColor="text-yellow-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <HeatMap
                    title="Usage Intensity by State"
                    data={stateUsageData}
                />

                <LineChart
                    title="Usage Trends"
                    data={usageData}
                    categories={['Active Users', 'Sessions']}
                    indexBy="day"
                />
            </div>

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

        </div>
    );
};

export default UsageSuperAdmin;