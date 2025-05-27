import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DocketData } from "@/hooks/report/use-cm-bynadi-data";

interface DocketBarGraphProps {
    docketStatusData: DocketData[]
}

export const DocketBarGraph_byNADI = ({
    docketStatusData = []
}: DocketBarGraphProps) => {
    return (
        <Card className="shadow-sm border border-gray-200 h-full overflow-hidden">
            <CardHeader className="p-4 bg-white border-b">
                <CardTitle className="text-lg font-medium text-gray-800">Number of Dockets by Status (Minor & Major)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={docketStatusData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="minor" fill="#4f46e5" name="Minor" />
                        <Bar dataKey="major" fill="#ef4444" name="Major" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DocketBarGraph_byNADI