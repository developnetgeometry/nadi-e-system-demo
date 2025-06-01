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
import fetchAwarenessPromotionData from "./hook/use-A&P-data";
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

type AwarenessPromotionDataProps = {
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
};

// Convert to an async function that returns a File object
const AwarenessPromotion = async ({
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
    startDate = null,
    endDate = null,
    claimType = null,
    quater = null,
    header = false,
    dusplogo = null

}: AwarenessPromotionDataProps): Promise<File> => {
    // Fetch anp data based on filters
    const { anp } = await fetchAwarenessPromotionData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("anp data:",anp);

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const AwarenessPromotionDoc = (
        <Document>
            {/* Page 1: AWARENESS & PROMOTION PROGRAMME */}
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

                <PDFSectionTitle title="2.6 AWARENESS & PROMOTION PROGRAMME" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={styles.totalBox}>
                        {/* total NADI sites with anp */}
                        <Text>Total NADI{"\n"}{anp.length}</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        {/* when header not provided, show phase and quarter info */}
                        {!header && (
                            <PDFPhaseQuarterInfo
                                phaseLabel={phaseLabel}
                                claimType={claimType}
                                quater={quater}
                                startDate={startDate}
                                endDate={endDate}
                            />
                        )}
                    </View>
                </View>

                {anp.length > 0 ? (
                    <PDFTable
                        data={anp}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "REFID" },
                            { key: "site_name", header: "NADI" },
                            { key: "state", header: "STATE" },
                            { key: "programme_name", header: "PROGRAM NAME" },
                            { key: "programme_date", header: "DATE" },
                        ]}
                    />
                ) : (
                    <Text>No anp data available.</Text>
                )}
                <PDFFooter />
            </Page>

            {/* Page 2: APPENDIX for ANP - Title page */}
            <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage
                    appendixNumber="APPENDIX"
                    title="AWARENESS & PROMOTION PROGRAMME"
                />
                <PDFFooter />
            </Page>
        </Document>
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(AwarenessPromotionDoc).toBlob();

    // Process all anp that have attachments as sources for generateFinalPdf
    const sources: AttachmentSource[] = anp
        .filter(anp => anp.attachments_path && anp.attachments_path.length > 0)
        .map(anp => ({
            attachments_path: anp.attachments_path || [],
            standard_code: anp.standard_code,
        }));

    // Generate the final PDF by merging the report with attachment pages
    const finalPdfBlob = await generateFinalPdf(reportBlob, sources);

    // Generate filename based on filters
    const fileName = generatePdfFilename('awareness-promotion-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([finalPdfBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default AwarenessPromotion;