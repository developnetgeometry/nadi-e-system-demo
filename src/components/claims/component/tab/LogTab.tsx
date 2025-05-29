import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface LogTabProps {
    claimData: {
        logs: Array<{
            id: number;
            remark?: string | null;
            created_at?: string | null;
            status_id?: { id?: number; name?: string } | null;
            created_by?: { full_name?: string; email?: string } | null;
        }>;
    };
}

const LogTab: React.FC<LogTabProps> = ({ claimData }) => {
    const { logs } = claimData;

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Claim Logs</h2>

            <Table className="border border-gray-300 w-full text-sm">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-4 py-2">Date</TableHead>
                        <TableHead className="px-4 py-2">Status</TableHead>
                        <TableHead className="px-4 py-2">Remark</TableHead>
                        <TableHead className="px-4 py-2">By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log, index) => (
                        <TableRow key={log?.id || index} >
                            <TableCell className="px-4 py-2">
                                {log?.created_at
                                    ? new Date(new Date(log.created_at).getTime() + 8 * 60 * 60 * 1000).toLocaleString("en-GB")
                                    : "N/A"}
                            </TableCell>
                            <TableCell className="px-4 py-2">{log?.status_id?.name || "N/A"}</TableCell>
                            <TableCell className="px-4 py-2">{log?.remark || "No remark"}</TableCell>
                            <TableCell className="px-4 py-2">
                                {log?.created_by?.full_name
                                    ? `${log.created_by.full_name} - ${log.created_by.email || "No email"}`
                                    : "Unknown"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default LogTab;