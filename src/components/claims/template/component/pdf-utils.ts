import { PDFDocument, rgb, PageSizes } from 'pdf-lib';

/**
 * Checks if a URL points to a PDF file
 */
export const isPDF = (url: string): boolean => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf');
};

/**
 * Checks if a URL points to an image file
 */
export const isImage = (url: string): boolean => {
    if (!url) return false;
    const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff'];
    return extensions.some(ext => url.toLowerCase().endsWith(ext));
};

/**
 * Fetches a PDF file from a URL and returns it as an ArrayBuffer
 */
export const fetchPDFAsArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
    if (!url) throw new Error('Cannot fetch from undefined or empty URL');
    const response = await fetch(url);
    return await response.arrayBuffer();
};

/**
 * Fetches an image from a URL and returns it as an ArrayBuffer
 */
export const fetchImageAsArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
    if (!url) throw new Error('Cannot fetch from undefined or empty URL');
    const response = await fetch(url);
    return await response.arrayBuffer();
};

/**
 * Creates a formatted timestamp string
 */
export const getFormattedDateString = (): string => {
    return new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).replace(',', '');
};

/**
 * Adds a standard footer to a PDF page
 */
export const addPageFooter = (page: any, width: number): void => {
    // Add footer text at the bottom
    page.drawText(`This document is system-generated from NADI e-System.`, {
        x: 50,
        y: 30,
        size: 8,
        color: rgb(0, 0, 0),
    });
    
    // Add generated date on the right side
    const dateStr = getFormattedDateString();
    
    page.drawText(`Generated on: ${dateStr}`, {
        x: width - 200,
        y: 30,
        size: 8,
        color: rgb(0, 0, 0),
    });
};

/**
 * Adds a label to the top right of a PDF page
 */
export const addPageLabel = (page: any, label: string, width: number, height: number): void => {
    page.drawText(label, {
        x: width - 80,
        y: height - 15,
        size: 8,
        color: rgb(0, 0, 0),
    });
};

/**
 * Embeds an image into a PDF document based on its type
 */
export const embedImageByType = async (pdfDoc: PDFDocument, imageBytes: ArrayBuffer, url: string) => {
    if (!url) throw new Error('URL cannot be undefined or empty');
    
    if (url.toLowerCase().endsWith('.png')) {
        return await pdfDoc.embedPng(imageBytes);
    } else if (url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg')) {
        return await pdfDoc.embedJpg(imageBytes);
    }
    throw new Error(`Unsupported image format: ${url}`);
};

/**
 * Generates a filename for the PDF based on available filters
 */
export const generatePdfFilename = (prefix: string, claimType: string | null, phaseName: string | null): string => {
    // Generate filename based on available filters
    const dateStr = new Date().toISOString().split('T')[0];
    
    // Build filename parts
    let filenameParts = [prefix];
    
    // Add claim type if available
    if (claimType) {
        filenameParts.push(claimType);
    }
    
    // Add phase name if available
    if (phaseName) {
        filenameParts.push(phaseName.replace(/\s+/g, '-'));
    }
    
    // Always add the current date
    filenameParts.push(dateStr);
    
    // Combine all parts with hyphens and add extension
    return `${filenameParts.join('-')}.pdf`;
};
