import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
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
        status_item: boolean;
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
    dusp_id,
    dusp_logo,
    phase_id,
    category_ids,
    is_finished_generate,
    updateFields,
}: ClaimAttachmentFormProps) {
    const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);

    const generateSummaryReports = async () => {
        let updatedCategories = [...category_ids];
        let totalItems = 0;
        let completedItems = 0;

        updatedCategories.forEach((cat) => {
            cat.item_ids.forEach((item) => {
                if (item.need_summary_report) totalItems++;
            });
        });

        for (let i = 0; i < updatedCategories.length; i++) {
            const category = updatedCategories[i];

            // Find the first item in this category that needs a summary report
            const firstTrueItem = category.item_ids.find((itm) => itm.need_summary_report);
            const firstTrueItemId = firstTrueItem?.id;

            for (let j = 0; j < category.item_ids.length; j++) {
                const item = category.item_ids[j];

                if (!item.need_summary_report) continue;

                setGeneratingIndex(item.id);

                const reportData = {
                    claimType: claim_type,
                    quater: String(quarter),
                    startDate: start_date,
                    endDate: end_date,
                    tpFilter: tp_dusp_id,
                    phaseFilter: phase_id,
                    duspFilter: dusp_id,
                    dusplogo: dusp_logo,
                    nadiFilter: item.site_ids,
                    header: item.id === firstTrueItemId, // ✅ Only this item gets header = true
                };

                let generatedFile: File | null = null;
                if (item.id === 1) {
                    generatedFile = await Salary(reportData);
                } else if (item.id === 2) {
                    generatedFile = await PerformanceIncentive(reportData);
                } else if (item.id === 3) {
                    generatedFile = await ManPower(reportData);
                } else if (item.id === 4) {
                    generatedFile = await LocalAuthority(reportData);
                } else if (item.id === 5) {
                    generatedFile = await Insurance(reportData);
                } else if (item.id === 6) {
                    generatedFile = await Audit(reportData);
                } else if (item.id === 7) {
                    generatedFile = await Agreement(reportData);
                } else if (item.id === 9) {
                    generatedFile = await Utilities(reportData);
                } else if (item.id === 11) {
                    generatedFile = await AwarenessPromotion(reportData);
                } else if (item.id === 13) {
                    generatedFile = await CMS(reportData);
                } else if (item.id === 14) {
                    generatedFile = await PortalWebService(reportData);
                } else if (item.id === 15) {
                    generatedFile = await ManageInternetService(reportData);
                } else if (item.id === 16) {
                    generatedFile = await NMS(reportData);
                } else if (item.id === 17) {
                    generatedFile = await Monitoring(reportData);
                } else if (item.id === 18) {
                    generatedFile = await Upscaling(reportData);
                } else if (item.id === 19) {
                    generatedFile = await Refresh(reportData);
                } else if (item.id === 20) {
                    generatedFile = await Maintenance(reportData);
                } else if (item.id === 24) {
                    generatedFile = await SmartService(reportData);
                }


                if (generatedFile) {
                    updatedCategories[i].item_ids[j].summary_report_file = generatedFile;
                    completedItems++;
                    setProgress(Math.round((completedItems / totalItems) * 100));
                }
            }
        }


        setGeneratingIndex(null);
        if (completedItems === totalItems) {
            updateFields({
                category_ids: updatedCategories,
                is_finished_generate: true,
            });
        } else {
            updateFields({
                category_ids: updatedCategories,
            });
        }
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <header>Category & Items Attachments</header>
                <Button onClick={generateSummaryReports}>
                    Generate Summary Reports
                </Button>
            </div>


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
                                            <a
                                                href={URL.createObjectURL(item.summary_report_file)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline text-sm"
                                            >
                                                View File
                                            </a>
                                        ) : (
                                            <span className="text-yellow-600">Ready to generate</span>
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