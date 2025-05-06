
import React from 'react';
import { Download, RefreshCw, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FilterBar from "../component/FilterBar";
import LineChart from "@/components/charts/LineChart";
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
const statusLogData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toLocaleString(),
    center: `Center ${Math.floor(Math.random() * 10) + 1}`,
    issueType: ['Network Outage', 'Power Failure', 'Hardware Failure', 'Software Issue', 'Maintenance'][Math.floor(Math.random() * 5)],
    resolved: Math.random() > 0.3 ? 'Yes' : 'No',
}));

const statusLogColumns = [
    { accessorKey: 'timestamp', header: 'Timestamp' },
    { accessorKey: 'center', header: 'Center' },
    { accessorKey: 'issueType', header: 'Issue Type' },
    {
        accessorKey: 'resolved',
        header: 'Resolved',
        cell: ({ row }: any) => {
            const resolved = row.getValue('resolved');
            return (
                <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${resolved === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                    {resolved}
                </div>
            );
        },
    },
];

const technicalLogData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toLocaleString(),
    center: `Center ${Math.floor(Math.random() * 10) + 1}`,
    latency: `${Math.floor(Math.random() * 100) + 20}ms`,
    packetLoss: `${Math.random().toFixed(2)}%`,
    jitter: `${Math.floor(Math.random() * 10) + 1}ms`,
}));

const technicalLogColumns = [
    { accessorKey: 'timestamp', header: 'Timestamp' },
    { accessorKey: 'center', header: 'Center' },
    { accessorKey: 'latency', header: 'Latency' },
    { accessorKey: 'packetLoss', header: 'Packet Loss' },
    { accessorKey: 'jitter', header: 'Jitter' },
];

const incidentTrendData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleString('default', { month: 'short' });
    return {
        month,
        'North': Math.floor(Math.random() * 10) + 5,
        'South': Math.floor(Math.random() * 10) + 5,
        'East': Math.floor(Math.random() * 10) + 5,
        'West': Math.floor(Math.random() * 10) + 5,
        'Central': Math.floor(Math.random() * 10) + 5,
    };
});

export const NMSDynamic = () => {
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

            <FilterBar
                showDateRange={true}
                showRegion={true}
                showCenterType={false}
            />

            {/* Role-specific content */}
            {(userType === "super_admin") && (<>
                <Card className="p-4 mb-6">
                    <h3 className="font-medium mb-4">Global Status Map</h3>
                    <div className="h-[350px] border rounded-md flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            [Interactive Map with Online/Offline Status Flags]
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Log</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Timestamp</TableHead>
                                            <TableHead>Center</TableHead>
                                            <TableHead>Issue Type</TableHead>
                                            <TableHead>Resolved</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {statusLogData.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>{log.timestamp}</TableCell>
                                                <TableCell>{log.center}</TableCell>
                                                <TableCell>{log.issueType}</TableCell>
                                                <TableCell>
                                                    <div
                                                        className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${log.resolved === 'Yes'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-amber-100 text-amber-800'
                                                            }`}
                                                    >
                                                        {log.resolved}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Alerts Panel</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center">
                                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                                        <div>
                                            <div className="font-medium text-sm">Bandwidth Threshold Breach</div>
                                            <div className="text-xs text-muted-foreground">Center 3 - 2 hours ago</div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                                        <div>
                                            <div className="font-medium text-sm">Extended Downtime</div>
                                            <div className="text-xs text-muted-foreground">Center 5 - 4 hours ago</div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center">
                                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                                        <div>
                                            <div className="font-medium text-sm">High Latency</div>
                                            <div className="text-xs text-muted-foreground">Center 8 - 1 hour ago</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-x-2">
                                    <Button size="sm" variant="outline">Drill Down</Button>
                                    <Button size="sm" variant="outline">Ping</Button>
                                    <Button size="sm" variant="outline">Dispatch</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>)}

            {(userGroup === 2) && (<>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DataCard
                        title="National Uptime"
                        value="98.7%"
                        description="Past 30 days"
                        trend={{ value: 0.5, label: "from last month", positive: true }}
                    />
                    <DataCard
                        title="Avg Resolution Time"
                        value="3.2 hrs"
                        description="For critical incidents"
                        trend={{ value: 12, label: "improvement from standard", positive: true }}
                    />
                    <DataCard
                        title="SLA Compliance"
                        value="94.3%"
                        description="Across all regions"
                        trend={{ value: 1.8, label: "from last quarter", positive: true }}
                    />
                </div>

                <div className="mt-6">
                    <LineChart
                        title="Region-level Incident Trendlines"
                        data={incidentTrendData}
                        categories={['North', 'South', 'East', 'West', 'Central']}
                        indexBy="month"
                    />
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Compliance Table: SLA Breaches</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Center</TableHead>
                                        <TableHead>Region</TableHead>
                                        <TableHead>SLA Breaches</TableHead>
                                        <TableHead>Avg Resolution Time</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.from({ length: 10 }, (_, i) => ({
                                        id: i + 1,
                                        center: `Center ${i + 1}`,
                                        region: ['North', 'South', 'East', 'West', 'Central'][i % 5],
                                        breachCount: Math.floor(Math.random() * 5),
                                        avgResolution: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}hrs`,
                                        status: Math.random() > 0.7 ? 'Good' : Math.random() > 0.5 ? 'Warning' : 'Critical',
                                    })).map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.center}</TableCell>
                                            <TableCell>{row.region}</TableCell>
                                            <TableCell>{row.breachCount}</TableCell>
                                            <TableCell>{row.avgResolution}</TableCell>
                                            <TableCell>
                                                <div
                                                    className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${row.status === 'Good'
                                                        ? 'bg-green-100 text-green-800'
                                                        : row.status === 'Warning'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {row.status}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </>)}

            {(userGroup === 1) && (<>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataCard
                        title="Infrastructure Load"
                        value="72%"
                        description="Average across all centers"
                        trend={{ value: 4, label: "from last month", positive: false }}
                    />
                    <DataCard
                        title="Center Failure Count"
                        value="12"
                        description="Past 30 days"
                        trend={{ value: 3, label: "from last month", positive: true }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card className="p-4">
                        <h3 className="font-medium mb-3">Infrastructure Utilization</h3>
                        <div className="flex justify-center">
                            <div className="w-40 h-40 rounded-full border-8 border-primary-hover relative flex items-center justify-center">
                                <div className="text-2xl font-bold">72%</div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className="h-full w-full rounded-full border-8 border-primary"
                                        style={{
                                            clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 59% 100%, 50% 50%)'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <LineChart
                        title="Infrastructure Load Trend"
                        data={Array.from({ length: 7 }, (_, i) => ({
                            day: `Day ${i + 1}`,
                            'Load %': Math.floor(Math.random() * 20) + 60,
                        }))}
                        categories={['Load %']}
                        indexBy="day"
                    />
                </div>

                <Card className="p-4 mt-6">
                    <h3 className="font-medium mb-3">Downtime Alerts Feed</h3>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} className="flex items-center justify-between p-2 border-b last:border-0">
                                <div className="flex items-center">
                                    <div className={`h-3 w-3 rounded-full ${i === 0 ? 'bg-red-500' : i < 3 ? 'bg-amber-500' : 'bg-green-500'
                                        } mr-3`}></div>
                                    <div>
                                        <div className="font-medium">Center {i + 1}</div>
                                        <div className="text-xs text-muted-foreground">{
                                            i === 0 ? 'Critical - Network Outage' :
                                                i === 1 ? 'Warning - High Latency' :
                                                    i === 2 ? 'Warning - Intermittent Connection' :
                                                        'Resolved'
                                        }</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-right text-sm">{
                                        i === 0 ? '15 minutes ago' :
                                            i === 1 ? '45 minutes ago' :
                                                i === 2 ? '2 hours ago' :
                                                    '3+ hours ago'
                                    }</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Outage Report
                        </Button>
                    </div>
                </Card>
            </>)}

            {(userGroup === 3) && (<>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DataCard
                        title="Avg Response Time"
                        value="67ms"
                        description="Across network"
                        trend={{ value: 9, label: "improvement from last month", positive: true }}
                    />
                    <DataCard
                        title="Packet Loss"
                        value="0.08%"
                        description="Network average"
                        trend={{ value: 0.03, label: "from last month", positive: true }}
                    />
                    <DataCard
                        title="Active Alerts"
                        value="7"
                        description="Requiring attention"
                        trend={{ value: 3, label: "from yesterday", positive: true }}
                    />
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>Center</TableHead>
                                        <TableHead>Latency</TableHead>
                                        <TableHead>Packet Loss</TableHead>
                                        <TableHead>Jitter</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {technicalLogData.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{log.timestamp}</TableCell>
                                            <TableCell>{log.center}</TableCell>
                                            <TableCell>{log.latency}</TableCell>
                                            <TableCell>{log.packetLoss}</TableCell>
                                            <TableCell>{log.jitter}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card className="p-4">
                        <h3 className="font-medium mb-3">Tools Panel</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {['Remote Diagnostics', 'Ping Test', 'Bandwidth Test', 'Manual Reboot', 'Log Collection', 'Config Update'].map((tool, i) => (
                                <Button key={i} variant="outline" size="sm" className="h-auto py-3 px-2">
                                    {tool}
                                </Button>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h3 className="font-medium mb-3">Alert Threshold Settings</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-sm">Response Time</div>
                                    <div className="text-xs text-muted-foreground">Current: 100ms</div>
                                </div>
                                <Button variant="outline" size="sm">Edit</Button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-sm">Packet Loss</div>
                                    <div className="text-xs text-muted-foreground">Current: 1%</div>
                                </div>
                                <Button variant="outline" size="sm">Edit</Button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-sm">Bandwidth Utilization</div>
                                    <div className="text-xs text-muted-foreground">Current: 90%</div>
                                </div>
                                <Button variant="outline" size="sm">Edit</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </>)}

            {(userGroup === 6) && (<>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                        <h3 className="font-medium mb-3">Center Status</h3>
                        <div className="flex items-center justify-center p-6">
                            <div className="w-40 h-40 rounded-full bg-green-100 border-8 border-green-500 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-green-700 text-2xl font-bold">ONLINE</div>
                                    <div className="text-green-600 text-sm">All systems operational</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h3 className="font-medium mb-3">System Log</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 border-b">
                                <div className="font-medium">Last Downtime</div>
                                <div>3 days ago</div>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b">
                                <div className="font-medium">Duration</div>
                                <div>45 minutes</div>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b">
                                <div className="font-medium">Reason</div>
                                <div>Scheduled Maintenance</div>
                            </div>
                            <div className="flex justify-between items-center p-2">
                                <div className="font-medium">Current Speed</div>
                                <div>95 Mbps</div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex items-center gap-2">
                        <RefreshCw size={16} />
                        Try Refresh
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Report Technical Issue
                    </Button>
                </div>
            </>)}
        </div>
    );
};

export default NMSDynamic;
