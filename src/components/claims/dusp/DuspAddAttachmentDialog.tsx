import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { deleteAttachment } from "./delete-attachment";
import { uploadAttachment } from "./hooks/upload-attachment";
import { useFetchClaimDUSPById } from "./hooks/fetch-claim-dusp-by-id";
import { Trash2 } from "lucide-react";

interface DuspAddAttachmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    claimId: number;
}

const DuspAddAttachmentDialog: React.FC<DuspAddAttachmentDialogProps> = ({ isOpen, onClose, claimId }) => {
    const { data: claim, isLoading } = useFetchClaimDUSPById(claimId, isOpen);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState<{ id: number; file_path: string } | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [files, setFiles] = useState<File[]>([]);

    const handleDelete = async () => {
        if (!selectedAttachment) return;

        setIsDeleting(true);
        try {
            await deleteAttachment(selectedAttachment);
            toast({
                title: "Success",
                description: "Attachment deleted successfully.",
                variant: "default",
            });

            queryClient.invalidateQueries({ queryKey: ["fetchClaimDUSPById", claimId] });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete attachment.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setSelectedAttachment(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedRequest || files.length === 0) return;

        try {
            await uploadAttachment(
                files,
                selectedRequest.id,
                selectedRequest.claimTypeId,
                claim.tp_dusp_id.name,
                claim.tp_dusp_id.parent_id.name,
                claim.year,
                claim.quarter,
                claim.month
            );

            toast({
                title: "Success",
                description: "Files uploaded successfully.",
                variant: "default",
            });
            queryClient.invalidateQueries({ queryKey: ["fetchClaimDUSP", claimId] });
            queryClient.invalidateQueries({ queryKey: ["fetchClaimDUSPById", claimId] });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload files.",
                variant: "destructive",
            });
        } finally {
            setIsUploadDialogOpen(false);
            setFiles([]);
        }
    };

    if (!claim) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Manage Attachments</DialogTitle>
                    <DialogDescription className="text-muted-foreground mb-4">
                        Manage attachments for the claim application. You can upload or delete files as needed.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    {claim?.requests?.length ? (
                        claim.requests.map((request: any, index: number) => {
                            const groupedAttachments = {
                                "Summary Report": [],
                                "Supporting Document": [],
                                "Signed Invoice & Self-Declaration": [],
                            };

                            request.attachments.forEach((attachment: any) => {
                                if (attachment?.claim_type_id?.id === 2) {
                                    groupedAttachments["Summary Report"].push(attachment);
                                } else if (attachment?.claim_type_id?.id === 1) {
                                    groupedAttachments["Supporting Document"].push(attachment);
                                } else if (attachment?.claim_type_id?.id === 3) {
                                    groupedAttachments["Signed Invoice & Self-Declaration"].push(attachment);
                                }
                            });

                            return (
                                <div key={request?.id ?? index} className="mb-4">
                                    <h4 className="font-medium mb-2">
                                        Request {index + 1}: {request?.category_id?.name ?? "Unnamed Category"}
                                    </h4>
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Attachment Type</TableHead>
                                                <TableHead>File Paths</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(groupedAttachments).map(([type, attachments]) => (
                                                <TableRow key={type}>
                                                    <TableCell>{type}</TableCell>
                                                    <TableCell>
                                                        {attachments.length > 0 ? (
                                                            attachments.map((attachment: any, idx: number) => (
                                                                <div key={idx} className="flex items-center justify-between gap-2">
                                                                    <a
                                                                        href={attachment.file_path}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-500 underline"
                                                                    >
                                                                        View File {idx + 1}
                                                                    </a>
                                                                    {type !== "Summary Report" && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6 text-red-600"
                                                                            onClick={() => {
                                                                                setSelectedAttachment({
                                                                                    id: attachment.id,
                                                                                    file_path: attachment.file_path,
                                                                                });
                                                                                setIsDeleteDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            "No File Available"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>

                                                        {type !== "Summary Report" && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedRequest({
                                                                        id: request.id,
                                                                        claimTypeId:
                                                                            type === "Supporting Document" ? 1 : 3,
                                                                    });
                                                                    setIsUploadDialogOpen(true);
                                                                }}
                                                            >
                                                                Upload
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-muted-foreground">No requests available</p>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>

            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Attachment</DialogTitle>
                            <DialogDescription className="text-muted-foreground mb-4">
                            </DialogDescription>
                        </DialogHeader>
                        <p>Are you sure you want to delete this attachment? This action cannot be undone.</p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Upload Dialog */}
            {isUploadDialogOpen && (
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Files</DialogTitle>
                            <DialogDescription className="text-muted-foreground mb-4">
                                Select files to upload for the selected request. You can upload multiple files at once.
                            </DialogDescription>
                        </DialogHeader>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => setFiles(Array.from(e.target.files || []))}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleUpload}
                                disabled={files.length === 0}
                            >
                                Upload
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
};

export default DuspAddAttachmentDialog;