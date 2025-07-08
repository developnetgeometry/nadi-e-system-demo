import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Trash2 } from "lucide-react";
import { Progress } from "@radix-ui/react-progress";
import { Textarea } from "@/components/ui/textarea";
import Audit from "../template/SiteManagement/Audit";
import Salary from "../template/Salary&HRManagement/Salary";
import PerformanceIncentive from "../template/Salary&HRManagement/PerformanceIncentive";
import ManPower from "../template/Salary&HRManagement/ManpowerManagement";
import LocalAuthority from "../template/SiteManagement/LocalAuthority";
import Insurance from "../template/SiteManagement/SiteInsurance";
import Agreement from "../template/SiteManagement/SiteAgreement";
import Utilities from "../template/SiteManagement/Utilities";
import AwarenessPromotion from "../template/SiteManagement/Awareness&Promotion";
import CMS from "../template/NADIeSystem/CMS";
import PortalWebService from "../template/NADIeSystem/Portal&WebService";
import ManageInternetService from "../template/InternetAccess/ManageInternetService";
import NMS from "../template/InternetAccess/NMS";
import Monitoring from "../template/InternetAccess/Monitoring&Reporting";
import Upscaling from "../template/Training/Upscaling";
import Refresh from "../template/Training/Refresh";
import Maintenance from "../template/ComprehensiveMaintenance/Maintenance";
import SmartService from "../template/SmartServices/SmartService";
import FrontPage from "../template/component/FrontPage";
import AppendixBlob from "../template/component/AppendixBlob";

type CategoryData = {
    id: number;
    name: string;
    item_ids: {
        id: number;
        name: string;
        need_support_doc: boolean;
        need_summary_report: boolean;
        suppport_doc_file: File[] | null;
        summary_report_file: File | null;
        remark: string;
        site_ids: number[];
    }[];
};

type ClaimData = {
    claim_type: string;
    year: number;
    quarter: number;
    month: number;
    start_date: string;
    end_date: string;
    ref_no: string;
    tp_dusp_id: string;
    dusp_name: string;
    dusp_description: string; // Optional field for description
    dusp_id: string;
    dusp_logo: string;
    phase_id: number;
    category_ids: CategoryData[];
    is_finished_generate: boolean;
};

type ClaimAttachmentFormProps = ClaimData & {
    updateFields: (fields: Partial<ClaimData>) => void;
};

export function ClaimAttachmentForm({
    claim_type,
    year,
    quarter,
    month,
    start_date,
    end_date,
    ref_no,
    tp_dusp_id,
    dusp_name,
    dusp_description, // Optional field for description
    dusp_id,
    dusp_logo,
    phase_id,
    category_ids,
    is_finished_generate,
    updateFields,
}: ClaimAttachmentFormProps) {
    const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [progressAll, setProgressAll] = useState(0);


    const generateSummaryReport = async (itemId: number) => {
        let updatedCategories = [...category_ids];

        // Find the category and item
        let categoryIndex = -1;
        let itemIndex = -1;
        let targetItem = null;

        for (let i = 0; i < updatedCategories.length; i++) {
            const category = updatedCategories[i];
            for (let j = 0; j < category.item_ids.length; j++) {
                if (category.item_ids[j].id === itemId) {
                    categoryIndex = i;
                    itemIndex = j;
                    targetItem = category.item_ids[j];
                    break;
                }
            }
            if (targetItem) break;
        }

        if (!targetItem || !targetItem.need_summary_report) return;

        setGeneratingIndex(itemId);
        setProgress(0);

        // Find the first item in this category that needs a summary report for header logic
        const category = updatedCategories[categoryIndex];
        const firstTrueItem = category.item_ids.find((itm) => itm.need_summary_report);
        const firstTrueItemId = firstTrueItem?.id;

        const reportData = {
            claimType: claim_type,
            quater: String(quarter),
            startDate: start_date,
            endDate: end_date,
            tpFilter: tp_dusp_id,
            phaseFilter: phase_id,
            duspFilter: dusp_id,
            dusplogo: dusp_logo,
            nadiFilter: targetItem.site_ids,
            header: itemId === firstTrueItemId,
        };

        let generatedFile: File | null = null;

        // Simulate progress
        let newProgress = 0;
        // const newProgress = Math.min(progress + Math.floor(Math.random() * 10) + 1, 99);

        while (newProgress <= 80) {
            const increment = Math.floor(Math.random() * 10) + 49;
            newProgress = Math.min(newProgress + increment, 100);

            setProgress(newProgress);
            if (newProgress > 80) break;

            await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
        }

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

            setProgress(100);

            // if (generatedFile) {
            //     updatedCategories[categoryIndex].item_ids[itemIndex].summary_report_file = generatedFile;
            //     updateFields({ category_ids: updatedCategories });
            // }

            if (generatedFile) {
                // Open the generated file in a new tab instead of saving it
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
        let updatedCategories = [...category_ids];

        // Find the category and item
        let categoryIndex = -1;
        let itemIndex = -1;
        let targetItem = null;

        for (let i = 0; i < updatedCategories.length; i++) {
            const category = updatedCategories[i];
            for (let j = 0; j < category.item_ids.length; j++) {
                if (category.item_ids[j].id === itemId) {
                    categoryIndex = i;
                    itemIndex = j;
                    targetItem = category.item_ids[j];
                    break;
                }
            }
            if (targetItem) break;
        }

        if (!targetItem || !targetItem.need_summary_report) return;

        setGeneratingIndex(itemId);
        setProgress(0);

        // Find the first item in this category that needs a summary report for header logic
        const category = updatedCategories[categoryIndex];
        const firstTrueItem = category.item_ids.find((itm) => itm.need_summary_report);
        const firstTrueItemId = firstTrueItem?.id;

        const reportData = {
            claimType: claim_type,
            quater: String(quarter),
            startDate: start_date,
            endDate: end_date,
            tpFilter: tp_dusp_id,
            phaseFilter: phase_id,
            duspFilter: dusp_id,
            dusplogo: dusp_logo,
            nadiFilter: targetItem.site_ids,
            header: itemId === firstTrueItemId,
        };

        let generatedFile: File | null = null;

        // Simulate progress
        let newProgress = 0;

        while (newProgress <= 80) {
            const increment = Math.floor(Math.random() * 10) + 49;
            newProgress = Math.min(newProgress + increment, 100);

            setProgress(newProgress);
            if (newProgress > 80) break;

            await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
        }

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

            setProgress(100);

            if (generatedFile) {
                // Download the generated file without saving to state
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
            console.error('Error generating report:', error);
        } finally {
            setGeneratingIndex(null);
            setProgress(0);
        }
    };

    const generateReportForItem = async (itemId: number) => {
        let targetItem = null;
        let categoryIndex = -1;
        let itemIndex = -1;

        // Find the category and item
        for (let i = 0; i < category_ids.length; i++) {
            const category = category_ids[i];
            for (let j = 0; j < category.item_ids.length; j++) {
                if (category.item_ids[j].id === itemId) {
                    categoryIndex = i;
                    itemIndex = j;
                    targetItem = category.item_ids[j];
                    break;
                }
            }
            if (targetItem) break;
        }

        if (!targetItem || !targetItem.need_summary_report) return null;

        // Find the first item in this category that needs a summary report for header logic
        const category = category_ids[categoryIndex];
        const firstTrueItem = category.item_ids.find((itm) => itm.need_summary_report);
        const firstTrueItemId = firstTrueItem?.id;

        const reportData = {
            claimType: claim_type,
            quater: String(quarter),
            startDate: start_date,
            endDate: end_date,
            tpFilter: tp_dusp_id,
            phaseFilter: phase_id,
            duspFilter: dusp_id,
            dusplogo: dusp_logo,
            nadiFilter: targetItem.site_ids,
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

    const handleDownloadAllReports = async () => {
        setIsDownloading(true);
        const generatedUrls: string[] = [];

        try {
            const pdfDoc = await PDFDocument.create();

            // Add the FrontPage as the first page
            const frontPageFile = await FrontPage({
                duspName: dusp_description,
                claimType: claim_type,
                year: year,
                quarter: quarter,
                month: month,
                dusplogo: dusp_logo,
            });
            const frontPageBytes = await frontPageFile.arrayBuffer();
            const frontPagePdf = await PDFDocument.load(frontPageBytes);
            const frontPagePages = await pdfDoc.copyPages(frontPagePdf, frontPagePdf.getPageIndices());
            frontPagePages.forEach((page) => pdfDoc.addPage(page));

            // Simulate progress
            let newProgress = 0;
            const totalCategories = category_ids.length;
            const num1 = Math.floor(totalCategories * 0.8);
            const num2 = totalCategories - num1;

            const increment1 = num1 === 0 ? 0 : 80 / num1;
            const increment2 = num2 === 0 ? 0 : 20 / num2;

            // Generate and add summary reports
            for (const category of category_ids) {
                for (const item of category.item_ids) {
                    if (item.need_summary_report) {
                        setProgressAll(Math.min(newProgress, 80));
                        newProgress += increment1;

                        const reportFile = await generateReportForItem(item.id);

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
            for (const category of category_ids) {
                for (const item of category.item_ids) {
                    if (item.suppport_doc_file?.length > 0) {
                        setProgressAll(Math.min(newProgress, 100));
                        newProgress += increment2;

                        // Convert File objects to proper attachment format
                        const attachments = item.suppport_doc_file.map((file) => ({
                            file: file, // Pass the File object directly
                            name: file.name,
                            description: `Supporting Document for ${item.name}`,
                        }));

                        const appendixFile = await AppendixBlob({
                            appendixNumber: "APPENDIX",
                            title: item.name,
                            attachments: attachments,
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
            link.download = `ClaimData_Combined_Report.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error creating combined report:', error);
        } finally {
            // Clean up blob URLs created for file attachments
            generatedUrls.forEach(url => URL.revokeObjectURL(url));
            setIsDownloading(false);
            setProgressAll(0);
        }
    };




    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <header>Category & Items Attachments</header>
                <Button
                    onClick={handleDownloadAllReports}
                    disabled={isDownloading || category_ids.length === 0}
                    className="flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    {isDownloading ? 'Generating Combined Report...' : 'Download All Combined Report'}
                </Button>
            </div>
            {/* <pre>{JSON.stringify(category_ids, null, 2)}</pre> */}

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
                    {category_ids.map((category) =>
                        category.item_ids.map((item, itemIndex) => (
                            <TableRow key={`category-${category.id}-item-${item.id}`}>
                                {/* Show category name only for the first item in each category */}
                                {itemIndex === 0 ? (
                                    <TableCell rowSpan={category.item_ids.length} className="px-4 py-2 border font-semibold align-top">
                                        {category.name}
                                    </TableCell>
                                ) : null}

                                <TableCell className="px-4 py-2 border">{item.name}</TableCell>
                                {/* 
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
                                        ) : item.summary_report_file ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <a
                                                    href={URL.createObjectURL(item.summary_report_file)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline text-sm"
                                                >
                                                    View File
                                                </a>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => generateSummaryReport(item.id)}
                                                    className="text-xs px-2 py-1"
                                                >
                                                    <RefreshCw className="h-3 w-3 mr-1" />
                                                    Regenerate
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => generateSummaryReport(item.id)}
                                                className="text-xs px-3 py-1"
                                            >
                                                Generate Report
                                            </Button>
                                        )
                                    ) : (
                                        <span className="text-gray-500">Not Required</span>
                                    )}
                                </TableCell> */}
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
                                                                    updateFields({ category_ids: [...category_ids] }); // trigger re-render
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
                                                            updateFields({ category_ids: [...category_ids] }); // trigger re-render
                                                            e.target.value = ""; // reset input
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
                                        value={item.remark}
                                        onChange={(e) => {
                                            item.remark = e.target.value;
                                            updateFields({
                                                category_ids: [...category_ids],
                                            });
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
}