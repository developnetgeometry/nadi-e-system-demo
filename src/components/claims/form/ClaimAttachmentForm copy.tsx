import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ categoryId: number; itemId: number } | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isGenerating, setIsGenerating] = useState<Record<number, boolean>>({});
    const [generatedFiles, setGeneratedFiles] = useState<Record<number, File | null>>({});

    const handleFileChange = (files: FileList | null) => {
        if (!files || !selectedItem) return;

        const updatedCategories = category_ids.map((category) => {
            if (category.id === selectedItem.categoryId) {
                return {
                    ...category,
                    item_ids: category.item_ids.map((item) => {
                        if (item.id === selectedItem.itemId) {
                            const updatedFiles = [
                                ...(item.suppport_doc_file || []), // Keep existing files
                                ...Array.from(files), // Add new files
                            ];
                            return {
                                ...item,
                                suppport_doc_file: updatedFiles,
                                status_item: updatedFiles.length > 0, // Set status_item to true if files exist
                            };
                        }
                        return item;
                    }),
                };
            }
            return category;
        });

        updateFields({ category_ids: updatedCategories });
        setIsDialogOpen(false);
        setFiles([]);
    };

    const handleDeleteSpecificFile = (categoryId: number, itemId: number, fileIndex: number) => {
        const updatedCategories = category_ids.map((category) => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    item_ids: category.item_ids.map((item) => {
                        if (item.id === itemId) {
                            const updatedFiles = item.suppport_doc_file?.filter((_, idx) => idx !== fileIndex) || [];
                            return {
                                ...item,
                                suppport_doc_file: updatedFiles,
                                status_item: updatedFiles.length > 0, // Update status_item based on the updated files
                            };
                        }
                        return item;
                    }),
                };
            }
            return category;
        });

        updateFields({ category_ids: updatedCategories });
    };

    // Group categories by ID
    const groupedCategories = category_ids.reduce<Record<number, CategoryData>>((acc, category) => {
        if (!acc[category.id]) {
            acc[category.id] = { ...category, item_ids: [...category.item_ids] };
        } else {
            acc[category.id].item_ids.push(...category.item_ids);
        }
        return acc;
    }, {});

    useEffect(() => {
        // Check if all summary_report_file fields are generated
        const allGenerated = category_ids.every((category) =>
            category.item_ids.every(
                (item) =>
                    !item.need_summary_report || (item.summary_report_file !== null && generatedFiles[item.id])
            )
        );

        // Update is_finished_generate based on the allGenerated flag
        if (allGenerated !== is_finished_generate) {
            updateFields({ is_finished_generate: allGenerated });
        }
    }, [generatedFiles, category_ids, is_finished_generate, updateFields]);

    useEffect(() => {
        // Initialize generatedFiles state from summary_report_file
        const initialGeneratedFiles: Record<number, File | null> = {};
        category_ids.forEach((category) => {
            category.item_ids.forEach((item) => {
                if (item.summary_report_file) {
                    initialGeneratedFiles[item.id] = item.summary_report_file;
                }
            });
        });
        setGeneratedFiles(initialGeneratedFiles);
    }, [category_ids]);


    const startGeneratingReport = (itemId: number) => {
        setIsGenerating((prev) => ({ ...prev, [itemId]: true }));
    };

    const handleGenerateReport = async (itemId: number, itemName: string, siteIds: number[]) => {
        try {
            startGeneratingReport(itemId);

            // Determine if this is the first item in its category
            const isFirstItemInCategory = category_ids.some((category) =>
                category.item_ids.some((item) => item.id === itemId && item.id === Math.min(...category.item_ids.map((i) => i.id)))
            );

            const reportData = {
                claimType: claim_type,
                quater: String(quarter),
                startDate: start_date,
                endDate: end_date,
                tpFilter: tp_dusp_id,
                phaseFilter: phase_id,
                duspFilter: dusp_id,
                dusplogo: dusp_logo,
                nadiFilter: siteIds,
                header: isFirstItemInCategory, // Send header as true only for the first item in its category
            };

            let generatedFile: File | null = null;
            let isHandled = false; // Flag to track if the itemId is handled

            // Use templates based on itemId
            if (itemId === 1) {
                generatedFile = await Salary(reportData);
                isHandled = true;
            } else if (itemId === 2) {
                generatedFile = await PerformanceIncentive(reportData);
                isHandled = true;
            } else if (itemId === 3) {
                generatedFile = await ManPower(reportData);
                isHandled = true;
            } else if (itemId === 4) {
                generatedFile = await LocalAuthority(reportData);
                isHandled = true;
            } else if (itemId === 5) {
                generatedFile = await Insurance(reportData);
                isHandled = true;
            } else if (itemId === 6) {
                generatedFile = await Audit(reportData);
                isHandled = true;
            } else if (itemId === 7) {
                generatedFile = await Agreement(reportData);
                isHandled = true;
            } else if (itemId === 9) {
                generatedFile = await Utilities(reportData);
                isHandled = true;
            } else if (itemId === 11) {
                generatedFile = await AwarenessPromotion(reportData);
                isHandled = true;
            } else if (itemId === 13) {
                generatedFile = await CMS(reportData);
                isHandled = true;
            } else if (itemId === 14) {
                generatedFile = await PortalWebService(reportData);
                isHandled = true;
            } else if (itemId === 15) {
                generatedFile = await ManageInternetService(reportData);
                isHandled = true;
            } else if (itemId === 16) {
                generatedFile = await NMS(reportData);
                isHandled = true;
            } else if (itemId === 17) {
                generatedFile = await Monitoring(reportData);
                isHandled = true;
            } else if (itemId === 18) {
                generatedFile = await Upscaling(reportData);
                isHandled = true;
            } else if (itemId === 19) {
                generatedFile = await Refresh(reportData);
                isHandled = true;
            } else if (itemId === 20) {
                generatedFile = await Maintenance(reportData);
                isHandled = true;
            } else if (itemId === 24) {
                generatedFile = await SmartService(reportData);
                isHandled = true;
            }

            // Handle unmatched cases
            if (!isHandled) {
                console.error(`No matching template found for itemId: ${itemId}, itemName: ${itemName}`);
                return; // Exit early if no template matches
            }

            if (generatedFile) {
                // Update the summary_report_file in category_ids
                const updatedCategories = category_ids.map((category) => ({
                    ...category,
                    item_ids: category.item_ids.map((item) => {
                        if (item.id === itemId) {
                            return {
                                ...item,
                                summary_report_file: generatedFile, // Store the generated file
                            };
                        }
                        return item;
                    }),
                }));

                // Update the fields with the modified category_ids
                updateFields({ category_ids: updatedCategories });

                // Check if all required reports are generated
                const allGenerated = updatedCategories.every((category) =>
                    category.item_ids.every(
                        (item) =>
                            !item.need_summary_report || item.summary_report_file !== null
                    )
                );

                // Update is_finished_generate based on the allGenerated flag
                updateFields({ is_finished_generate: allGenerated });
            }
        } catch (error) {
            console.error("Error generating report:", error);
        } finally {
            setIsGenerating((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    return (
        <div>
            <header className="mb-4">Category & Items Attachments</header>
            {/* <pre>
  {JSON.stringify(
    category_ids.map((cat) => ({
      ...cat,
      item_ids: cat.item_ids.map((item) => ({
        ...item,
        suppport_doc_file: item.suppport_doc_file?.map((file) => file.name) || null,
        summary_report_file: item.summary_report_file?.name || null,
      })),
    })),
    null,
    2
  )}
</pre> */}


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
                    {Object.values(groupedCategories).map((category) => (
                        <React.Fragment key={category.id}>
                            {category.item_ids.map((item, index) => (
                                <TableRow key={item.id}>
                                    {index === 0 && (
                                        <TableCell
                                            className="px-4 py-2 align-top border"
                                            rowSpan={category.item_ids.length}
                                        >
                                            {category.name}
                                        </TableCell>
                                    )}
                                    <TableCell className="px-4 py-2 border">{item.name}</TableCell>
                                    <TableCell className="px-4 py-2 text-center border">
                                        {item.need_summary_report ? (
                                            isGenerating[item.id] ? (
                                                <div className="flex items-center gap-4">
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                    <div className="space-y-2 flex-1">
                                                        <div className="text-sm">Generating report...</div>
                                                        <Progress value={45} className="h-1" />
                                                    </div>
                                                </div>
                                            ) : generatedFiles[item.id] ? (
                                                <a
                                                    href={URL.createObjectURL(generatedFiles[item.id])}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline"
                                                >
                                                    {generatedFiles[item.id].name}
                                                </a>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleGenerateReport(item.id, item.name, item.site_ids)}
                                                >
                                                    Generate Report
                                                </Button>
                                            )
                                        ) : (
                                            <span className="text-gray-500">Not Required</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-center border">
                                        {item.need_support_doc ? (
                                            <div className="flex flex-col items-center gap-2">
                                                {item.suppport_doc_file?.length ? (
                                                    <div className="flex flex-col gap-2">
                                                        {item.suppport_doc_file.map((file, idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <a
                                                                    href={URL.createObjectURL(file)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 underline"
                                                                >
                                                                    {file.name}
                                                                </a>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6 text-red-600"
                                                                    onClick={() =>
                                                                        handleDeleteSpecificFile(category.id, item.id, idx)
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : null}
                                                <Button
                                                    className="h-6"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedItem({
                                                            categoryId: category.id,
                                                            itemId: item.id,
                                                        });
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    Upload
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">Not Required</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-center border">
                                        <Textarea
                                            value={item.remark ?? ""}
                                            onChange={(e) => {
                                                const updatedCategories = category_ids.map((category) => {
                                                    if (category.id === category.id) {
                                                        return {
                                                            ...category,
                                                            item_ids: category.item_ids.map((i) =>
                                                                i.id === item.id
                                                                    ? { ...i, remark: e.target.value }
                                                                    : i
                                                            ),
                                                        };
                                                    }
                                                    return category;
                                                });
                                                updateFields({ category_ids: updatedCategories });
                                            }}
                                            className="border border-gray-300 rounded px-2 py-1 w-full"
                                            placeholder="Add remark"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>

            {/* Upload Dialog */}
            {isDialogOpen && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Supporting Documents</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setFiles(Array.from(e.target.files || []))}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => handleFileChange(files as unknown as FileList)}
                                disabled={files.length === 0}
                            >
                                Upload
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* ClaimReportGenerator */}
            /
        </div>
    );
}