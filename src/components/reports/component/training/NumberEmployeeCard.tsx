import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'
import React from 'react'

type NumberEmployeeCardProps = {
    // Define any props if needed
}

export const NumberEmployeeCard = ({
    
}:NumberEmployeeCardProps) => {
    return (
       <Card className="overflow-hidden shadow-sm border border-gray-200">
            <CardHeader className="p-4 bg-white border-b">
              <CardTitle className="text-lg font-medium text-gray-800">Number of Employees</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white flex flex-col items-center">
              <div className="mt-4 flex flex-col items-center">
                <div className="text-5xl font-bold text-gray-800">258</div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600 font-medium">Total Staff</span>
              </div>
            </CardContent>
          </Card>
    )
}
