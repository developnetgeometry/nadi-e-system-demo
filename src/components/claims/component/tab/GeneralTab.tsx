import React from "react";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Import Table components

interface GeneralTabProps {
    claimData: {
        id: number;
        year: number;
        quarter: number;
        month: number;
        ref_no: string;
        date_paid: string;
        payment_status: boolean;
        claim_type: string;
        claim_status: { id: number; name: string };
        tp_dusp_id: {
            id: string;
            name: string;
            parent_id: { id: string; name: string };
        };
    };
}

const GeneralTab: React.FC<GeneralTabProps> = ({ claimData }) => {
    const {
        year,
        quarter,
        month,
        ref_no,
        date_paid,
        claim_type,
        payment_status,
        claim_status,
        tp_dusp_id,
    } = claimData;

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "DRAFTED":
                return "default";
            case "SUBMITTED":
                return "info";
            case "PROCESSING":
                return "warning";
            case "COMPLETED":
                return "success";
            case "REJECTED":
                return "destructive";
            default:
                return "secondary";
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">General Claim Information</h2>

            <Table className="border border-gray-300 w-full text-sm">
                <TableBody>
                    <TableRow>
                        <TableCell className="px-4 py-2">Year</TableCell>
                        <TableCell className="px-4 py-2">{year ?? "N/A"}</TableCell>
                    </TableRow>
                    {claim_type !== "YEARLY" && (
                        <TableRow>
                            <TableCell className="px-4 py-2">Quarter</TableCell>
                            <TableCell className="px-4 py-2">{quarter ? `Q${quarter}` : "N/A"}</TableCell>
                        </TableRow>
                    )}
                    {claim_type !== "YEARLY" && claim_type !== "QUARTERLY" && (
                        <TableRow>
                            <TableCell className="px-4 py-2">Month</TableCell>
                            <TableCell className="px-4 py-2">
                                {month
                                    ? new Date(0, month - 1).toLocaleString("default", { month: "long" })
                                    : "N/A"}
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell className="px-4 py-2">Reference Number</TableCell>
                        <TableCell className="px-4 py-2">{ref_no ?? "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="px-4 py-2">TP DUSP</TableCell>
                        <TableCell className="px-4 py-2">
                            {tp_dusp_id?.name ?? "N/A"} ({tp_dusp_id?.parent_id.name ?? "N/A"})
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="px-4 py-2">Payment Status</TableCell>
                        <TableCell className="px-4 py-2">
                            <Badge variant={payment_status ? "success" : "warning"}>
                                {payment_status ? "Paid" : "Unpaid"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="px-4 py-2">Date Paid</TableCell>
                        <TableCell className="px-4 py-2">
                            {date_paid ? new Date(date_paid).toLocaleDateString() : "N/A"}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="px-4 py-2">Claim Status</TableCell>
                        <TableCell className="px-4 py-2">
                            <Badge variant={getStatusBadgeVariant(claim_status?.name)}>
                                {claim_status?.name ?? "N/A"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default GeneralTab;