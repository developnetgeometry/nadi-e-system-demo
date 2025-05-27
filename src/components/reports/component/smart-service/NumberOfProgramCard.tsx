import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'
import React from 'react'

type NumberOfProgramCardProps = {
    // Define any props if needed, currently empty
}

const NumberOfProgramCard = ({
    
}:NumberOfProgramCardProps) => {
    return (
        <Card className="shadow-sm border border-gray-200 overflow-hidden">
            <CardHeader className="p-4 bg-white border-b">
                <CardTitle className="text-lg font-medium text-gray-800">Number of Program</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white">
                <div className="flex flex-col items-center">
                    <div className="p-2 rounded-full bg-indigo-50 mb-1">
                        <CalendarDays className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mt-1">48</div>
                    <div className="text-gray-600 text-sm">Total active programs</div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 w-full">
                    <div className="grid grid-cols-3 gap-1 text-sm">
                        <div className="flex flex-col items-center">
                            <span className="font-medium text-indigo-600">21</span>
                            <span className="text-gray-500">Entrepreneur</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-medium text-green-500">18</span>
                            <span className="text-gray-500">L. Learning</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-medium text-amber-500">9</span>
                            <span className="text-gray-500">Wellbeing</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default NumberOfProgramCard