import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import React from 'react'

type NumberOfParticipantCardProps = {
    // Define any props if needed, currently empty
}

const NumberOfParticipantCard = ({

}: NumberOfParticipantCardProps) => {
    return (
        <Card className="shadow-sm border border-gray-200 overflow-hidden">
            <CardHeader className="p-4 bg-white border-b">
                <CardTitle className="text-lg font-medium text-gray-800">Number of Participants</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white">
                <div className="flex flex-col items-center">
                    <div className="p-2 rounded-full bg-purple-50 mb-1">
                        <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mt-1">624</div>
                    <div className="text-gray-600 text-sm">Total program participants</div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 w-full">
                    <div className="flex justify-between text-sm">
                        <div className="flex flex-col items-center">
                            <span className="font-medium text-blue-600">412</span>
                            <span className="text-gray-500">NADI Members</span>
                        </div>
                        <div className="h-full w-px bg-gray-100"></div>
                        <div className="flex flex-col items-center">
                            <span className="font-medium text-pink-500">212</span>
                            <span className="text-gray-500">External</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default NumberOfParticipantCard