import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList } from "lucide-react"

type DocketCardProps = {
    loading?: boolean
    totalDockets?: number
    minorDockets?: number
    majorDockets?: number
}

export const DocketCard_byPhase = () => {
    return (
        <Card className="shadow-sm border border-gray-200 h-full overflow-hidden">
            <CardHeader className="p-4 bg-white border-b">
                <CardTitle className="text-lg font-medium text-gray-800">Total Docket Open</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 bg-white">
                <div className="p-2.5 rounded-full bg-blue-50 mb-2">
                    <ClipboardList className="h-7 w-7 text-blue-500" />
                </div>
                <div className="text-4xl font-bold text-gray-800">182</div>
                <div className="text-gray-600 text-sm mt-2">Current open maintenance dockets</div>
                <div className="mt-4 pt-4 border-t border-gray-100 w-full flex justify-between text-sm">
                    <div className="flex flex-col items-center">
                        <span className="font-medium text-blue-600">67</span>
                        <span className="text-gray-500">Minor</span>
                    </div>
                    <div className="h-full w-px bg-gray-100"></div>
                    <div className="flex flex-col items-center">
                        <span className="font-medium text-red-500">115</span>
                        <span className="text-gray-500">Major</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


