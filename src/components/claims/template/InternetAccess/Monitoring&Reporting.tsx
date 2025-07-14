import {
    PDFDocument,
    PageSizes,
    rgb
} from 'pdf-lib';
import { drawPDFHeader, drawPDFMetaSection, drawSectionTitle, drawPDFFooter, embedImageByType, generatePdfFilename, drawAttachmentBorder, drawImageInBorder } from "../component/pdf-utils";
import { fetchPhaseData } from "@/hooks/use-phase";
import fetchMonitoringData from "./hook/use-monitoring-reporting-data";


type MonitoringProps = {
    duspFilter?: string | number;
    phaseFilter?: string | number | null;
    tpFilter?: string | number;
    nadiFilter?: (string | number)[];
    startDate?: string | null;
    endDate?: string | null;
    claimType?: string | null; //monthly/quarter/yearly
    quater?: string | null; //optional, used for quarterly reports
    header?: boolean; // Optional header for the PDF
    dusplogo?: string | null; // Optional DUSP logo
    uploadAttachment?: File | null;
};

const Monitoring = async ({
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
    startDate = null,
    endDate = null,
    claimType = null,
    quater = null,
    header = false,
    dusplogo = null,
    uploadAttachment = null,

}: MonitoringProps): Promise<File> => {
    // Fetch Monitoring data based on filters
    const { monitor } = await fetchMonitoringData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    const phaseLabel = phase?.name || "All Phases";

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const [pageWidth, pageHeight] = PageSizes.A4;
    let page: any = null;
    let y = pageHeight - 40; // Start below top margin

    // Fetch and embed images (move to outer scope for reuse)
    let mcmcImage: any = undefined;
    let duspImage: any = undefined;
    if (header) {
        const mcmcLogoUrl = '/MCMC_Logo.png';
        const duspLogoUrl = dusplogo || '';
        const mcmcLogoBytes = await fetch(mcmcLogoUrl).then(r => r.arrayBuffer());
        if (duspLogoUrl) {
            try {
                const duspLogoBytes = await fetch(duspLogoUrl).then(r => r.arrayBuffer());
                duspImage = await embedImageByType(pdfDoc, duspLogoBytes, duspLogoUrl);
            } catch (e) {
                duspImage = undefined;
            }
        }
        mcmcImage = await embedImageByType(pdfDoc, mcmcLogoBytes, mcmcLogoUrl);
    }

    // Gather all attachments
    const allAttachments = monitor.flatMap(site => site.attachments_path);
    const hasContent = allAttachments.length > 0;

    // Only process attachments if there are any
    if (hasContent) {
        let firstAttachment = true;
        for (const path of allAttachments) {
            if (typeof path !== 'string') continue;
            const isImage = /\.(png|jpg|jpeg|gif|webp|bmp|tiff)$/i.test(path);
            const isPdf = path.toLowerCase().endsWith('.pdf');
            if (!isImage && !isPdf) continue;

            // Create a new page for each attachment
            let currentPage, currentY, currentWidth, currentHeight;
            if (isImage) {
                currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                currentY = pageHeight - 40;
                currentWidth = pageWidth;
                currentHeight = pageHeight;
            }
            if (isPdf) {
                try {
                    const pdfBytes = await fetch(path).then(r => r.arrayBuffer());
                    const extPdf = await PDFDocument.load(pdfBytes);
                    const [copiedPage] = await pdfDoc.copyPages(extPdf, [0]);
                    currentPage = pdfDoc.addPage(copiedPage);
                    currentWidth = currentPage.getWidth();
                    currentHeight = currentPage.getHeight();
                    currentY = currentHeight - 40;
                } catch (e) {
                    const errPage = pdfDoc.addPage([pageWidth, pageHeight]);
                    errPage.drawText('PDF not available', {
                        x: 50,
                        y: pageHeight / 2,
                        size: 12,
                        color: rgb(1, 0, 0),
                    });
                    drawPDFFooter(errPage, pageWidth);
                    firstAttachment = false;
                    continue;
                }
            }

            // Only first page gets header/meta
            if (firstAttachment && header) {
                drawPDFHeader(currentPage, mcmcImage, duspImage, 40, currentY, currentWidth - 80, 60);
                currentY -= 70;
                drawPDFMetaSection(
                    currentPage,
                    "4.0 INTERNET ACCESS",
                    phaseLabel,
                    claimType,
                    quater,
                    startDate,
                    endDate,
                    40,
                    currentY,
                    currentWidth - 80,
                    24
                );
                currentY -= 60;
            }
            drawSectionTitle(currentPage, "4.3 MONITORING & REPORTING", 40, currentY, currentWidth - 80, 24);
            currentY -= 34;

            // Draw black border for image attachments only
            if (isImage) {
                const { borderX, borderY, borderWidth, borderHeight } = drawAttachmentBorder(currentPage, pageWidth, currentY);
                await drawImageInBorder(currentPage, path, pdfDoc, borderX, borderY, borderWidth, borderHeight);
            }
            // For PDF: do not draw border, just import the page as before
            drawPDFFooter(currentPage, currentWidth);
            firstAttachment = false;
        }
    } else {
        // If there are no attachments, create a page and show the label
        const emptyPage = pdfDoc.addPage([pageWidth, pageHeight]);
        let emptyY = pageHeight - 40;
        if (header) {
            drawPDFHeader(emptyPage, mcmcImage, duspImage, 40, emptyY, pageWidth - 80, 60);
            emptyY -= 70;
            drawPDFMetaSection(
                emptyPage,
                "4.0 INTERNET ACCESS",
                phaseLabel,
                claimType,
                quater,
                startDate,
                endDate,
                40,
                emptyY,
                pageWidth - 80,
                24
            );
            emptyY -= 60;
        }
        drawSectionTitle(emptyPage, "4.3 MONITORING & REPORTING", 40, emptyY, pageWidth - 80, 24);
        emptyY -= 34;
        const boxX = 40;
        const boxY = emptyY - 120;
        const boxWidth = pageWidth - 80;
        const boxHeight = 120;
        emptyPage.drawRectangle({
            x: boxX,
            y: boxY,
            width: boxWidth,
            height: boxHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            color: rgb(1, 1, 1),
        });
        // Center the text horizontally and vertically in the box
        const label = 'Attachment Uptime & Downtime';
        const fontSize = 12;
        // Estimate text width (pdf-lib default font is about 0.5*fontSize per char for uppercase)
        const textWidth = label.length * fontSize * 0.5;
        const textX = boxX + (boxWidth - textWidth) / 2;
        const textY = boxY + (boxHeight - fontSize) / 2;
        emptyPage.drawText(label, {
            x: textX,
            y: textY,
            size: fontSize,
            color: rgb(1, 0, 0),
        });
        drawPDFFooter(emptyPage, pageWidth);
    }
    // Serialize PDF
    const pdfBytes = await pdfDoc.save();
    // Generate filename based on filters
    const fileName = generatePdfFilename('monitoring-reporting-report', claimType, phase?.name);
    // Convert to File object
    return new File([pdfBytes], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default Monitoring;