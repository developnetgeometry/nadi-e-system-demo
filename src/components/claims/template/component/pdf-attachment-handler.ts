import { PDFDocument, rgb, PageSizes } from 'pdf-lib';
import {
    isPDF,
    isImage,
    fetchPDFAsArrayBuffer,
    fetchImageAsArrayBuffer,
    embedImageByType,
    addPageFooter,
    addPageLabel
} from './pdf-utils';

/**
 * Type definition for attachment sources with necessary information
 */
export interface AttachmentSource {
    attachments_path: string[];
    standard_code?: string;
    identifier?: string; // Fallback if standard_code is not available
}

/**
 * Process and add PDF attachments to a PDF document
 */
export const processAttachments = async (
    pdfDoc: PDFDocument, 
    sources: AttachmentSource[]
): Promise<PDFDocument> => {
    try {
        // For each source that has attachments
        for (const source of sources) {
            const attachments = source.attachments_path || [];
            const identifier = source.standard_code || source.identifier || '';
            
            // Skip if no attachments
            if (attachments.length === 0) {
                continue;
            }
              // Process each attachment in the order they appear
            for (const attachmentUrl of attachments) {
                // Skip undefined or null attachment URLs
                if (!attachmentUrl) continue;
                
                if (isImage(attachmentUrl)) {
                    await processImageAttachment(pdfDoc, attachmentUrl, identifier);
                } else if (isPDF(attachmentUrl)) {
                    await processPdfAttachment(pdfDoc, attachmentUrl, identifier);
                }
            }
        }
        
        return pdfDoc;
    } catch (error) {
        console.error("Error processing attachments:", error);
        return pdfDoc; // Return the original PDF even if there's an error
    }
};

/**
 * Process an image attachment and add it to the PDF
 */
const processImageAttachment = async (
    pdfDoc: PDFDocument, 
    attachmentUrl: string, 
    identifier: string
): Promise<void> => {
    try {
        // Fetch the image data
        const imageBytes = await fetchImageAsArrayBuffer(attachmentUrl);
        
        // Create a new page for the image (A4 size)
        const imagePage = pdfDoc.addPage(PageSizes.A4);
        const { width, height } = imagePage.getSize();
        
        // Add identifier label at the top right corner
        addPageLabel(imagePage, identifier, width, height);
        
        try {
            // Embed the image
            const image = await embedImageByType(pdfDoc, imageBytes, attachmentUrl);
            
            // Calculate dimensions to fit the image on the page with margins
            const pageWidth = width - 100; // 50px margins on each side
            const pageHeight = height - 150; // More margin at top for label
            
            const imgWidth = image.width;
            const imgHeight = image.height;
            
            // Calculate scaling to fit the page while maintaining aspect ratio
            const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
            
            // Calculate dimensions and position
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;
            
            // Center the image on the page
            const x = (width - scaledWidth) / 2;
            const y = height - 100 - scaledHeight; // Position below the label
            
            // Draw the image on the page
            imagePage.drawImage(image, {
                x,
                y,
                width: scaledWidth,
                height: scaledHeight,
            });
            
            // Add standard footer
            addPageFooter(imagePage, width);
        } catch (embedError) {
            console.error(`Error embedding image: ${attachmentUrl}`, embedError);
            // Fallback to showing just the URL if embedding fails
            imagePage.drawText(`Image URL (failed to embed): ${attachmentUrl}`, {
                x: 50,
                y: height - 80,
                size: 10,
                color: rgb(0, 0, 0),
            });
        }
    } catch (error) {
        console.error(`Error adding image attachment ${attachmentUrl}:`, error);
    }
};

/**
 * Process a PDF attachment and add it to the master PDF
 */
const processPdfAttachment = async (
    pdfDoc: PDFDocument, 
    attachmentUrl: string, 
    identifier: string
): Promise<void> => {
    try {
        const attachmentBuffer = await fetchPDFAsArrayBuffer(attachmentUrl);
        const attachmentPdf = await PDFDocument.load(attachmentBuffer);
        const attachmentPages = await pdfDoc.copyPages(
            attachmentPdf, 
            attachmentPdf.getPageIndices()
        );
        
        // Add all pages from this PDF
        attachmentPages.forEach((page, index) => {
            // Only add label and footer to the first page of this PDF
            if (index === 0) {
                const { width, height } = page.getSize();
                
                // Add identifier at the top corner
                addPageLabel(page, identifier, width, height);
                
                // Add standard footer
                addPageFooter(page, width);
            }
            
            pdfDoc.addPage(page);
        });
    } catch (error) {
        console.error(`Error merging PDF attachment ${attachmentUrl}:`, error);
    }
};

/**
 * Generate final PDF document from report and attachments
 */
export const generateFinalPdf = async (
    reportBlob: Blob, 
    sources: AttachmentSource[]
): Promise<Blob> => {
    // Convert report blob to array buffer
    const reportArrayBuffer = await reportBlob.arrayBuffer();
    
    // Load the main report PDF
    let pdfDoc = await PDFDocument.load(reportArrayBuffer);
    
    // Process and add all attachments
    pdfDoc = await processAttachments(pdfDoc, sources);
    
    // Generate and return the final PDF blob
    const mergedPdfBytes = await pdfDoc.save();
    return new Blob([mergedPdfBytes], { type: 'application/pdf' });
};
