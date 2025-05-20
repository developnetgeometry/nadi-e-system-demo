import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";


type ClaimData = {
    year: number;
    quarter: number;
    month: number;
    ref_no: string;
    tp_name: string; //additional
    dusp_name: string; //additional

};

type ClaimDateFormProps = ClaimData & {
    updateFields: (fields: Partial<ClaimData>) => void;
};

export function ClaimDateForm({
    year,
    quarter,
    month,
    ref_no,
    tp_name,
    dusp_name,
    updateFields,
}: ClaimDateFormProps) {

    useEffect(() => {
        if (dusp_name && tp_name && year && quarter && month) {
            const monthNames = [
                "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
            ];
            const yy = year.toString().slice(-2);
            const q = `Q${quarter}`;
            const mmm = monthNames[month - 1];

            const generatedRefNo = `${dusp_name}-${tp_name}-${yy}-${q}-${mmm}`;
            updateFields({ ref_no: generatedRefNo });
        }
    }, [dusp_name, tp_name, year, quarter, month, updateFields]);


    return (
        <>
            <DialogTitle className="mb-4">Reference</DialogTitle>
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
                {/* Quarter */}
                <div className="space-y-2">
                    <Label className="flex items-center">Quarter</Label>
                    <Input
                        type="text"
                        name="quarter"
                        value={quarter ? `Q${quarter}` : ""}
                        onChange={(e) => updateFields({ quarter: Number(e.target.value) })}
                        maxLength={1}
                        disabled
                    />
                </div>
                {/* ref_id */}
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

            <DialogTitle className="mb-4">Initialize Date</DialogTitle>
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

                {/* Month */}
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



            </div>
        </>
    );
}
