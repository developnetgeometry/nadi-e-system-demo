import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { programParticipantDataType } from '@/hooks/report/use-smartservice-bymonth-data';
import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ProgrammeParticipantCardProps = {
    programParticipantData: programParticipantDataType[];
}

const ProgrammeParticipantCard = ({
    programParticipantData = [],
}:ProgrammeParticipantCardProps) => {
    return (
        <Card className="shadow-sm border border-gray-200 overflow-hidden">
            <CardHeader className="p-4 bg-white border-b">
                <CardTitle className="text-lg font-medium text-gray-800">Programs and Participants</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={programParticipantData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="programs" name="Number of Programs" fill="#4f46e5" />
                        <Bar dataKey="participants" name="Number of Participants" fill="#ef4444" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default ProgrammeParticipantCard