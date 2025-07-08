import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { deleteAttachment } from "../../hook/upload-attachment";
import { updateClaimReport, updateRemark, uploadAttachment } from "../../tp/hooks/edit-reports-claim";

// Import all report templates
import { PDFDocument } from "pdf-lib";
import Audit from "../../template/SiteManagement/Audit";
import Salary from "../../template/Salary&HRManagement/Salary";
import PerformanceIncentive from "../../template/Salary&HRManagement/PerformanceIncentive";
import ManPower from "../../template/Salary&HRManagement/ManpowerManagement";
import LocalAuthority from "../../template/SiteManagement/LocalAuthority";
import Insurance from "../../template/SiteManagement/SiteInsurance";
import Agreement from "../../template/SiteManagement/SiteAgreement";
import Utilities from "../../template/SiteManagement/Utilities";
import AwarenessPromotion from "../../template/SiteManagement/Awareness&Promotion";
import CMS from "../../template/NADIeSystem/CMS";
import PortalWebService from "../../template/NADIeSystem/Portal&WebService";
import ManageInternetService from "../../template/InternetAccess/ManageInternetService";
import NMS from "../../template/InternetAccess/NMS";
import Monitoring from "../../template/InternetAccess/Monitoring&Reporting";
import Upscaling from "../../template/Training/Upscaling";
import Refresh from "../../template/Training/Refresh";
import Maintenance from "../../template/ComprehensiveMaintenance/Maintenance";
import SmartService from "../../template/SmartServices/SmartService";
import FrontPage from "../../template/component/FrontPage";
import Appendix from "../../template/component/Appendix";
interface ReportEditTabProps {
    claimData: any;
    onDataChange: (hasChanges: boolean) => void;
}

const ReportEditTab: React.FC<ReportEditTabProps> = ({ claimData, onDataChange }) => {
    const { categories } = useClaimCategorySimple();
    const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [progressAll, setProgressAll] = useState(0);

    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    // Helper function to map claimData.requests to category_ids format
    const mapRequestsToCategoryIds = (requests: any[], categories: any[]) => {
        return requests.map(request => {
            // Find the category from the categories list to get the name
            const categoryInfo = categories.find(cat => cat.id === request.id);

            return {
                id: request.id,
                name: request.name,
                item_ids: request.items.map((requestItem: any) => ({
                    id: requestItem.id, // Use requestItem.id instead of requestItem.item.id
                    item: {
                        id: requestItem.item.id,
                        name: requestItem.item.name,
                        need_support_doc: requestItem.item.need_support_doc,
                        need_summary_report: requestItem.item.need_summary_report,
                        status_item: requestItem.item.status_item,
                        remark: requestItem.item.remark,
                        suppport_doc_file: requestItem.item.suppport_doc_file,
                        summary_report_file: requestItem.item.summary_report_file,
                        site_ids: requestItem.item.site_ids
                    }
                }))
            };
        });
    };

    const [formData, setFormData] = useState({
        category_ids: [] as any[], // Will be populated from requests
    });

    const [originalData, setOriginalData] = useState({
        category_ids: [] as any[],
    });

    // Initialize formData and originalData when categories are loaded
    useEffect(() => {
        if (categories.length > 0 && claimData.requests) {
            const mappedCategoryIds = mapRequestsToCategoryIds(claimData.requests, categories);

            setFormData(prev => ({
                ...prev,
                category_ids: mappedCategoryIds
            }));

            // Update originalData as well for comparison
            setOriginalData({
                category_ids: mappedCategoryIds
            });
        }
    }, [categories, claimData.requests]);

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

    const generateReportForItem = async (itemId: number) => {
        let targetItem = null;
        let categoryIndex = -1;

        // Find the category and item
        for (let i = 0; i < formData.category_ids.length; i++) {
            const category = formData.category_ids[i];
            for (let j = 0; j < category.item_ids.length; j++) {
                if (category.item_ids[j].item.id === itemId) {
                    categoryIndex = i;
                    targetItem = category.item_ids[j];
                    break;
                }
            }
            if (targetItem) break;
        }

        if (!targetItem || !targetItem.item.need_summary_report) return null;

        // Find the first item in this category that needs a summary report for header logic
        const category = formData.category_ids[categoryIndex];
        const firstTrueItem = category.item_ids.find((itm: any) => itm.item.need_summary_report);
        const firstTrueItemId = firstTrueItem?.item.id;

        const reportData = {
            claimType: claimData.claim_type,
            quater: String(claimData.quarter),
            startDate: claimData.start_date,
            endDate: claimData.end_date,
            tpFilter: claimData.tp_dusp_id.id,
            phaseFilter: claimData.phase_id.id,
            duspFilter: claimData.tp_dusp_id.id,
            dusplogo: claimData.tp_dusp_id.parent_id.logo_url,
            nadiFilter: targetItem.item.site_ids,
            header: itemId === firstTrueItemId,
        };

        let generatedFile: File | null = null;

        try {
            if (itemId === 1) {
                generatedFile = await Salary(reportData);
            } else if (itemId === 2) {
                generatedFile = await PerformanceIncentive(reportData);
            } else if (itemId === 3) {
                generatedFile = await ManPower(reportData);
            } else if (itemId === 4) {
                generatedFile = await LocalAuthority(reportData);
            } else if (itemId === 5) {
                generatedFile = await Insurance(reportData);
            } else if (itemId === 6) {
                generatedFile = await Audit(reportData);
            } else if (itemId === 7) {
                generatedFile = await Agreement(reportData);
            } else if (itemId === 9) {
                generatedFile = await Utilities(reportData);
            } else if (itemId === 11) {
                generatedFile = await AwarenessPromotion(reportData);
            } else if (itemId === 13) {
                generatedFile = await CMS(reportData);
            } else if (itemId === 14) {
                generatedFile = await PortalWebService(reportData);
            } else if (itemId === 15) {
                generatedFile = await ManageInternetService(reportData);
            } else if (itemId === 16) {
                generatedFile = await NMS(reportData);
            } else if (itemId === 17) {
                generatedFile = await Monitoring(reportData);
            } else if (itemId === 18) {
                generatedFile = await Upscaling(reportData);
            } else if (itemId === 19) {
                generatedFile = await Refresh(reportData);
            } else if (itemId === 20) {
                generatedFile = await Maintenance(reportData);
            } else if (itemId === 24) {
                generatedFile = await SmartService(reportData);
            }

            return generatedFile;
        } catch (error) {
            console.error(`Error generating report for item ${itemId}:`, error);
            return null;
        }
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
            const generatedFile = await generateReportForItem(itemId);
            setProgress(100);

            if (generatedFile) {
                // Open the generated file in a new tab
                const fileURL = URL.createObjectURL(generatedFile);
                window.open(fileURL, '_blank');

                // Clean up the object URL after a short delay
                setTimeout(() => {
                    URL.revokeObjectURL(fileURL);
                }, 1000);
            }
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
            const generatedFile = await generateReportForItem(itemId);
            setProgress(100);

            if (generatedFile) {
                // Download the generated file
                const fileURL = URL.createObjectURL(generatedFile);
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = generatedFile.name || `report-${itemId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up the object URL after a short delay
                setTimeout(() => {
                    URL.revokeObjectURL(fileURL);
                }, 1000);
            }
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
            const pdfDoc = await PDFDocument.create();

            // Add the FrontPage as the first page
            const frontPageFile = await FrontPage({
                duspName: claimData.tp_dusp_id.parent_id.description,
                claimType: claimData.claim_type,
                year: claimData.year,
                quarter: claimData.quarter,
                month: claimData.month,
                dusplogo: claimData.tp_dusp_id.parent_id.logo_url,
            });
            const frontPageBytes = await frontPageFile.arrayBuffer();
            const frontPagePdf = await PDFDocument.load(frontPageBytes);
            const frontPagePages = await pdfDoc.copyPages(frontPagePdf, frontPagePdf.getPageIndices());
            frontPagePages.forEach((page) => pdfDoc.addPage(page));

            // Calculate progress increments
            let newProgress = 0;
            const totalItems = formData.category_ids.reduce((total, category) =>
                total + category.item_ids.length, 0
            );
            const increment1 = totalItems > 0 ? 80 / totalItems : 0;
            const increment2 = totalItems > 0 ? 20 / totalItems : 0;

            // Generate and add summary reports
            for (const category of formData.category_ids) {
                for (const item of category.item_ids) {
                    if (item.item.need_summary_report) {
                        setProgressAll(Math.min(newProgress, 80));
                        newProgress += increment1;

                        const reportFile = await generateReportForItem(item.item.id);

                        if (reportFile) {
                            const reportBytes = await reportFile.arrayBuffer();
                            const reportPdf = await PDFDocument.load(reportBytes);
                            const reportPages = await pdfDoc.copyPages(reportPdf, reportPdf.getPageIndices());
                            reportPages.forEach((page) => pdfDoc.addPage(page));
                        }
                    }
                }
            }

            // Add all attachments after items
            for (const category of formData.category_ids) {
                for (const item of category.item_ids) {
                    if (item.item.suppport_doc_file?.length > 0) {
                        setProgressAll(Math.min(newProgress, 100));
                        newProgress += increment2;

                        const appendixFile = await Appendix({
                            appendixNumber: "APPENDIX",
                            title: item.item.name,
                            attachments: item.item.suppport_doc_file.map((file: any) => ({
                                path: file.file_path,
                                description: `Supporting Document for ${item.item.name}`,
                            })),
                        });

                        const appendixBytes = await appendixFile.arrayBuffer();
                        const appendixPdf = await PDFDocument.load(appendixBytes);
                        const appendixPages = await pdfDoc.copyPages(appendixPdf, appendixPdf.getPageIndices());
                        appendixPages.forEach((page) => pdfDoc.addPage(page));
                    }
                }
            }

            setProgressAll(100);

            // Save and download the combined PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = claimData.claim_type === 'YEARLY'
                ? `Combined-Report-${claimData.claim_type}-${claimData.year}.pdf`
                : `Combined-Report-${claimData.claim_type}-${claimData.year}-Q${claimData.quarter}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error creating combined report:', error);
        } finally {
            setIsDownloading(false);
            setProgressAll(0);
        }
    };


    const handleSave = async () => {
        try {
            setLoading(true);
            if (claimData && formData) {
                const deletePromises = [];
                const uploadPromises = [];
                const remarkPromises = [];

                // First, update the main claim application
                await updateClaimReport(claimData.id);

                // Compare originalData and formData to find deleted and added files
                for (const originalCategory of originalData.category_ids) {
                    for (const originalItem of originalCategory.item_ids) {
                        // Find corresponding item in formData
                        const formCategory = formData.category_ids.find(cat => cat.id === originalCategory.id);
                        const formItem = formCategory?.item_ids.find(item => item.id === originalItem.id);

                        if (formItem) {
                            // Check for deleted files
                            const originalFiles = originalItem.item.suppport_doc_file || [];
                            const formFiles = formItem.item.suppport_doc_file || [];

                            // Find files that exist in original but not in form (deleted files)
                            for (const originalFile of originalFiles) {
                                if (originalFile.id) { // Only check files with ID (existing files)
                                    const stillExists = formFiles.some(formFile =>
                                        formFile.id && formFile.id === originalFile.id
                                    );

                                    if (!stillExists) {
                                        deletePromises.push(
                                            deleteAttachment(originalFile.id)
                                        );
                                    }
                                }
                            }

                            // Check for new files (File objects without ID)
                            for (const formFile of formFiles) {
                                if (!formFile.id && formFile instanceof File) {
                                    uploadPromises.push(
                                        uploadAttachment(
                                            formFile,
                                            claimData.tp_dusp_id,
                                            claimData.year,
                                            claimData.ref_no,
                                            formItem.id, // requestId
                                            1 // claimTypeId
                                        )
                                    );
                                }
                            }

                            // Check for remark changes
                            if (originalItem.item.remark !== formItem.item.remark) {
                                remarkPromises.push(
                                    updateRemark(
                                        formItem.id, // requestId
                                        formItem.item.remark || ""
                                    )
                                );
                            }
                        }
                    }
                }

                // Execute all operations concurrently
                await Promise.all([
                    ...deletePromises,
                    ...uploadPromises,
                    ...remarkPromises
                ]);

                toast({ title: "Success", description: "Report attachments updated successfully." });

                // Invalidate queries to refresh data
                queryClient.invalidateQueries({ queryKey: ["claimStats"] });
                queryClient.invalidateQueries({ queryKey: ["fetchClaimTP"] });
                queryClient.invalidateQueries({ queryKey: ["fetchClaimById"] });

                // Reset form state
                onDataChange(false);
            }
        } catch (error) {
            console.error("Error saving report attachments:", error);
            toast({ title: "Error", description: "Failed to update report attachments.", variant: "destructive" });
        } finally {
            setLoading(false);
            handleReset();
        }
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

            {/* <pre>{JSON.stringify(claimData, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(originalData.category_ids, null, 2)}</pre> */}

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

                                <TableCell className="px-4 py-2 border">{item.item.name}</TableCell>

                                <TableCell className="px-4 py-2 border text-center">
                                    {item.item.need_summary_report ? (
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
                                                    onClick={() => generateSummaryReport(item.item.id)}
                                                    className="text-xs px-3 py-1"
                                                >
                                                    View Report
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => downloadSummaryReport(item.item.id)}
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
                                    {item.item.need_support_doc ? (
                                        <div className="flex flex-col items-center gap-2">
                                            {item.item.suppport_doc_file?.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {item.item.suppport_doc_file.map((file, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <a
                                                                href={file.file_path || URL.createObjectURL(file)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 underline"
                                                            >
                                                                View File {idx + 1}
                                                            </a>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-red-600"
                                                                onClick={() => {
                                                                    const updatedCategoryIds = formData.category_ids.map(cat =>
                                                                        cat.id === category.id
                                                                            ? {
                                                                                ...cat,
                                                                                item_ids: cat.item_ids.map(itm =>
                                                                                    itm.id === item.id
                                                                                        ? {
                                                                                            ...itm,
                                                                                            item: {
                                                                                                ...itm.item,
                                                                                                suppport_doc_file: itm.item.suppport_doc_file?.filter((_, i) => i !== idx)
                                                                                            }
                                                                                        }
                                                                                        : itm
                                                                                )
                                                                            }
                                                                            : cat
                                                                    );
                                                                    handleInputChange('category_ids', updatedCategoryIds);
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
                                                            const updatedCategoryIds = formData.category_ids.map(cat =>
                                                                cat.id === category.id
                                                                    ? {
                                                                        ...cat,
                                                                        item_ids: cat.item_ids.map(itm =>
                                                                            itm.id === item.id
                                                                                ? {
                                                                                    ...itm,
                                                                                    item: {
                                                                                        ...itm.item,
                                                                                        suppport_doc_file: [...(itm.item.suppport_doc_file || []), ...newFiles]
                                                                                    }
                                                                                }
                                                                                : itm
                                                                        )
                                                                    }
                                                                    : cat
                                                            );
                                                            handleInputChange('category_ids', updatedCategoryIds);
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
                                        value={item.item.remark || ""}
                                        onChange={(e) => {
                                            const updatedCategoryIds = formData.category_ids.map(cat =>
                                                cat.id === category.id
                                                    ? {
                                                        ...cat,
                                                        item_ids: cat.item_ids.map(itm =>
                                                            itm.id === item.id
                                                                ? {
                                                                    ...itm,
                                                                    item: {
                                                                        ...itm.item,
                                                                        remark: e.target.value
                                                                    }
                                                                }
                                                                : itm
                                                        )
                                                    }
                                                    : cat
                                            );
                                            handleInputChange('category_ids', updatedCategoryIds);
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