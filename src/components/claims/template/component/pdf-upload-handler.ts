import { PDFDocument, rgb } from 'pdf-lib';

export interface UploadAttachmentHandlerOptions {
    uploadAttachment?: File[] | File | null;
    sectionTitle?: string; // e.g., "4.1 MANAGED INTERNET ACCESS"
    titlePosition?: {
        x?: number; // Distance from right edge (default: 170)
        y?: number; // Distance from top (default: 40)
    };
    titleStyle?: {
        size?: number; // Font size (default: 8)
        color?: [number, number, number]; // RGB values 0-1 (default: [0.5, 0.5, 0.5])
    };
}

export interface UploadAttachmentProcessResult {
    hasAttachment: boolean;
    processedBlob: Blob;
}

/**
 * Processes user-uploaded attachments and merges them with the main PDF report
 * @param mainReportBlob - The main PDF report as a Blob
 * @param options - Configuration options for attachment processing
 * @returns Promise with processing result
 */
export const processUploadAttachments = async (
    mainReportBlob: Blob,
    options: UploadAttachmentHandlerOptions
): Promise<UploadAttachmentProcessResult> => {
    const {
        uploadAttachment,
        sectionTitle = "",
        titlePosition = { x: 170, y: 40 },
        titleStyle = { size: 8, color: [0.5, 0.5, 0.5] }
    } = options;

    // Check if there are attachments
    let hasAttachment = false;
    
    if (uploadAttachment) {
        console.log("Upload attachment object:", uploadAttachment);
        
        // Check if it's an array with files or a single file
        if (Array.isArray(uploadAttachment) && uploadAttachment.length > 0) {
            hasAttachment = true;
            console.log("Upload attachment is array with", uploadAttachment.length, "files");
        } else if (uploadAttachment && !Array.isArray(uploadAttachment) && uploadAttachment.type) {
            hasAttachment = true;
            console.log("Upload attachment is single file:", uploadAttachment.name);
        }
    }

    // If no attachments, return original blob
    if (!hasAttachment || !uploadAttachment) {
        return {
            hasAttachment: false,
            processedBlob: mainReportBlob
        };
    }

    // Process attachments with PDF-lib
    try {
        console.log("Processing attachment with PDF-lib...");
        
        // Load the main report PDF
        const mainPdfBytes = await mainReportBlob.arrayBuffer();
        const mainPdf = await PDFDocument.load(mainPdfBytes);
        
        // Handle attachment based on its type
        let attachmentFiles: File[] = [];
        
        // Check if uploadAttachment is an array or single file
        if (Array.isArray(uploadAttachment) && uploadAttachment.length > 0) {
            attachmentFiles = uploadAttachment; // Process all files in array
        } else if (uploadAttachment && !Array.isArray(uploadAttachment) && uploadAttachment.type) {
            attachmentFiles = [uploadAttachment]; // Convert single file to array
        }
        
        console.log(`Processing ${attachmentFiles.length} attachment file(s)`);
        
        // Process each attachment file
        for (const attachmentFile of attachmentFiles) {
            console.log("Processing attachment file:", attachmentFile.name, attachmentFile.type);
            
            if (attachmentFile.type === 'application/pdf') {
                // If it's a PDF, merge all its pages
                const attachmentBytes = await attachmentFile.arrayBuffer();
                const attachmentPdf = await PDFDocument.load(attachmentBytes);
                const pages = await mainPdf.copyPages(attachmentPdf, attachmentPdf.getPageIndices());
                
                // Add title to each PDF page and then add to main document
                pages.forEach(page => {
                    const { width, height } = page.getSize();
                    
                    // Add section title at top right of each PDF page if provided
                    if (sectionTitle) {
                        page.drawText(sectionTitle, {
                            x: width - (titlePosition.x || 170), // Position from right edge
                            y: height - (titlePosition.y || 40), // Position from top
                            size: titleStyle.size || 8,
                            color: rgb(
                                titleStyle.color?.[0] || 0.5,
                                titleStyle.color?.[1] || 0.5,
                                titleStyle.color?.[2] || 0.5
                            ),
                        });
                    }
                    
                    mainPdf.addPage(page);
                });
                
            } else if (attachmentFile.type.startsWith('image/')) {
                // If it's an image, embed it as a new page
                const imageBytes = await attachmentFile.arrayBuffer();
                let image;
                
                if (attachmentFile.type === 'image/png') {
                    image = await mainPdf.embedPng(imageBytes);
                } else if (attachmentFile.type === 'image/jpeg' || attachmentFile.type === 'image/jpg') {
                    image = await mainPdf.embedJpg(imageBytes);
                } else {
                    console.warn("Unsupported image type for PDF-lib:", attachmentFile.type);
                    continue; // Skip this file and continue with next
                }
                
                if (image) {
                    const page = mainPdf.addPage();
                    const { width, height } = page.getSize();
                    
                    // Add section title at top right if provided
                    if (sectionTitle) {
                        page.drawText(sectionTitle, {
                            x: width - (titlePosition.x || 170), // Position from right edge
                            y: height - (titlePosition.y || 40), // Position from top
                            size: titleStyle.size || 8,
                            color: rgb(
                                titleStyle.color?.[0] || 0.5,
                                titleStyle.color?.[1] || 0.5,
                                titleStyle.color?.[2] || 0.5
                            ),
                        });
                    }
                    
                    // Scale image to fit page while maintaining aspect ratio (adjust for title space)
                    const titleSpace = sectionTitle ? 60 : 0; // Reserve space for title if present
                    const imageAspectRatio = image.width / image.height;
                    const pageAspectRatio = width / (height - titleSpace);
                    
                    let imageWidth, imageHeight;
                    if (imageAspectRatio > pageAspectRatio) {
                        imageWidth = width - 80; // 40px margin on each side
                        imageHeight = imageWidth / imageAspectRatio;
                    } else {
                        imageHeight = height - (80 + titleSpace); // 40px margin + title space
                        imageWidth = imageHeight * imageAspectRatio;
                    }
                    
                    const x = (width - imageWidth) / 2;
                    const y = (height - imageHeight - titleSpace) / 2; // Adjust for title space
                    
                    page.drawImage(image, {
                        x,
                        y,
                        width: imageWidth,
                        height: imageHeight,
                    });
                }
            } else {
                console.warn("Unsupported file type:", attachmentFile.type, "for file:", attachmentFile.name);
            }
        }
        
        // Generate the final PDF after processing all attachments
        const finalPdfBytes = await mainPdf.save();
        const finalBlob = new Blob([finalPdfBytes], { type: 'application/pdf' });
        
        console.log("Successfully merged", attachmentFiles.length, "attachment(s) with main report");
        
        return {
            hasAttachment: true,
            processedBlob: finalBlob
        };
        
    } catch (error) {
        console.error("Error processing attachment with PDF-lib:", error);
        // Fall back to just the main report if attachment processing fails
        return {
            hasAttachment: true,
            processedBlob: mainReportBlob
        };
    }
};

/**
 * Helper function to check if user upload attachments are provided
 * @param uploadAttachment - The attachment(s) to check
 * @returns boolean indicating if attachments are present
 */
export const hasUploadAttachments = (uploadAttachment?: File[] | File | null): boolean => {
    if (!uploadAttachment) return false;
    
    if (Array.isArray(uploadAttachment)) {
        return uploadAttachment.length > 0;
    }
    
    return uploadAttachment.type !== undefined;
};
