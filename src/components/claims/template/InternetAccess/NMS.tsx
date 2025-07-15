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
    PDFMetaSection,
    PDFHeader
} from "../component/pdf-component";
// Import the actual data fetching functions, not hooks
import { fetchPhaseData } from "@/hooks/use-phase";
import fetchNMSData from "./hook/use-nms-data";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";
// Import the new upload attachment handler
import { processUploadAttachments, hasUploadAttachments } from "../component/pdf-upload-handler";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        paddingBottom: 80, // <-- Increased bottom padding to avoid overlap with footer
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    },
    placeholderBox: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        textAlign: "center",
        fontSize: 12,
        padding: 60,
        marginTop: 20,
    },
    attachmentMessageBox: {
        backgroundColor: "#fafafa",
        borderWidth: 1,
        borderColor: "#ccc",
        borderStyle: "solid",
        textAlign: "center",
        fontSize: 12,
        padding: 20,
        marginTop: 20,
        color: "#666",
    },
});

type NMSProps = {
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
    uploadAttachment?: File[] | File | null; // Support both single file and array
};

const NMS = async ({
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
}: NMSProps): Promise<File> => {
    // Fetch NMS data based on filters (for reference, but attachments won't be displayed)
    const { nms } = await fetchNMSData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("NMS data:", nms);

    // Check for user upload attachments
    const hasAttachment = hasUploadAttachments(uploadAttachment);

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";

    // Define the PDF document using @react-pdf/renderer
    const NMSReportDoc = (
        <Document>
            {/* Page 1: NMS */}
            <Page size="A4" style={styles.page}>

                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />

                        <PDFMetaSection
                            reportTitle="4.0 INTERNET ACCESS"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                <PDFSectionTitle title="4.2 NMS" />

                {/* If attachment provided, show minimal content and let PDF-lib handle attachment */}
                {hasAttachment ? (
                    <View style={styles.attachmentMessageBox}>
                        <Text>
                            Please refer to the next page for the detailed information.
                        </Text>
                    </View>
                ) : (
                    <>
                        {!header && (
                            <View style={{ alignSelf: "flex-end", marginBottom: 10 }}>
                                {/* when header not provided, show phase and quarter info */}
                                <PDFPhaseQuarterInfo
                                    phaseLabel={phaseLabel}
                                    claimType={claimType}
                                    quater={quater}
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                            </View>
                        )}
                    </>
                )}

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>
        </Document>
    );

    // Create a blob from the PDF document (main report)
    const reportBlob = await pdf(NMSReportDoc).toBlob();

    // Process upload attachments using the reusable utility
    const { processedBlob } = await processUploadAttachments(reportBlob, {
        uploadAttachment,
        sectionTitle: "NMS",
        titlePosition: { x: 80, y: 40 },
        titleStyle: { size: 8, color: [0.5, 0.5, 0.5] }
    });

    // Generate filename based on filters
    const fileName = generatePdfFilename('nms-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([processedBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default NMS;