import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Download, RefreshCw, Trash2 } from "lucide-react";
import { Progress } from "@radix-ui/react-progress";
import { Textarea } from "@/components/ui/textarea";
import useClaimCategorySimple from "../../hook/use-claim-categoy-simple";
import { useSiteByPhase } from "../../hook/use-claim-data";

interface ReportEditTabProps {
    claimData: any;
    onDataChange: (hasChanges: boolean) => void;
}

const ReportEditTab: React.FC<ReportEditTabProps> = ({ claimData, onDataChange }) => {
    const { categories } = useClaimCategorySimple();
    const { phases, fetchSitesByPhase } = useSiteByPhase();
    const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [progressAll, setProgressAll] = useState(0);

    const [formData, setFormData] = useState({
        phase_id: claimData.phase_id.id,
        category_ids: [] as any[], // Will be populated from requests
    });

    const [originalData] = useState({
        phase_id: claimData.phase_id.id,
        category_ids: [] as any[],
    });

    // Check if form data has changed
    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
        onDataChange(hasChanges);
    }, [formData, originalData, onDataChange]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const generateSummaryReport = async (itemId: number) => {
        setGeneratingIndex(itemId);
        setProgress(0);

        // Simulate progress
        let newProgress = 0;
        while (newProgress <= 80) {
            const increment = Math.floor(Math.random() * 10) + 5;
            newProgress = Math.min(newProgress + increment, 100);
            setProgress(newProgress);
            if (newProgress > 80) break;
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        try {
            // TODO: Implement actual report generation logic
            console.log(`Generating report for item ${itemId}`);
            setProgress(100);
            
            // Simulate opening in new tab
            setTimeout(() => {
                console.log(`Report generated for item ${itemId}`);
            }, 500);

        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setGeneratingIndex(null);
            setProgress(0);
        }
    };

    const downloadSummaryReport = async (itemId: number) => {
        setGeneratingIndex(itemId);
        setProgress(0);

        // Simulate progress
        let newProgress = 0;
        while (newProgress <= 80) {
            const increment = Math.floor(Math.random() * 10) + 5;
            newProgress = Math.min(newProgress + increment, 100);
            setProgress(newProgress);
            if (newProgress > 80) break;
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        try {
            // TODO: Implement actual report download logic
            console.log(`Downloading report for item ${itemId}`);
            setProgress(100);

        } catch (error) {
            console.error('Error downloading report:', error);
        } finally {
            setGeneratingIndex(null);
            setProgress(0);
        }
    };

    const handleDownloadAllReports = async () => {
        setIsDownloading(true);
        setProgressAll(0);

        try {
            // TODO: Implement combined report generation
            let newProgress = 0;
            while (newProgress < 100) {
                const increment = Math.floor(Math.random() * 10) + 5;
                newProgress = Math.min(newProgress + increment, 100);
                setProgressAll(newProgress);
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            console.log('Combined report generated');

        } catch (error) {
            console.error('Error creating combined report:', error);
        } finally {
            setIsDownloading(false);
            setProgressAll(0);
        }
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log("Saving changes:", formData);
        onDataChange(false); // Reset changes state after save
    };

    const handleReset = () => {
        setFormData(originalData);
        onDataChange(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Edit Claim Reports And Attachments (Draft)</h2>
                <div className="space-x-2">
                    <Button variant="outline" onClick={handleReset}>
                        Revert
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <header>Category & Items Attachments</header>
                <Button
                    onClick={handleDownloadAllReports}
                    disabled={isDownloading || formData.category_ids.length === 0}
                    className="flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    {isDownloading ? 'Generating Combined Report...' : 'Download All Combined Report'}
                </Button>
            </div>

            {isDownloading && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Generating Combined Report...</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progressAll}%` }} />
                    </div>
                </div>
            )}

            <Table className="border border-gray-300 w-full text-sm">
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="px-4 py-2 border">Category</TableHead>
                        <TableHead className="px-4 py-2 border">Items</TableHead>
                        <TableHead className="px-4 py-2 text-center border">Summary Report</TableHead>
                        <TableHead className="px-4 py-2 text-center border">Supporting Document</TableHead>
                        <TableHead className="px-4 py-2 text-center border">Remark</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {formData.category_ids.map((category) =>
                        category.item_ids.map((item, itemIndex) => (
                            <TableRow key={`category-${category.id}-item-${item.id}`}>
                                {/* Show category name only for the first item in each category */}
                                {itemIndex === 0 ? (
                                    <TableCell rowSpan={category.item_ids.length} className="px-4 py-2 border font-semibold align-top">
                                        {category.name}
                                    </TableCell>
                                ) : null}

                                <TableCell className="px-4 py-2 border">{item.name}</TableCell>

                                <TableCell className="px-4 py-2 border text-center">
                                    {item.need_summary_report ? (
                                        generatingIndex === item.id ? (
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm font-medium">Generating...</label>
                                                    <span className="text-sm text-muted-foreground">{progress}%</span>
                                                </div>
                                                <Progress value={progress} className="h-2 bg-blue-100">
                                                    <div
                                                        className="h-full bg-blue-600 rounded-full"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </Progress>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => generateSummaryReport(item.id)}
                                                    className="text-xs px-3 py-1"
                                                >
                                                    View Report
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => downloadSummaryReport(item.id)}
                                                    className="text-xs px-3 py-1"
                                                >
                                                    Download Report
                                                </Button>
                                            </div>
                                        )
                                    ) : (
                                        <span className="text-gray-500">Not Required</span>
                                    )}
                                </TableCell>

                                <TableCell className="px-4 py-2 text-center border">
                                    {item.need_support_doc ? (
                                        <div className="flex flex-col items-center gap-2">
                                            {item.suppport_doc_file?.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {item.suppport_doc_file.map((file, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <a
                                                                href={URL.createObjectURL(file)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 underline"
                                                            >
                                                                {file.name}
                                                            </a>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-red-600"
                                                                onClick={() => {
                                                                    const updatedFiles = item.suppport_doc_file!.filter((_, i) => i !== idx);
                                                                    item.suppport_doc_file = updatedFiles.length ? updatedFiles : null;
                                                                    handleInputChange('category_ids', [...formData.category_ids]);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">No Files</span>
                                            )}

                                            <div>
                                                <input
                                                    type="file"
                                                    id={`fileInput-${category.id}-${item.id}`}
                                                    className="hidden"
                                                    multiple
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            const newFiles = Array.from(e.target.files);
                                                            item.suppport_doc_file = [...(item.suppport_doc_file || []), ...newFiles];
                                                            handleInputChange('category_ids', [...formData.category_ids]);
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`fileInput-${category.id}-${item.id}`}
                                                    className="cursor-pointer text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                                                >
                                                    Upload File
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">Not Required</span>
                                    )}
                                </TableCell>

                                <TableCell className="px-4 py-2 border">
                                    <Textarea
                                        placeholder="Enter remark..."
                                        value={item.remark || ""}
                                        onChange={(e) => {
                                            item.remark = e.target.value;
                                            handleInputChange('category_ids', [...formData.category_ids]);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ReportEditTab;