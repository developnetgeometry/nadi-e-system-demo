import { useUserMetadata } from '@/hooks/use-user-metadata';
// Re-import to ensure latest interface changes are recognized
import DataTable, { Column } from '@/components/ui/datatable';
import React, { useState } from 'react';
import { Hash, FileText, Activity, Calendar, Clock, DollarSign, Percent, Eye, Trash2, Code, Settings, Info, Filter, SortAsc, LayoutGrid, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TestTable = () => {
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const userGroup = parsedMetadata?.user_group;
    const userType = parsedMetadata?.user_type;
    const organizationId = parsedMetadata?.organization_id;
    const siteId = parsedMetadata?.group_profile?.site_profile_id;

    const { toast } = useToast();
      // State for demo controls
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(2);
    const [columnVisibility, setColumnVisibility] = useState({
        name: false
    });


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
    };    // Simulate loading data (for demo purposes)
    const toggleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    // Dummy data for the DataTable
    const data = [
        { id: 1, name: "Phase 1", status: "Completed", startDate: "2025-01-01", endDate: "2025-03-01", budget: 150000, completion: 100, lastUpdate: "2025-03-01T14:30:00", priority: "High", manager: "Ahmad Rizal", notes: "Foundation work completed ahead of schedule" },
        { id: 2, name: "Phase 2", status: "In Progress", startDate: "2025-04-01", endDate: "2025-06-01", budget: 250000, completion: 45, lastUpdate: "2025-02-20T11:15:00", priority: "Medium", manager: "Siti Aminah", notes: "Structural work ongoing, on track with timeline" },
        { id: 3, name: "Phase 3", status: "Not Started", startDate: "2025-07-01", endDate: "2025-09-01", budget: 180000, completion: 0, lastUpdate: "2025-02-20T11:15:00", priority: "Low", manager: "Raj Kumar", notes: "Pending approval of budget revisions" },
        { id: 4, name: "Phase 4", status: "Delayed", startDate: "2025-10-01", endDate: "2025-12-01", budget: 220000, completion: 0, lastUpdate: "2025-02-22T09:45:00", priority: "High", manager: "Lee Wei", notes: "Delayed due to material shortages" },
        { id: 5, name: "Phase 5", status: "Planning", startDate: "2026-01-01", endDate: "2026-03-01", budget: 300000, completion: 0, lastUpdate: "2025-02-25T16:20:00", priority: "Medium", manager: "Emily Wong", notes: "Initial planning stage, gathering requirements" },
    ];    // Define columns for the DataTable 
    const columns: Column[] = [        {            key: (_, i) => `${i + 1}.`,
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
            ),            filterable: true,
            visible: columnVisibility.name !== undefined ? columnVisibility.name : false,
            filterType: "string"
        }, 
        {
            key: "status",
            header: "Status",  // Simple text header            filterable: true,
            visible: true,
            filterType: "string",
            render: (value) => {
                const colorMap: Record<string, string> = {
                    "Completed": "bg-green-100 text-green-800 border-green-300",
                    "In Progress": "bg-blue-100 text-blue-800 border-blue-300",
                    "Not Started": "bg-gray-100 text-gray-800 border-gray-300",
                    "Delayed": "bg-red-100 text-red-800 border-red-300",
                    "Planning": "bg-purple-100 text-purple-800 border-purple-300"
                };
                
                return (
                    <Badge variant="outline" className={`px-2 py-1 ${colorMap[value] || ""}`}>
                        {value}
                    </Badge>
                );
            }
        },
        {
            key: "priority",
            header: "Priority",            filterable: true,
            visible: true,
            filterType: "string",
            width: "8%",
            render: (value) => {
                const colorMap: Record<string, string> = {
                    "High": "bg-red-100 text-red-800",
                    "Medium": "bg-yellow-100 text-yellow-800",
                    "Low": "bg-green-100 text-green-800"
                };
                
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[value] || ""}`}>
                        {value}
                    </span>
                );
            }
        },
        {
            key: "startDate",
            header: (
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Start Date</span>
                </div>
            ),            filterable: true,
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
            ),            filterable: true,
            visible: true,
            filterType: "date",
            width: "10%",
            align: "center"
        }, 
        {
            key: "budget",
            header: (
                <div className="flex items-center gap-2 text-green-600">
                    <DollarSign size={16} />
                    <span>Budget (RM)</span>
                </div>
            ),
            render: (value) => `RM ${value.toLocaleString()}`,
            align: "right",            filterable: true,
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
            ),            filterable: true, 
            visible: true,
            filterType: "number", 
            width: "10%",
            align: "center",
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full ${value < 30 ? 'bg-red-500' : value < 70 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                            style={{ width: `${value}%` }}
                        ></div>
                    </div>
                    <span className="text-sm">{value}%</span>
                </div>
            )
        },
        {
            key: "manager",
            header: "Manager",            filterable: true,
            visible: true,
            filterType: "string"
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
            },            visible: true,
            width: "15%",
            align: "center"
        },
        {
            key: "notes",
            header: "Notes",            filterable: true,
            visible: false, // Hidden by default
            filterType: "string"
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
            ),            header: "Actions",
            align: "center",
            width: "10%",
            visible: true
        },
    ];    // Example of column type interface for documentation
    const columnTypeExample = `
export interface Column {
  key: string | ((row: any, index: number) => any);    // Key or function that returns cell content
  header: string | React.ReactNode | any;              // Header text or custom component
  width?: string;                                      // Width of column (e.g. "10%", "100px")
  render?: (value: any, row: any, index: number) => React.ReactNode;  // Custom render function
  filterable?: boolean;                                // Whether column can be filtered
  visible?: boolean;                                   // Whether column is visible
  filterType?: "string" | "number" | "date" | "boolean"; // Type of filter to use
  align?: "left" | "center" | "right";                 // Text alignment
}`;

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-2xl font-bold mb-2">DataTable Component Showcase</h1>
                <p className="text-gray-500 mb-6">A comprehensive guide to using the DataTable component with all available options and features</p>
            </div>

            <Tabs defaultValue="demo">
                <TabsList className="grid grid-cols-5 w-[600px] mb-8">
                    <TabsTrigger value="demo" className="flex items-center gap-2">
                        <LayoutGrid size={16} />
                        Live Demo
                    </TabsTrigger>
                    <TabsTrigger value="props" className="flex items-center gap-2">
                        <Settings size={16} />
                        Props
                    </TabsTrigger>
                    <TabsTrigger value="columns" className="flex items-center gap-2">
                        <Code size={16} />
                        Columns API
                    </TabsTrigger>
                    <TabsTrigger value="examples" className="flex items-center gap-2">
                        <Activity size={16} />
                        Examples
                    </TabsTrigger>
                    <TabsTrigger value="bestPractices" className="flex items-center gap-2">
                        <Info size={16} />
                        Best Practices
                    </TabsTrigger>
                </TabsList>

                {/* DEMO TAB */}                
                <TabsContent value="demo" className="space-y-8">
                    <Card className="overflow-hidden border-2">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-blue-600" />
                                    <CardTitle>Interactive Demo</CardTitle>
                                </div>
                                
                                {/* Controls Panel - Horizontal Layout */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="loading-switch" className="text-sm font-medium text-gray-700 whitespace-nowrap">Loading:</Label>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700"
                                            onClick={toggleLoading}
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-1">
                                                    <Loader2 className="h-3 w-3 animate-spin" /> Simulating...
                                                </div>
                                            ) : (
                                                "Simulate Loading"
                                            )}
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="page-size" className="text-sm font-medium text-gray-700">Page Size:</Label>
                                        <select 
                                            id="page-size"
                                            value={pageSize}
                                            onChange={(e) => setPageSize(Number(e.target.value))}
                                            className="p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 text-sm"
                                        >
                                            {[2, 5, 10, 25].map(size => (
                                                <option key={size} value={size}>{size} rows</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="name-column-switch" className="text-sm font-medium text-gray-700 whitespace-nowrap">Phase Name Column:</Label>
                                        <div className="flex items-center gap-1">
                                            <Switch 
                                                id="name-column-switch" 
                                                checked={columnVisibility.name !== false}
                                                onCheckedChange={(checked) => 
                                                    setColumnVisibility({...columnVisibility, name: checked})
                                                }
                                            />
                                            <span className="text-xs text-gray-500">{columnVisibility.name !== false ? "Visible" : "Hidden"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>                        <CardContent className="p-0">
                            {/* Code Preview - Moved to top */}
                            <div className="p-4 bg-gray-50 border-b">
                                <div className="bg-slate-800 text-slate-50 p-3 rounded-md font-mono text-xs overflow-auto">
                                    <div className="flex justify-between items-center mb-2 text-slate-400 text-xs">
                                        <span>DataTable.tsx</span>
                                    </div>
{`<DataTable
    data={data}
    columns={columns}
    pageSize={${pageSize}}
    isLoading={${loading}}
/>`}
                                </div>
                            </div>

                            {/* Live Table Preview - Moved below code */}
                            <div className="p-6">
                                <DataTable
                                    data={data}
                                    columns={columns}
                                    pageSize={pageSize}
                                    isLoading={loading}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PROPS TAB */}
                <TabsContent value="props" className="space-y-6">
                    <Card>
                        <CardHeader>                            <CardTitle>DataTable Props</CardTitle>
                            <CardDescription>
                                Currently implemented properties for the DataTable component
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        </tr>
                                    </thead>                                    <tbody className="bg-white divide-y divide-gray-200">                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">data</td>
                                            <td className="py-2 px-4 font-mono text-sm">any[]</td>
                                            <td className="py-2 px-4 font-mono text-sm text-red-600">required</td>
                                            <td className="py-2 px-4 text-sm">                                                Array of data objects to display in the table. Must be provided.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">columns</td>
                                            <td className="py-2 px-4 font-mono text-sm">Column[]</td>
                                            <td className="py-2 px-4 font-mono text-sm text-red-600">required</td>
                                            <td className="py-2 px-4 text-sm">                                                Array of column configuration objects. Must be provided.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">pageSize</td>
                                            <td className="py-2 px-4 font-mono text-sm">number</td>
                                            <td className="py-2 px-4 font-mono text-sm">10</td>
                                            <td className="py-2 px-4 text-sm">                                                Number of items per page. If not specified, defaults to 10.
                                            </td>
                                        </tr>                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">isLoading</td>
                                            <td className="py-2 px-4 font-mono text-sm">boolean</td>
                                            <td className="py-2 px-4 font-mono text-sm">false</td>
                                            <td className="py-2 px-4 text-sm">
                                                Whether the table is in a loading state. If not specified, defaults to false.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* COLUMNS API TAB */}
                <TabsContent value="columns" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Column Configuration</CardTitle>
                            <CardDescription>
                                The Column type interface and examples of different column configurations
                            </CardDescription>
                        </CardHeader>                        <CardContent className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-md font-mono text-xs whitespace-pre-wrap">
                                {columnTypeExample}
                            </div>
                              <div className="border rounded-md">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column Property</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">key</td>
                                            <td className="py-2 px-4 font-mono text-sm">{`string | ((row: any, index: number) => any)`}</td>
                                            <td className="py-2 px-4 font-mono text-sm text-red-600">required</td>
                                            <td className="py-2 px-4 text-sm">Property name in data object or function that returns the cell content. 
                                              <div className="mt-1">
                                                <span className="text-amber-600">For nested properties:</span>
                                                <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                                                  <li><code>{`key: (row) => row.user.name`}</code> - Works for displaying data, but may not support sorting</li>
                                                  <li><code>{`key: "user.name"`}</code> - <span className="text-green-700 font-medium">Recommended</span> if you need sortable columns with nested data</li>
                                                </ul>
                                              </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">header</td>
                                            <td className="py-2 px-4 font-mono text-sm">string | React.ReactNode | any</td>
                                            <td className="py-2 px-4 font-mono text-sm text-red-600">required</td>
                                            <td className="py-2 px-4 text-sm">Text or component to display in the column header</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">width</td>
                                            <td className="py-2 px-4 font-mono text-sm">string</td>
                                            <td className="py-2 px-4 font-mono text-sm">auto</td>
                                            <td className="py-2 px-4 text-sm">Width of the column (e.g. "10%", "100px"). If not specified, width is automatically calculated.</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">render</td>
                                            <td className="py-2 px-4 font-mono text-sm">{`(value: any, row: any, index: number) => React.ReactNode`}</td>
                                            <td className="py-2 px-4 font-mono text-sm">raw value</td>
                                            <td className="py-2 px-4 text-sm">Custom render function for the cell value. If not specified, the raw value is displayed.</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">filterable</td>
                                            <td className="py-2 px-4 font-mono text-sm">boolean</td>
                                            <td className="py-2 px-4 font-mono text-sm">false</td>
                                            <td className="py-2 px-4 text-sm">Whether the column can be filtered. If not specified, defaults to false.</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">visible</td>
                                            <td className="py-2 px-4 font-mono text-sm">boolean</td>
                                            <td className="py-2 px-4 font-mono text-sm">true</td>
                                            <td className="py-2 px-4 text-sm">Whether the column is displayed. If not specified, defaults to true.</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">filterType</td>
                                            <td className="py-2 px-4 font-mono text-sm">"string" | "number" | "date" | "boolean"</td>
                                            <td className="py-2 px-4 font-mono text-sm">"string"</td>
                                            <td className="py-2 px-4 text-sm">Type of filter to use. Only applies if filterable is true. If not specified, defaults to "string".</td>
                                        </tr>                                        <tr>
                                            <td className="py-2 px-4 font-mono text-sm text-blue-700">align</td>
                                            <td className="py-2 px-4 font-mono text-sm">"left" | "center" | "right"</td>
                                            <td className="py-2 px-4 font-mono text-sm">"left"</td>
                                            <td className="py-2 px-4 text-sm">Cell text alignment. If not specified, defaults to "left".</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                                
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="basic-column">
                                    <AccordionTrigger>Basic Text Column</AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
{`{
    key: "status",
    header: "Status",
    filterable: true,
    visible: true,
    filterType: "string"
}`}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="nested-property">
                                    <AccordionTrigger>Handling Nested Properties</AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
{`// For data with nested objects like:
// { id: 1, user: { name: "John", role: "Admin" }, ... }

// Use a function for the key to access nested properties
{
    key: (row) => row.user.name,
    header: "User Name",
    filterable: true,
    visible: true
}

// Two approaches for handling nested objects:
// 1) Function accessor:
//    key: (row) => row.user.name
//    - Works well for displaying the data
//    - The column won't be sortable by default
//    - Use this when sorting isn't needed

// 2) String key with dot notation:
//    key: "user.name"
//    - Recommended if you need sortable columns
//    - Makes the column behave like regular columns (sortable, filterable)
//    - Some table implementations support this notation for nested props

// For deeply nested properties or complex access patterns:
{
    key: (row) => {
        // Can include any logic here
        return row.contacts?.[0]?.email || "No email";
    },
    header: "Primary Email",
    visible: true
}`}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="custom-header">
                                    <AccordionTrigger>Column with Custom Header</AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
{`{
    key: "budget",
    header: (
        <div className="flex items-center gap-2 text-green-600">
            <DollarSign size={16} />
            <span>Budget (RM)</span>
        </div>
    ),
    filterable: true,
    filterType: "number",
    align: "right"
}`}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="custom-render">
                                    <AccordionTrigger>Column with Custom Render Function</AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
{`{
    key: "completion",
    header: "Completion",
    render: (value) => (
        <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className={\`h-2 rounded-full \${value < 30 ? 'bg-red-500' : 
                        value < 70 ? 'bg-yellow-500' : 'bg-green-500'}\`} 
                    style={{ width: \`\${value}%\` }}
                ></div>
            </div>
            <span className="text-sm">{value}%</span>
        </div>
    ),
    filterable: true,
    filterType: "number"
}`}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="actions-column">
                                    <AccordionTrigger>Actions Column</AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
{`{
    key: (row) => (
        <div className="flex items-center space-x-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewPhase(row.id)}
            >
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePhase(row.id)}
            >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
            </Button>
        </div>
    ),    header: "Actions",
    align: "center"
}`}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* EXAMPLES TAB */}
                <TabsContent value="examples" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Common Use Cases</CardTitle>
                            <CardDescription>
                                Code examples for common DataTable implementations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">                                <AccordionItem value="simple">
                                    <AccordionTrigger>Basic DataTable (Currently Supported)</AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
{`import DataTable, { Column } from '@/components/ui/datatable';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

// Basic data
const data = [
  { id: 1, name: "Item 1", status: "Active" },
  { id: 2, name: "Item 2", status: "Inactive" }
];

// Basic columns
const columns: Column[] = [
  {
    key: "name",
    header: "Name",
    filterable: true,
    visible: true
  },
  {
    key: "status", 
    header: "Status",
    filterable: true,
    filterType: "string",
    visible: true
  },
  {
    key: (row) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => console.log('View', row.id)}
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
    header: "Actions",
    align: "center"
  }
];

// Component using DataTable (with only implemented props)
const MyTable = () => {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={10}
      isLoading={false}
    />
  );
};`}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                                  <AccordionItem value="server-data">
                                    <AccordionTrigger>Fetching Data from API (Currently Supported)</AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
{`import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/ui/datatable';

const APIDataTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.example.com/items');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const columns: Column[] = [
    {
      key: "name",
      header: "Name",
      filterable: true,
      visible: true
    },
    // Other columns...
  ];
  
  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={10}
      isLoading={isLoading}
    />
  );
};`}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>                                <AccordionItem value="event-handling">
                                    <AccordionTrigger>Custom Actions (Using Column Render)</AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
{`import DataTable, { Column } from '@/components/ui/datatable';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const InteractiveTable = () => {
  const { toast } = useToast();
  
  // Handlers for row actions
  const handleView = (id) => {
    toast({ title: \`Viewing item \${id}\` });
  };
  
  const handleEdit = (id) => {
    toast({ title: \`Editing item \${id}\` });
  };
  
  const handleDelete = (id) => {
    toast({ 
      title: \`Deleting item \${id}\`,
      variant: "destructive"
    });
  };
  
  const columns: Column[] = [
    // Regular columns...
    {
      key: (row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(row.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      header: "Actions",
      align: "center"
    }
  ];
  
  // Note: In the current implementation, onRowClick is not supported
  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={10}
      isLoading={false}
    />  );
};`}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BEST PRACTICES TAB */}
                <TabsContent value="bestPractices" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Best Practices</CardTitle>
                            <CardDescription>
                                Tips for effectively using the DataTable component
                            </CardDescription>
                        </CardHeader>                        <CardContent>                            <div className="space-y-6">
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                    <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center gap-2">
                                        <Settings size={18} />
                                        Core Features
                                    </h3>
                                    <p className="text-blue-800 mb-3">
                                        Key features of the DataTable component:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-blue-800">
                                        <li><strong>Data display:</strong> Renders data in a structured table format with configurable columns</li>
                                        <li><strong>Pagination:</strong> Automatically splits data into pages with navigation controls</li>
                                        <li><strong>Page size:</strong> Configure how many rows appear per page (defaults to 10)</li>
                                        <li><strong>Loading state:</strong> Shows a loading indicator when data is being fetched</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                                    <h3 className="text-lg font-medium text-purple-800 mb-2 flex items-center gap-2">
                                        <Settings size={18} />
                                        Default Behavior
                                    </h3>
                                    <p className="text-purple-800 mb-3">
                                        Working with the DataTable component:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-purple-800">
                                        <li><strong>Minimal setup:</strong> At minimum, provide <code>data</code> and <code>columns</code> arrays</li>
                                        <li><strong>Pagination:</strong> Tables show 10 rows per page by default</li>
                                        <li><strong>Column visibility:</strong> All columns are visible by default unless set with <code>visible: false</code></li>
                                        <li><strong>Column alignment:</strong> Content aligns left by default unless specified with <code>align</code> property</li>
                                        <li><strong>Loading:</strong> When <code>isLoading=true</code>, a spinner appears over the table</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                                    <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center gap-2">
                                        <Info size={18} />
                                        Column Configuration
                                    </h3>
                                    <ul className="list-disc pl-6 space-y-2 text-blue-800">
                                        <li>Keep column headers concise and clear</li>
                                        <li>Use icons in headers to provide visual cues about the column content</li>
                                        <li>Hide less important columns by default (set <code>visible: false</code>)</li>
                                        <li>Set appropriate alignment based on content type (numbers right-aligned, text left-aligned)</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                                    <h3 className="text-lg font-medium text-green-800 mb-2 flex items-center gap-2">
                                        <Filter size={18} />
                                        Filtering & Sorting
                                    </h3>
                                    <ul className="list-disc pl-6 space-y-2 text-green-800">                                        <li>Set <code>filterType</code> correctly for each column to ensure proper filter functionality</li>
                                        <li>Only make columns filterable when it adds value to the user</li>
                                        <li>Consider performance impact for large datasets when enabling all filter options</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                                    <h3 className="text-lg font-medium text-yellow-800 mb-2 flex items-center gap-2">
                                        <SortAsc size={18} />
                                        Performance Considerations
                                    </h3>
                                    <ul className="list-disc pl-6 space-y-2 text-yellow-800">
                                        <li>Keep <code>render</code> functions simple to avoid performance issues</li>
                                        <li>Consider using memo or useMemo for complex renders or large datasets</li>
                                        <li>For server-side data, implement proper loading states</li>
                                        <li>Avoid excessive re-renders by using stable references for handlers</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 text-sm text-gray-600 p-4">
                            Remember: The DataTable component is designed to handle both simple and complex use cases. 
                            Start with a minimal implementation and add features as needed.
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default TestTable;