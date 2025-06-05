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
 * Adds a standard footer to a PDF page (styled to match PDFFooter in pdf-component)
 */
export const addPageFooter = (page: any, width: number): void => {
    // Draw a faint horizontal line above the footer
    page.drawRectangle({
        x: 40,
        y: 48, // 18px above the footer text (y=30)
        width: width - 80,
        height: 1,
        color: rgb(0.66, 0.66, 0.66),
        opacity: 0.3,
        borderWidth: 0,
    });

    // Footer text (left)
    const leftText = 'This document is system-generated from NADI e-System.';
    // Footer text (right, generated date)
    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const rightText = `Generated on: ${formattedDateTime}`;
    const fontSize = 9;
    const color = rgb(0.4, 0.4, 0.4); // #666
    // Estimate right text width
    const approxCharWidth = fontSize * 0.6;
    const rightTextWidth = rightText.length * approxCharWidth;
    // Draw left text
    page.drawText(leftText, {
        x: 40,
        y: 30,
        size: fontSize,
        color,
    });
    // Draw right text
    page.drawText(rightText, {
        x: width - 40 - rightTextWidth,
        y: 30,
        size: fontSize,
        color,
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

/**
 * Draws a section title styled like PDFSectionTitle from react-pdf, using pdf-lib
 * @param page The PDF page to draw on
 * @param title The section title text
 * @param x The x coordinate (default 40)
 * @param y The y coordinate (from top, required)
 * @param width The width of the section title box (default 520)
 * @param height The height of the section title box (default 24)
 */
export const drawSectionTitle = (
    page: any,
    title: string,
    x: number = 40,
    y: number,
    width: number = 520,
    height: number = 24
) => {
    // Match PDFSectionTitle: left-aligned, font size 10, bold, padding 8, uppercase
    const fontSize = 10;
    const padding = 8;
    // Draw black background rectangle
    page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        color: rgb(0, 0, 0),
    });
    // Draw white, bold, uppercase text left-aligned with padding
    const text = title.toUpperCase();
    // Simulate bold by drawing twice with slight offset
    page.drawText(text, {
        x: x + padding,
        y: y - height + (height - fontSize) / 2 + 1,
        size: fontSize,
        color: rgb(1, 1, 1),
    });
    page.drawText(text, {
        x: x + padding + 0.5,
        y: y - height + (height - fontSize) / 2 + 1,
        size: fontSize,
        color: rgb(1, 1, 1),
    });
};

/**
 * Draws a PDF header with two logos and a centered title, matching PDFHeader React component
 * @param page The PDF page to draw on
 * @param mcmcImage The embedded image object for the left logo
 * @param duspImage The embedded image object for the right logo
 * @param x The left margin (default 40)
 * @param y The y coordinate from top (default 800)
 * @param width The total width of the header (default 520)
 * @param height The height of the header (default 60)
 */
export const drawPDFHeader = (
    page: any,
    mcmcImage: any,
    duspImage: any,
    x: number = 40,
    y: number = 800,
    width: number = 520,
    height: number = 60
) => {
    // Both logos: height 60, width auto (preserve aspect ratio)
    let logoHeight = 60;
    let mcmcLogoWidth = mcmcImage ? (mcmcImage.width / mcmcImage.height) * logoHeight : 0;
    let duspLogoWidth = duspImage ? (duspImage.width / duspImage.height) * logoHeight : 0;
    // 25% width for each logo section
    const sectionWidth = width * 0.25;
    // Draw left logo (left-aligned in section)
    if (mcmcImage) {
        page.drawImage(mcmcImage, {
            x: x + (sectionWidth - mcmcLogoWidth) / 2,
            y: y - logoHeight,
            width: mcmcLogoWidth,
            height: logoHeight,
        });
    }
    // Draw right logo (right-aligned in section)
    if (duspImage) {
        page.drawImage(duspImage, {
            x: x + width - sectionWidth + (sectionWidth - duspLogoWidth) / 2,
            y: y - logoHeight,
            width: duspLogoWidth,
            height: logoHeight,
        });
    }
    // Draw centered title (centered in header)
    const title1 = 'THE NATIONAL INFORMATION';
    const title2 = 'DISSEMINATION CENTRE (NADI)';
    const fontSize = 14;
    const centerX = x + width / 2;
    // Estimate text width for centering
    const approxCharWidth = fontSize * 0.6;
    const t1Width = title1.length * approxCharWidth;
    const t2Width = title2.length * approxCharWidth;
    // Vertically center the titles in the header
    const title1Y = y - 18;
    const title2Y = y - 38;
    // Simulate bold by drawing twice with slight offset
    page.drawText(title1, {
        x: centerX - t1Width / 2,
        y: title1Y,
        size: fontSize,
        color: rgb(0, 0, 0),
    });
    page.drawText(title1, {
        x: centerX - t1Width / 2 + 0.5,
        y: title1Y,
        size: fontSize,
        color: rgb(0, 0, 0),
    });
    page.drawText(title2, {
        x: centerX - t2Width / 2,
        y: title2Y,
        size: fontSize,
        color: rgb(0, 0, 0),
    });
    page.drawText(title2, {
        x: centerX - t2Width / 2 + 0.5,
        y: title2Y,
        size: fontSize,
        color: rgb(0, 0, 0),
    });
};

/**
 * Draws a PDF meta section (report info table) similar to PDFMetaSection React component
 * @param page The PDF page to draw on
 * @param reportTitle The report title
 * @param phaseLabel The phase label
 * @param claimType The claim type (monthly/quarterly/yearly/null)
 * @param quater The quarter (if any)
 * @param startDate The start date (string or null)
 * @param endDate The end date (string or null)
 * @param x The left margin (default 40)
 * @param y The y coordinate from top (default 730)
 * @param width The total width (default 520)
 * @param rowHeight The height of each row (default 24)
 */
export const drawPDFMetaSection = (
    page: any,
    reportTitle: string,
    phaseLabel?: string,
    claimType?: string | null,
    quater?: string | number | null,
    startDate?: string | null,
    endDate?: string | null,
    x: number = 40,
    y: number = 730,
    width: number = 520,
    rowHeight: number = 24
) => {
    // Determine periodType
    const periodType = claimType ?
        (claimType.toLowerCase() === 'monthly' ? 'MONTH / YEAR' :
            claimType.toLowerCase() === 'quarterly' ? 'QUARTER / YEAR' :
                claimType.toLowerCase() === 'yearly' ? 'YEAR' :
                    'All Time') : 'All Time';
    // Format period value
    let formattedPeriodValue = '-';
    const month = startDate ? new Date(startDate).toLocaleString('default', { month: 'short' }) : null;
    const year = endDate ? new Date(endDate).getFullYear().toString() : null;
    if (periodType === 'MONTH / YEAR' && month && year) {
        formattedPeriodValue = `${month} ${year}`;
    } else if (periodType === 'QUARTER / YEAR' && quater && year) {
        formattedPeriodValue = `${quater} ${year}`;
    } else if (periodType === 'YEAR' && year) {
        formattedPeriodValue = `${year}`;
    }
    // Draw outer border
    page.drawRectangle({
        x,
        y: y - rowHeight * 2,
        width,
        height: rowHeight * 2,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: undefined,
    });
    // First row: REPORT
    // Label cell (black bg)
    page.drawRectangle({
        x,
        y: y - rowHeight,
        width: width * 0.2,
        height: rowHeight,
        color: rgb(0, 0, 0),
    });
    page.drawText('REPORT', {
        x: x + 8,
        y: y - rowHeight + 6,
        size: 10,
        color: rgb(1, 1, 1),
    });
    // Value cell
    page.drawText(reportTitle, {
        x: x + width * 0.2 + 8,
        y: y - rowHeight + 6,
        size: 10,
        color: rgb(0, 0, 0),
    });
    // Second row: PHASE, PERIOD
    // PHASE label (black bg)
    page.drawRectangle({
        x,
        y: y - rowHeight * 2,
        width: width * 0.2,
        height: rowHeight,
        color: rgb(0, 0, 0),
    });
    page.drawText('PHASE', {
        x: x + 8,
        y: y - rowHeight * 2 + 6,
        size: 10,
        color: rgb(1, 1, 1),
    });
    // PHASE value
    page.drawText(phaseLabel || '-', {
        x: x + width * 0.2 + 8,
        y: y - rowHeight * 2 + 6,
        size: 10,
        color: rgb(0, 0, 0),
    });
    // PERIOD label (black bg)
    page.drawRectangle({
        x: x + width * 0.5,
        y: y - rowHeight * 2,
        width: width * 0.25,
        height: rowHeight,
        color: rgb(0, 0, 0),
    });
    page.drawText(periodType, {
        x: x + width * 0.5 + 8,
        y: y - rowHeight * 2 + 6,
        size: 10,
        color: rgb(1, 1, 1),
    });
    // PERIOD value
    page.drawText(formattedPeriodValue, {
        x: x + width * 0.75 + 8,
        y: y - rowHeight * 2 + 6,
        size: 10,
        color: rgb(0, 0, 0),
    });
    // Draw horizontal lines
    page.drawLine({
        start: { x, y: y - rowHeight },
        end: { x: x + width, y: y - rowHeight },
        thickness: 1,
        color: rgb(0, 0, 0),
    });
    // Draw vertical lines for columns
    page.drawLine({
        start: { x: x + width * 0.2, y: y },
        end: { x: x + width * 0.2, y: y - rowHeight * 2 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });
    page.drawLine({
        start: { x: x + width * 0.5, y: y - rowHeight },
        end: { x: x + width * 0.5, y: y - rowHeight * 2 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });
    page.drawLine({
        start: { x: x + width * 0.75, y: y - rowHeight },
        end: { x: x + width * 0.75, y: y - rowHeight * 2 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });
};

/**
 * Draws a PDF footer similar to PDFFooter React component
 * @param page The PDF page to draw on
 * @param width The width of the page (default 520)
 * @param y The y coordinate from bottom (default 30)
 * @param customText Optional custom text for the left side
 */
export const drawPDFFooter = (
    page: any,
    width: number = 520,
    y: number = 30,
    customText?: string
) => {
    // Draw a faint horizontal line
    page.drawRectangle({
        x: 40,
        y: y + 18,
        width: width - 80,
        height: 1,
        color: rgb(0.66, 0.66, 0.66),
        opacity: 0.3,
        borderWidth: 0,
    });
    // Footer text (left)
    const leftText = customText || 'This document is system-generated from NADI e-System.';
    // Footer text (right, generated date)
    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    // Left text
    page.drawText(leftText, {
        x: 40,
        y,
        size: 9,
        color: rgb(0.4, 0.4, 0.4),
    });
    // Right text
    const rightText = `Generated on: ${formattedDateTime}`;
    // Estimate right text width
    const fontSize = 9;
    const approxCharWidth = fontSize * 0.6;
    const rightTextWidth = rightText.length * approxCharWidth;
    page.drawText(rightText, {
        x: width - 40 - rightTextWidth,
        y,
        size: 9,
        color: rgb(0.4, 0.4, 0.4),
    });
};

/**
 * Draws a black border box for attachments (image or PDF)
 */
export const drawAttachmentBorder = (page: any, pageWidth: number, currentY: number) => {
    const borderX = 40;
    const borderY = currentY - 400;
    const borderWidth = pageWidth - 80;
    const borderHeight = 400;
    page.drawRectangle({
        x: borderX,
        y: borderY,
        width: borderWidth,
        height: borderHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(1, 1, 1),
    });
    return { borderX, borderY, borderWidth, borderHeight };
};

/**
 * Draws an image inside the border box, scaling and centering it
 */
export const drawImageInBorder = async (
    page: any,
    path: string,
    pdfDoc: PDFDocument,
    borderX: number,
    borderY: number,
    borderWidth: number,
    borderHeight: number
) => {
    const imgX = borderX + 10;
    const imgY = borderY + 10;
    const imgWidthMax = borderWidth - 20;
    const imgHeightMax = borderHeight - 20;
    try {
        const imgBytes = await fetch(path).then(r => r.arrayBuffer());
        const imgObj = await embedImageByType(pdfDoc, imgBytes, path);
        let imgWidth = imgObj.width;
        let imgHeight = imgObj.height;
        const scale = Math.min(imgWidthMax / imgWidth, imgHeightMax / imgHeight, 1);
        imgWidth *= scale;
        imgHeight *= scale;
        page.drawImage(imgObj, {
            x: imgX + (imgWidthMax - imgWidth) / 2,
            y: imgY + (imgHeightMax - imgHeight) / 2,
            width: imgWidth,
            height: imgHeight,
        });
    } catch (e) {
        page.drawText('Image not available', {
            x: imgX + 10,
            y: imgY + imgHeightMax / 2,
            size: 12,
            color: rgb(1, 0, 0),
        });
    }
};
