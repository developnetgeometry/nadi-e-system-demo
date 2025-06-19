import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { getStartAndEndDate } from "../hook/getStartAndEndDate";
// import { useRef } from "react";
import { useClaimRunningNum } from "../hook/getRunningClaim";

type ClaimData = {
    claim_type: string;
    year: number;
    quarter: number;
    month: number;
    start_date: string;
    end_date: string;
    ref_no: string;
    tp_name: string; //additional
    dusp_name: string; //additional
    phase_id?: number;
    tp_dusp_id: string;

};

type ClaimDateFormProps = ClaimData & {
    updateFields: (fields: Partial<ClaimData>) => void;
};

export function ClaimDateForm({
    claim_type,
    year,
    quarter,
    month,
    start_date,
    end_date,
    ref_no,
    tp_name,
    dusp_name,
    phase_id,
    tp_dusp_id,
    updateFields,
}: ClaimDateFormProps) {
    // const runningNoRef = useRef(Date.now().toString()); // Static on mount
    // const runningNo = runningNoRef.current;
    const runningNoQuery = useClaimRunningNum(year, tp_dusp_id);
    const runningNo = runningNoQuery.data?.toString().padStart(5, "0");
    const quarterMonths = {
        1: ["January", "February", "March"],
        2: ["April", "May", "June"],
        3: ["July", "August", "September"],
        4: ["October", "November", "December"],
    };

    useEffect(() => {
        // Ensure claim_type is set before running the logic
        if (dusp_name && tp_name && year && claim_type) {
            const yy = year.toString().slice(-2);
            let generatedRefNo = "";

            if (claim_type === "YEARLY") {
                generatedRefNo = `${dusp_name}-${tp_name}-${yy}-YEARLY_${runningNo}`;
            } else if (claim_type === "QUARTERLY" && quarter) {
                const q = `Q${quarter}`;
                generatedRefNo = `${dusp_name}-${tp_name}-${yy}-${q}-QUARTERLY_${runningNo}`;
            } else if (claim_type === "MONTHLY" && quarter && month) {
                const monthNames = [
                    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                ];
                const q = `Q${quarter}`;
                const mmm = monthNames[month - 1];
                generatedRefNo = `${dusp_name}-${tp_name}-${yy}-${q}-${mmm}-MONTHLY_${runningNo}`;
            }

            try {
                // Run getStartAndEndDate based on conditions
                if (claim_type === "YEARLY" && year) {
                    const { start_date: calculatedStartDate, end_date: calculatedEndDate } = getStartAndEndDate(claim_type, year);
                    updateFields({ start_date: calculatedStartDate, end_date: calculatedEndDate });
                }
                if (claim_type === "QUARTERLY" && year && quarter) {
                    const { start_date: calculatedStartDate, end_date: calculatedEndDate } = getStartAndEndDate(claim_type, year, quarter);
                    updateFields({ start_date: calculatedStartDate, end_date: calculatedEndDate });
                }
                if (claim_type === "MONTHLY" && year && quarter && month) {
                    const { start_date: calculatedStartDate, end_date: calculatedEndDate } = getStartAndEndDate(claim_type, year, quarter, month);
                    updateFields({ start_date: calculatedStartDate, end_date: calculatedEndDate });
                }
            } catch (error) {
                console.error("Error calculating start and end dates:", error);
            }

            updateFields({ ref_no: generatedRefNo, phase_id: null });
        }
    }, [dusp_name, tp_name, year, quarter, month, claim_type, updateFields]);

    return (
        <>
            <header className="mb-4">Reference</header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-mute-foreground rounded-md p-4 mb-4">
                {/* DUSP */}
                <div className="space-y-2">
                    <Label className="flex items-center">DUSP</Label>
                    <Input
                        type="text"
                        name="dusp_name"
                        value={dusp_name}
                        onChange={(e) => updateFields({ dusp_name: e.target.value })}
                        disabled
                    />
                </div>
                {/* TP */}
                <div className="space-y-2">
                    <Label className="flex items-center">TP</Label>
                    <Input
                        type="text"
                        name="tp_name"
                        value={tp_name}
                        onChange={(e) => updateFields({ tp_name: e.target.value })}
                        disabled
                    />
                </div>
                {/* Claim Type */}
                <div className="space-y-2">
                    <Label className="flex items-center">Claim Type</Label>
                    <Select
                        value={claim_type}
                        onValueChange={(value) => {
                            if (value === "YEARLY") {
                                updateFields({ claim_type: value, quarter: null, month: null }); // Reset quarter and month
                            } else if (value === "QUARTERLY") {
                                updateFields({ claim_type: value, month: null }); // Reset only month
                            } else if (value === "MONTHLY") {
                                const computedQuarter = Math.ceil(month / 3);
                                updateFields({ claim_type: value, quarter: computedQuarter }); // Compute quarter for monthly
                            } else {
                                updateFields({ claim_type: value }); // Default case
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select claim type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                            {/* <SelectItem value="MONTHLY">Monthly</SelectItem> */}
                        </SelectContent>
                    </Select>
                </div>
                {/* Reference ID */}
                <div className="space-y-2">
                    <Label className="flex items-center">Reference ID</Label>
                    <Input
                        type="text"
                        name="ref_no"
                        value={ref_no}
                        onChange={(e) => updateFields({ ref_no: e.target.value })}
                        disabled
                    />
                </div>
            </div>
            {(claim_type &&
                <>
                    <header className="mb-4">Initialize Date</header>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Year */}
                        <div className="space-y-2">
                            <Label className="flex items-center">Year</Label>
                            <Input
                                type="number"
                                name="year"
                                value={year}
                                onChange={(e) => updateFields({ year: Number(e.target.value) })}
                                maxLength={4}
                            />
                        </div>

                        {/* Quarter */}
                        {claim_type !== "YEARLY" && (
                            <div className="space-y-2">
                                <Label className="flex items-center">Quarter</Label>
                                <Select
                                    value={quarter?.toString() ?? ""}
                                    onValueChange={(value) => updateFields({ quarter: Number(value) })}
                                    disabled={claim_type === "MONTHLY"}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select quarter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Quarter 1</SelectItem>
                                        <SelectItem value="2">Quarter 2</SelectItem>
                                        <SelectItem value="3">Quarter 3</SelectItem>
                                        <SelectItem value="4">Quarter 4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {claim_type === "QUARTERLY" && quarter && (
                            <div className="mt-2 text-sm text-gray-600">
                                <span>Months in Quarter {quarter} : </span>
                                <span className="font-bold">{quarterMonths[quarter].join(", ")}</span>
                            </div>
                        )}

                        {/* Month */}
                        {/* {claim_type === "MONTHLY" && (
                            <div className="space-y-2">
                                <Label className="flex items-center">Month</Label>
                                <Select
                                    value={month?.toString() ?? ""}
                                    onValueChange={(value) => {
                                        const selectedMonth = Number(value);
                                        const computedQuarter = Math.ceil(selectedMonth / 3);
                                        updateFields({
                                            month: selectedMonth,
                                            quarter: computedQuarter,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">January</SelectItem>
                                        <SelectItem value="2">February</SelectItem>
                                        <SelectItem value="3">March</SelectItem>
                                        <SelectItem value="4">April</SelectItem>
                                        <SelectItem value="5">May</SelectItem>
                                        <SelectItem value="6">June</SelectItem>
                                        <SelectItem value="7">July</SelectItem>
                                        <SelectItem value="8">August</SelectItem>
                                        <SelectItem value="9">September</SelectItem>
                                        <SelectItem value="10">October</SelectItem>
                                        <SelectItem value="11">November</SelectItem>
                                        <SelectItem value="12">December</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )} */}
                    </div>
                </>
            )}
        </>
    );
}