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
import { PDFDocument } from 'pdf-lib';

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
    const phaseLabel = phase?.name || "All Phases";

    // Define the PDF document
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
            </Page>            {/* Page 2: APPENDIX for AUDIT - Only show if there are audit attachments */}
            <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage
                    appendixNumber="APPENDIX"
                    title="SITE AUDIT"
                />
                <PDFFooter />
            </Page>
            
            {/* Image attachment pages - One image per page */}
            {audits.flatMap((audit, auditIndex) => 
                (audit.attachments_path || [])
                    .filter(isImage)
                    .map((attachmentPath, attachIndex) => (
                        <Page key={`${auditIndex}-${attachIndex}`} size="A4" style={styles.page}>
                            <View style={styles.attachmentContainer}>
                                <Text style={styles.attachmentTitle}>
                                    Attachment for {audit.site_name} ({audit.standard_code})
                                </Text>
                                <Image src={attachmentPath} style={styles.imageAttachment} />
                            </View>
                            <PDFFooter />
                        </Page>
                    ))
            )}
        </Document>
    );// Get all attachment paths from audit data
    const attachmentPaths = audits.flatMap(audit => audit.attachments_path || []);
    
    // Separate attachments into images and PDFs
    const imageAttachments = attachmentPaths.filter(isImage);
    const pdfAttachments = attachmentPaths.filter(isPDF);

    // Create a blob from the PDF document
    const reportBlob = await pdf(AuditDoc).toBlob();
    const reportArrayBuffer = await reportBlob.arrayBuffer();
    
    // Create a PDF document from the report
    let pdfDoc = await PDFDocument.load(reportArrayBuffer);

    // If there are PDF attachments, merge them with the main document
    if (pdfAttachments.length > 0) {
        try {
            for (const pdfUrl of pdfAttachments) {
                try {
                    const attachmentBuffer = await fetchPDFAsArrayBuffer(pdfUrl);
                    const attachmentPdf = await PDFDocument.load(attachmentBuffer);
                    const attachmentPages = await pdfDoc.copyPages(attachmentPdf, attachmentPdf.getPageIndices());
                    attachmentPages.forEach(page => pdfDoc.addPage(page));
                } catch (error) {
                    console.error(`Error merging PDF attachment ${pdfUrl}:`, error);
                }
            }
        } catch (error) {
            console.error("Error merging PDF attachments:", error);
        }
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