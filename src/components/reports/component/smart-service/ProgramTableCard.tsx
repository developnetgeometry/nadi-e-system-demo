import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PillarByProgrammeData } from '@/hooks/report/use-smartservice-pillarbyprogramme-data';
import React from 'react'

type ProgramTableCardProps = {
    programTableData?: PillarByProgrammeData[]; // Optional prop for program data, defaulting to an empty array 
    // Define any props if needed, currently empty
}

const ProgramTableCard = ({
    programTableData = [] // Default to an empty array if no data is provided
}: ProgramTableCardProps) => {
    return (
        <Card className="shadow-sm border border-gray-200 overflow-hidden">
            <CardHeader className="p-4 bg-white border-b">
                <CardTitle className="text-lg font-medium text-gray-800">Program Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Program Name</TableHead>
                            <TableHead>Date Program</TableHead>
                            <TableHead>Channel/ Types</TableHead>
                            <TableHead>Online /Physical</TableHead>
                            <TableHead>Total Participants</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {programTableData.map((program) => (
                            <TableRow key={program.id}>
                                <TableCell>{program.id}</TableCell>
                                <TableCell className="font-medium">{program.name}</TableCell>
                                <TableCell>{program.date}</TableCell>
                                <TableCell>{program.channel}</TableCell>
                                <TableCell>{program.format}</TableCell>
                                <TableCell>{program.participants}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default ProgramTableCard