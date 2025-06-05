import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgramsParticipantswithNADIInvolvementData } from '@/hooks/report/use-smartservice-byphase-data'
import React from 'react'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ProgramsParticipantswithNADIInvolvementCardProps = {
    programsAndParticipantsData:ProgramsParticipantswithNADIInvolvementData[]
}

const ProgramsParticipantswithNADIInvolvementCard = ({
    programsAndParticipantsData= [] 

}: ProgramsParticipantswithNADIInvolvementCardProps) => {
    return (
        <Card className="shadow-sm border border-gray-200 overflow-hidden">
            <CardHeader className="p-4 bg-white border-b">
                <CardTitle className="text-lg font-medium text-gray-800">Programs and Participants with NADI Involvement</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart
                        data={programsAndParticipantsData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="programs" name="Number of Programs" fill="#4f46e5" />
                        <Bar yAxisId="left" dataKey="participants" name="Number of Participants" fill="#ef4444" />
                        <Line yAxisId="right" type="monotone" dataKey="nadiInvolved" name="Total NADI Involved" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default ProgramsParticipantswithNADIInvolvementCard