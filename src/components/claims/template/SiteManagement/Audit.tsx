import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
    Image,
} from "@react-pdf/renderer";
import {
    PDFFooter,
    PDFTable,
    PDFSectionTitle,
    PDFAppendixTitlePage,
    PDFPhaseQuarterInfo,
    PDFMetaSection
} from "../component/pdf-component";
// Import the actual data fetching functions, not hooks
import { fetchAuditData } from "./hook/use-audit-data";
import { fetchPhaseData } from "@/hooks/use-phase";
// Import PDF merging library
import { PDFDocument, rgb, PageSizes } from 'pdf-lib';

// Utility functions for handling attachments
const isPDF = (url: string): boolean => {
    return url.toLowerCase().endsWith('.pdf');
};

const isImage = (url: string): boolean => {
    const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff'];
    return extensions.some(ext => url.toLowerCase().endsWith(ext));
};

// Function to fetch a PDF as ArrayBuffer
const fetchPDFAsArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url);
    return await response.arrayBuffer();
};

// Function to fetch an image as ArrayBuffer
const fetchImageAsArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url);
    return await response.arrayBuffer();
};

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    },
    totalBox: {
        padding: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        textAlign: "center",
        fontSize: 12,
        width: 170, /* Fixed width to match PDFPhaseQuarterInfo */
    },
    attachmentContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    attachmentTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imageAttachment: {
        width: '100%',
        marginBottom: 20,
    },
});

type AuditProps = {
    duspFilter?: string | number;
    phaseFilter?: string | number | null;
    tpFilter?: string | number;
    nadiFilter?: (string | number)[];
    startDate?: string | null;
    endDate?: string | null;
    claimType?: string | null; //monthly/quarter/yearly
    quater?: string | null; //optional, used for quarterly reports
};

// Convert to an async function that returns a File object
const Audit = async ({
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
    startDate = null,
    endDate = null,
    claimType = null,
    quater = null

}: AuditProps): Promise<File> => {
    // Fetch audit data based on filters
    const { audits } = await fetchAuditData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("Audit data:", audits);

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const AuditDoc = (
        <Document>
            {/* Page 1: Audits */}
            <Page size="A4" style={styles.page}>
                <PDFSectionTitle title="2.3 AUDITS" />

                <PDFMetaSection
                    reportTitle="AUDIT REPORT"
                    phaseLabel={phaseLabel}
                    claimType={claimType}
                    quater={quater}
                    startDate={startDate}
                    endDate={endDate}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={styles.totalBox}>
                        {/* total NADI sites with audits */}
                        <Text>Total NADI{"\n"}{audits.length}</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </View>
                </View>

                {audits.length > 0 ? (
                    <PDFTable
                        data={audits}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "SITE CODE" },
                            { key: "site_name", header: "NADI" },
                            { key: "state", header: "STATE" },
                        ]}
                    />
                ) : (
                    <Text>No audit data available.</Text>
                )}
                <PDFFooter />
            </Page>

            {/* Page 2: APPENDIX for AUDIT - Title page */}
            <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage
                    appendixNumber="APPENDIX"
                    title="SITE AUDIT"
                />
                <PDFFooter />
            </Page>
        </Document>
    );   
    
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(AuditDoc).toBlob();
    const reportArrayBuffer = await reportBlob.arrayBuffer();
    
    // Create a PDF document from the report
    let pdfDoc = await PDFDocument.load(reportArrayBuffer);    // Process all attachments grouped by audit without additional title pages
    try {
        // For each audit that has attachments
        for (const audit of audits) {
            const attachments = audit.attachments_path || [];
            
            // Skip if no attachments
            if (attachments.length === 0) {
                continue;
            }
            
            // Process images and PDFs in the order they appear in the attachments array
            // This preserves the original order of attachments
            for (const attachmentUrl of attachments) {                
                  if (isImage(attachmentUrl)) {
                    // Handle image attachment
                    try {
                        // Fetch the image data
                        const imageBytes = await fetchImageAsArrayBuffer(attachmentUrl);
                        
                        // Create a new page for the image (A4 size)
                        const imagePage = pdfDoc.addPage(PageSizes.A4);
                        const { width, height } = imagePage.getSize();
                          // Add a small, discreet label at the top right corner of the page
                        imagePage.drawText(`${audit.standard_code}`, {
                            x: width - 80,
                            y: height - 15,  // Top right corner, same as PDF
                            size: 8,
                            color: rgb(0, 0, 0),
                        });
                        
                        try {
                            // Determine image type and embed it
                            let image;
                            if (attachmentUrl.toLowerCase().endsWith('.png')) {
                                image = await pdfDoc.embedPng(imageBytes);
                            } else if (attachmentUrl.toLowerCase().endsWith('.jpg') || 
                                     attachmentUrl.toLowerCase().endsWith('.jpeg')) {
                                image = await pdfDoc.embedJpg(imageBytes);
                            } else {
                                // For unsupported formats, just show the URL
                                imagePage.drawText(`Unsupported image format: ${attachmentUrl}`, {
                                    x: 50,
                                    y: height - 80,
                                    size: 10,
                                    color: rgb(0, 0, 0),
                                });
                                return; // Skip the rest of this iteration
                            }
                            
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
                              // Add caption text at the bottom of the page (consistent with PDF)
                            imagePage.drawText(`This document is system-generated from NADI e-System.`, {
                                x: 50,
                                y: 30, // Position at bottom (same as PDFs)
                                size: 8,
                                color: rgb(0, 0, 0),
                            });
                            
                            // Add generated date on the right side
                            const dateStr = new Date().toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            }).replace(',', '');
                            
                            imagePage.drawText(`Generated on: ${dateStr}`, {
                                x: width - 200,
                                y: 30, // Position at bottom (same as PDFs)
                                size: 8,
                                color: rgb(0, 0, 0),
                            });
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
                } else if (isPDF(attachmentUrl)) {
                    // Handle PDF attachment
                    try {
                        const attachmentBuffer = await fetchPDFAsArrayBuffer(attachmentUrl);
                        const attachmentPdf = await PDFDocument.load(attachmentBuffer);
                        const attachmentPages = await pdfDoc.copyPages(attachmentPdf, attachmentPdf.getPageIndices());
                        
                        // Add all pages from this PDF directly
                        attachmentPages.forEach((page, index) => {                            // Only add a tiny label on the first page of this PDF
                            if (index === 0) {
                                // Add a minimal label at the top corner of the first page
                                const { width, height } = page.getSize();
                                page.drawText(`${audit.standard_code}`, {
                                    x: width - 80,
                                    y: height - 15,  // Top right corner
                                    size: 8,
                                    color: rgb(0, 0, 0),
                                });
                                
                                // Add footer text at the bottom of the first page
                                page.drawText(`This document is system-generated from NADI e-System.`, {
                                    x: 50,
                                    y: 30, // Position at bottom
                                    size: 8,
                                    color: rgb(0, 0, 0),
                                });
                                
                                // Add generated date on the right side
                                const dateStr = new Date().toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                }).replace(',', '');
                                
                                page.drawText(`Generated on: ${dateStr}`, {
                                    x: width - 200,
                                    y: 30, // Position at bottom
                                    size: 8,
                                    color: rgb(0, 0, 0),
                                });
                            }
                            pdfDoc.addPage(page);
                        });
                    } catch (error) {
                        console.error(`Error merging PDF attachment ${attachmentUrl}:`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error processing attachments:", error);
    }
    
    // Generate the final PDF blob
    const mergedPdfBytes = await pdfDoc.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    
    // Generate filename based on available filters
    const dateStr = new Date().toISOString().split('T')[0];
    // Build filename parts
    let filenameParts = ['audit-report'];
    
    // Add claim type if available
    if (claimType) {
        filenameParts.push(claimType);
    }
    
    // Add phase name if available
    if (phase?.name) {
        filenameParts.push(phase.name.replace(/\s+/g, '-'));
    }
    
    // Always add the current date
    filenameParts.push(dateStr);
    
    // Combine all parts with hyphens and add extension
    let fileName = `${filenameParts.join('-')}.pdf`;

    // Convert blob to File object with metadata
    return new File([blob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default Audit;