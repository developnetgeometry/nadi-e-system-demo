import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'
import React from 'react'

type UpscalingTrainingCard = {
    // Define any props if needed
}

export const UpscalingTrainingCard = ({ 
    
}: UpscalingTrainingCard) => {
    return (
        <Card className="overflow-hidden shadow-sm border border-gray-200">
            <CardHeader className="p-4 bg-white border-b">
                <CardTitle className="text-lg font-medium text-gray-800">Upscaling Training</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-blue-50">
                            <GraduationCap className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-gray-600 font-medium">Trained Staff</span>
                    </div>
                </div>
                <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                        <span className="text-gray-600">Total Employees:</span>
                        <span className="font-medium">172</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-gray-600">Manager:</span>
                        <span className="font-medium">43</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-gray-600">Assistant Manager:</span>
                        <span className="font-medium">62</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-gray-600">Total NADI:</span>
                        <span className="font-medium">67</span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    )
}
