import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Progress } from '@/components/ui/progress';

// Mock data
const kpiTimelineData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleString('default', { month: 'short' });
    return {
        month,
        'Target': 80 + Math.floor(Math.random() * 15),
        'Actual': 70 + Math.floor(Math.random() * 25),
    };
});

const complianceData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    center: `Center ${i + 1}`,
    region: ['North', 'South', 'East', 'West', 'Central'][i % 5],
    compliance: Math.floor(Math.random() * 40) + 60,
    status: Math.random() > 0.3 ? 'Compliant' : 'Non-Compliant',
    lastAudit: `${Math.floor(Math.random() * 30) + 1} days ago`,
}));

const complianceColumns = [
    { accessorKey: 'center', header: 'Center' },
    { accessorKey: 'region', header: 'Region' },
    {
        accessorKey: 'compliance',
        header: 'Compliance %',
        cell: ({ row }: any) => {
            const value = row.getValue('compliance');
            return (
                <div className="flex items-center">
                    <span className="mr-2">{value}%</span>
                    <Progress value={value} className="h-2" />
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: any) => {
            const status = row.getValue('status');
            return (
                <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${status === 'Compliant' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {status}
                </div>
            );
        },
    },
    { accessorKey: 'lastAudit', header: 'Last Audit' },
];

const infraIssuesData = Array.from({ length: 5 }, (_, i) => ({
    category: ['Network', 'Hardware', 'Software', 'Power', 'Security'][i],
    'Resolution Time (hrs)': Math.floor(Math.random() * 48) + 12,
}));

export const KPIDynamic = () => {
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
                showSearch={false}
            />

            {/* Role-specific content */}
            {(userType === "super_admin") && (<>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DataCard
                        title="Total Users"
                        value="45,872"
                        description="Nationwide"
                        trend={{ value: 8.2, label: "from last quarter", positive: true }}
                    />
                    <DataCard
                        title="Service Hours"
                        value="12,450"
                        description="This month"
                        trend={{ value: 5.7, label: "from last month", positive: true }}
                    />
                    <DataCard
                        title="Event Success Rate"
                        value="92.3%"
                        description="Average across centers"
                        trend={{ value: 2.1, label: "from last quarter", positive: true }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card className="p-4">
                        <h3 className="font-medium mb-3">KPI Dashboard Builder</h3>
                        <div className="p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <p>Drag and drop KPI cards to customize your dashboard</p>
                                <Button variant="outline" size="sm" className="mt-2">+ Add KPI Card</Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h3 className="font-medium mb-3">Underperforming Centers</h3>
                        <div className="space-y-3">
                            {Array.from({ length: 5 }, (_, i) => (
                                <div key={i} className="flex items-center justify-between p-2 border-b last:border-0">
                                    <div>
                                        <div className="font-medium">Center {i + 1}</div>
                                        <div className="text-xs text-muted-foreground">{['Kuala Lumpur', 'Penang', 'Johor', 'Selangor', 'Malacca'][i]}</div>
                                    </div>
                                    <div>
                                        <div className="text-right text-sm font-medium text-red-500">-{Math.floor(Math.random() * 20) + 10}% below target</div>
                                        <div className="text-right text-xs text-muted-foreground">Last 30 days</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <Card className="p-4 mt-6">
                    <h3 className="font-medium mb-3">Alert Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border rounded-md">
                            <div className="font-medium mb-1">Usage Threshold Alert</div>
                            <div className="text-sm text-muted-foreground mb-2">Trigger if usage drops below 60% of target</div>
                            <div className="flex justify-between text-xs">
                                <span className="text-green-600">Active</span>
                                <span>SMS + Email notification</span>
                            </div>
                        </div>
                        <div className="p-3 border rounded-md">
                            <div className="font-medium mb-1">Compliance Alert</div>
                            <div className="text-sm text-muted-foreground mb-2">Trigger if compliance falls below 80%</div>
                            <div className="flex justify-between text-xs">
                                <span className="text-green-600">Active</span>
                                <span>Dashboard + Email notification</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </>)}

            {(userGroup === 2) && (<>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DataCard
                        title="National Coverage"
                        value="87.3%"
                        description="Of target population"
                        trend={{ value: 2.3, label: "from last quarter", positive: true }}
                    />
                    <DataCard
                        title="Compliance Rate"
                        value="79.8%"
                        description="Nationwide average"
                        trend={{ value: 1.2, label: "from last month", positive: false }}
                    />
                    <DataCard
                        title="Digital Literacy Index"
                        value="64.2"
                        description="National score (out of 100)"
                        trend={{ value: 3.8, label: "from last year", positive: true }}
                    />
                </div>

                <div className="mt-6">
                    <LineChart
                        title="KPI Achievement Over 6 Months"
                        data={kpiTimelineData}
                        categories={['Target', 'Actual']}
                        indexBy="month"
                    />
                </div>

                <div className="mt-6">
                    <h3 className="font-medium mb-4">Center Compliance List</h3>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Center</TableHead>
                                        <TableHead>Region</TableHead>
                                        <TableHead>Compliance %</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Last Audit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {complianceData.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.center}</TableCell>
                                            <TableCell>{row.region}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="mr-2">{row.compliance}%</span>
                                                    <Progress value={row.compliance} className="h-2" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${row.status === 'Compliant'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {row.status}
                                                </div>
                                            </TableCell>
                                            <TableCell>{row.lastAudit}</TableCell>
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
                        title="Device Health Index"
                        value="83/100"
                        description="Average across all centers"
                        trend={{ value: 4, label: "from last quarter", positive: true }}
                    />
                    <DataCard
                        title="ROI per Center"
                        value="RM 2.45"
                        description="For each RM 1 invested"
                        trend={{ value: 0.15, label: "from last year", positive: true }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <LineChart
                        title="Investment vs Engagement Score"
                        data={Array.from({ length: 6 }, (_, i) => ({
                            month: new Date(2025, i, 1).toLocaleString('default', { month: 'short' }),
                            'Investment (RM)': Math.floor(Math.random() * 20000) + 30000,
                            'Engagement Score': Math.floor(Math.random() * 20) + 70,
                        }))}
                        categories={['Investment (RM)', 'Engagement Score']}
                        indexBy="month"
                    />

                    <BarChart
                        title="Infrastructure Issue Resolution Time"
                        data={infraIssuesData}
                        categories={['Resolution Time (hrs)']}
                        indexBy="category"
                    />
                </div>
            </>)}

            {(userGroup === 3) && (<>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DataCard
                        title="SLA Compliance"
                        value="96.7%"
                        description="Past 30 days"
                        trend={{ value: 1.3, label: "from last month", positive: true }}
                    />
                    <DataCard
                        title="Avg Bug Fix Time"
                        value="18.2 hrs"
                        description="Critical issues"
                        trend={{ value: 22, label: "improvement from standard", positive: true }}
                    />
                    <DataCard
                        title="Incidents per System"
                        value="0.82"
                        description="Weekly average"
                        trend={{ value: 0.13, label: "from last quarter", positive: true }}
                    />
                </div>

                <div className="mt-6">
                    <BarChart
                        title="Training Delivery Hours by Center"
                        data={Array.from({ length: 5 }, (_, i) => ({
                            center: `Center ${i + 1}`,
                            'Remote Training': Math.floor(Math.random() * 20) + 10,
                            'On-site Training': Math.floor(Math.random() * 15) + 5,
                        }))}
                        categories={['Remote Training', 'On-site Training']}
                        indexBy="center"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {Array.from({ length: 3 }, (_, i) => (
                        <Card key={i} className="p-4">
                            <h3 className="font-medium mb-2">{['Network', 'Hardware', 'Software'][i]} SLA Compliance</h3>
                            <div className="flex items-center">
                                <div className="w-24 h-24 relative mr-4">
                                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                                        <div className="text-xl font-bold">
                                            {95 + Math.floor(Math.random() * 5)}%
                                        </div>
                                    </div>
                                    <div
                                        className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary"
                                        style={{
                                            clipPath: `polygon(50% 50%, 50% 0%, ${100 * (0.5 + 0.5 * Math.random())}% 0%, 100% ${100 * Math.random()}%, 100% 100%, ${100 * Math.random()}% 100%, 0% ${100 * (0.5 + 0.5 * Math.random())}%, 0% 0%, ${50 * Math.random()}% 0%)`
                                        }}
                                    ></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        <div className="text-sm">Resolved: {28 + Math.floor(Math.random() * 10)}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                        <div className="text-sm">In Progress: {Math.floor(Math.random() * 5)}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <div className="text-sm">Overdue: {Math.floor(Math.random() * 2)}</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </>)}

            {(userGroup === 6) && (<>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DataCard
                        title="Bookings Managed"
                        value={Math.floor(Math.random() * 50) + 70}
                        description="This month"
                        trend={{ value: Math.floor(Math.random() * 15) + 5, label: "from last month", positive: true }}
                    />
                    <DataCard
                        title="User Feedback"
                        value={`${Math.floor(Math.random() * 1) + 4}.${Math.floor(Math.random() * 10)}/5`}
                        description="Average rating"
                        trend={{ value: 0.2, label: "from last month", positive: true }}
                    />
                    <DataCard
                        title="Event Rating"
                        value={`${Math.floor(Math.random() * 1) + 4}.${Math.floor(Math.random() * 10)}/5`}
                        description="Average for your events"
                        trend={{ value: 0.3, label: "from last month", positive: true }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card className="p-4">
                        <h3 className="font-medium mb-4">Monthly Goal Tracker</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <div className="font-medium text-sm">User Engagement</div>
                                    <div className="text-sm">75%</div>
                                </div>
                                <Progress value={75} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <div className="font-medium text-sm">Programs Conducted</div>
                                    <div className="text-sm">90%</div>
                                </div>
                                <Progress value={90} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <div className="font-medium text-sm">Documentation Completion</div>
                                    <div className="text-sm">60%</div>
                                </div>
                                <Progress value={60} className="h-2" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h3 className="font-medium mb-4">Badge System</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border rounded-md p-3 flex items-center space-x-3">
                                <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
                                    ⭐
                                </div>
                                <div>
                                    <div className="font-medium">Star Performer</div>
                                    <div className="text-xs text-muted-foreground">Achieved for April</div>
                                </div>
                            </div>
                            <div className="border rounded-md p-3 flex items-center space-x-3">
                                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                                    🎓
                                </div>
                                <div>
                                    <div className="font-medium">Training Complete</div>
                                    <div className="text-xs text-muted-foreground">12 modules finished</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </>)}
        </div>
    );
};

export default KPIDynamic;
