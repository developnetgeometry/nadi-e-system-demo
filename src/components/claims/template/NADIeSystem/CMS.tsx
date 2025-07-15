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
import fetchCMSData from "./hook/use-cms-data";

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
    totalBox: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        textAlign: "center",
        fontSize: 8,
        padding: 10,
        width: 80
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

type CMSProps = {
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

// Convert to an async function that returns a File object
const CMS = async ({
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

}: CMSProps): Promise<File> => {
    // Fetch CMS data based on filters
    const { cms } = await fetchCMSData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("CMS data:", cms);

    // Check for user upload attachments
    const hasAttachment = hasUploadAttachments(uploadAttachment);

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";

    // Define the PDF document (only the main report pages)
    const CMSDoc = (
        <Document>
            {/* Page 1: CMS */}
            <Page size="A4" style={styles.page}>

                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />


                        <PDFMetaSection
                            reportTitle="3.0 NADI E-System"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                <PDFSectionTitle title="3.1 CMS" />

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

                        {/* Commented out table and total boxes since data is dummy */}
                        {/*
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                            <View style={{ alignSelf: "flex-start",flexDirection: "row", justifyContent: "space-between",gap: 10 }}>
                                <View style={{ ...styles.totalBox }}>
                                    <Text>Total NADI{"\n"}</Text>
                                    <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{cms.length}</Text>
                                </View>
                                <View style={styles.totalBox}>
                                    <Text>Total Installed{"\n"}</Text>
                                    <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{cms.reduce((total, site) => total + (Number(site.pc_client_count) || 0), 0)}</Text>
                                </View>
                            </View>
                        </View>

                        {cms.length > 0 ? (
                            <PDFTable
                                data={cms}
                                columns={[
                                    { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                                    { key: "standard_code", header: "REFID" },
                                    { key: "site_name", header: "NADI" },
                                    { key: "state", header: "STATE" },
                                    { key: "pc_client_count", header: "QTY CMS PC CLIENT" },
                                    { key: "date_install", header: "DATE INSTALL" },
                                ]}
                            />
                        ) : (
                            <Text>No cms data available.</Text>
                        )}
                        */}
                    </>
                )}
                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>
        </Document>
    );
    // Create a blob from the PDF document (main report)
    const reportBlob = await pdf(CMSDoc).toBlob();

    // Process upload attachments using the reusable utility
    const { processedBlob } = await processUploadAttachments(reportBlob, {
        uploadAttachment,
        sectionTitle: "CMS",
        titlePosition: { x: 80, y: 40 },
        titleStyle: { size: 8, color: [0.5, 0.5, 0.5] }
    });

    // Generate filename based on filters
    const fileName = generatePdfFilename('cms-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([processedBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default CMS;