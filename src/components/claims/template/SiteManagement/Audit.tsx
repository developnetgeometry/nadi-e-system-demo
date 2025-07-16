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
import { fetchAuditData } from "./hook/use-audit-data";
import { fetchPhaseData } from "@/hooks/use-phase";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";
import { generateFinalPdf, AttachmentSource } from "../component/pdf-attachment-handler";

const styles = StyleSheet.create({
    page: {
        padding: 40,
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
    header?: boolean; // Optional header for the PDF
    dusplogo?: string | null; // Optional DUSP logo
    uploadAttachment?: File | null;
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
    quater = null,
    header = false,
    dusplogo = null,
    uploadAttachment = null,

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

                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />


                        <PDFMetaSection
                            reportTitle="2.0 Site Management"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                <PDFSectionTitle title="2.3 AUDITS" />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                        <View style={{ ...styles.totalBox }}>
                            <Text>Total NADI</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{audits.length}</Text>
                        </View>
                    </View>
                    {!header && (
                        <View style={{ alignSelf: "flex-end" }}>
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
                </View>

                {audits.length > 0 ? (
                    <PDFTable
                        data={audits}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "REFID", width: "20%" },
                            { key: "site_name", header: "NADI", width: "35%" },
                            { key: "state", header: "STATE", width: "25%" },
                            { 
                                key: "status", 
                                header: "STATUS", 
                                width: "15%",
                                align: "center",
                                render: (value, item) => item.status ? "Done" : "-"
                            },
                        ]}
                    />
                ) : (
                    <Text>No audit data available.</Text>
                )}
                <PDFFooter />
            </Page>

            {/* Page 2: APPENDIX for AUDIT - Title page */}
            {/* <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage
                    appendixNumber="APPENDIX"
                    title="SITE AUDIT"
                />
                <PDFFooter />
            </Page> */}
        </Document>
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(AuditDoc).toBlob();

    // Process all audits that have attachments as sources for generateFinalPdf
    // const sources: AttachmentSource[] = audits
    //     .filter(audit => audit.attachments_path && audit.attachments_path.length > 0)
    //     .map(audit => ({
    //         attachments_path: audit.attachments_path || [],
    //         standard_code: audit.standard_code,
    //     }));

    // Generate the final PDF by merging the report with attachment pages
    // const finalPdfBlob = await generateFinalPdf(reportBlob, sources);

    // Generate filename based on filters
    const fileName = generatePdfFilename('audit-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default Audit;