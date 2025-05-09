
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Graph() {
    const [period, setPeriod] = useState("weekly");

    const weeklyData = [
        { name: 'Mon', workOrders: 12, completed: 10 },
        { name: 'Tue', workOrders: 19, completed: 15 },
        { name: 'Wed', workOrders: 15, completed: 12 },
        { name: 'Thu', workOrders: 21, completed: 18 },
        { name: 'Fri', workOrders: 18, completed: 14 },
        { name: 'Sat', workOrders: 8, completed: 8 },
        { name: 'Sun', workOrders: 5, completed: 5 },
    ];

    const monthlyData = [
        { name: 'Week 1', workOrders: 62, completed: 53 },
        { name: 'Week 2', workOrders: 72, completed: 65 },
        { name: 'Week 3', workOrders: 58, completed: 49 },
        { name: 'Week 4', workOrders: 65, completed: 60 },
    ];

    const performanceData = [
        { name: 'Electrical', average: 1.2, best: 0.8 },
        { name: 'Plumbing', average: 1.5, best: 1.1 },
        { name: 'HVAC', average: 2.3, best: 1.7 },
        { name: 'Mechanical', average: 1.8, best: 1.3 },
        { name: 'Structural', average: 3.2, best: 2.4 },
    ];

    return (
        <DashboardLayout>
            {/* <PageContainer> */}
            <PageHeader
                title="Analytics & Graphs"
                description="Visual representation of work order metrics"
            />

            <Tabs defaultValue="workorders" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="workorders">Work Order Volume</TabsTrigger>
                    <TabsTrigger value="performance">Response Time</TabsTrigger>
                    <TabsTrigger value="satisfaction">Customer Satisfaction</TabsTrigger>
                </TabsList>

                <TabsContent value="workorders">
                    <Card className="p-6">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium">Work Order Volume</h3>
                            <div className="flex space-x-2">
                                <button
                                    className={`px-3 py-1 text-sm rounded-md ${period === "weekly" ? "bg-primary text-white" : "bg-slate-100"}`}
                                    onClick={() => setPeriod("weekly")}
                                >
                                    Weekly
                                </button>
                                <button
                                    className={`px-3 py-1 text-sm rounded-md ${period === "monthly" ? "bg-primary text-white" : "bg-slate-100"}`}
                                    onClick={() => setPeriod("monthly")}
                                >
                                    Monthly
                                </button>
                            </div>
                        </div>

                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={period === "weekly" ? weeklyData : monthlyData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="workOrders" stroke="#3b82f6" strokeWidth={2} name="Work Orders" />
                                    <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="performance">
                    <Card className="p-6">
                        <h3 className="text-lg font-medium mb-4">Average Response Time by Service Type (Hours)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={performanceData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="average" fill="#6366f1" name="Avg Response Time" />
                                    <Bar dataKey="best" fill="#2dd4bf" name="Best Response Time" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="satisfaction">
                    <Card className="p-6">
                        <h3 className="text-lg font-medium mb-4">Customer Satisfaction Score</h3>
                        <div className="flex justify-center items-center h-80">
                            <div className="text-center">
                                <div className="text-7xl font-bold text-primary">4.7</div>
                                <div className="text-xl text-slate-500 mt-3">Average Rating</div>
                                <div className="flex items-center justify-center mt-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className={`w-8 h-8 ${star <= 4 ? "text-yellow-400" : "text-yellow-200"}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <div className="mt-6 text-sm text-slate-500">
                                    Based on 456 completed work orders in the last 30 days
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
            {/* </PageContainer> */}
        </DashboardLayout>
    );
}
